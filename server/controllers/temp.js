import fs from "fs";
import path from "path";
import { promisify } from "util";
import axios from "axios";
import { fileURLToPath } from "url";

const endpoint = process.env.AZURE_ENDPOINT;
const apiKey = process.env.AZURE_API_KEY;

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Convert promisify for async writeFile
const writeFileAsync = promisify(fs.writeFile);

export const extractExpiryDateAzure = async (req, res) => {
  try {
    const { image } = req.body; // Receiving base64 image

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Ensure the uploads directory exists
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Convert base64 to an image file
    const imagePath = path.join(uploadDir, "image.jpg");
    await writeFileAsync(imagePath, image, "base64");

    console.log("Image saved at:", imagePath);

    // Send the image to Azure for processing
    const imageBuffer = fs.readFileSync(imagePath);
    console.log("Image buffer:", imageBuffer);

    const response = await axios.post(
      `${endpoint}/vision/v3.2/read/analyze`,
      imageBuffer,
      {
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey,
          "Content-Type": "application/octet-stream",
        },
      }
    );

    // Step 2: Get the operation location URL
    const operationUrl = response.headers["operation-location"];
    if (!operationUrl) {
      throw new Error("Operation URL not found in response");
    }

    console.log("Processing image, waiting for results...");

    // Step 3: Poll for the result (Azure takes time to process)
    let extractedText = "";
    let resultReady = false;

    while (!resultReady) {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 sec before retrying

      const resultResponse = await axios.get(operationUrl, {
        headers: { "Ocp-Apim-Subscription-Key": apiKey },
      });

      if (resultResponse.data.status === "succeeded") {
        resultReady = true;
        extractedText = resultResponse.data.analyzeResult.readResults
          .map((page) => page.lines.map((line) => line.text).join("\n"))
          .join("\n");
      } else if (resultResponse.data.status === "failed") {
        throw new Error("Text extraction failed");
      }
    }

    // console.log("Extracted Text:\n", extractedText);

    // Step 4: Extract expiry dates from text
    const expiryDate = extractExpiryDateFromText(extractedText);
    console.log("Formatted Expiry Date:", expiryDate);

    res.json({ expiryDate });
  } catch (error) {
    console.error("Error extracting expiry date:", error.message);
    return "Failed to extract expiry date.";
  }
};

// Function to extract expiry dates from text
function extractExpiryDateFromText(text) {
  const datePatterns = [
    /\b(\d{2})[\/-](\d{2})[\/-](\d{4})\b/, // DD/MM/YYYY or MM/DD/YYYY
    /\b(\d{2})[\/-](\d{4})\b/, // MM/YYYY
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)[\/-](\d{4})\b/, // Month-YYYY
  ];

  let extractedDate = null;

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      if (match.length === 4) {
        extractedDate = new Date(`${match[3]}-${match[2]}-${match[1]}`);
      } else if (match.length === 3) {
        extractedDate = new Date(`${match[2]}-${match[1]}-15`);
      }
    }
  }

  return extractedDate
    ? `${extractedDate.getDate()}/${
        extractedDate.getMonth() + 1
      }/${extractedDate.getFullYear()}`
    : "Not found";
}
