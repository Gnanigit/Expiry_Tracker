import fs from "fs";
import path from "path";
import { promisify } from "util";
import axios from "axios";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const endpoint = process.env.AZURE_ENDPOINT;
const apiKey_1 = process.env.AZURE_API_KEY_1;
const apiKey_2 = process.env.AZURE_API_KEY_2;

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Convert promisify for async writeFile
const writeFileAsync = promisify(fs.writeFile);

export const extractExpiryDateAzure = async (req, res) => {
  try {
    const { image } = req.body;

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

    // console.log("Image saved at:", imagePath);

    // Send the image to Azure for processing
    const imageBuffer = fs.readFileSync(imagePath);
    // console.log("Image buffer:", imageBuffer);
    const response = await axios.post(
      `${endpoint}/vision/v3.2/read/analyze`,
      imageBuffer,
      {
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey_1,
          "Content-Type": "application/octet-stream",
        },
        params: {
          features: "Read",
          language: "en",
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
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const resultResponse = await axios.get(operationUrl, {
        headers: { "Ocp-Apim-Subscription-Key": apiKey_1 },
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
    // console.log("Formatted Expiry Date:", expiryDate);

    res.json({ expiryDate });
  } catch (error) {
    console.error("Error extracting expiry date:", error.message);
    return "Failed to extract expiry date.";
  }
};

// Function to extract expiry dates from text
function extractExpiryDateFromText(text) {
  const datePatterns = [
    /\b(\d{2})[\/-](\d{2})[\/-](\d{4}|\d{2})\b/g, // DD/MM/YYYY or DD-MM-YYYY or DD/MM/YY or DD-MM-YY
    /\b(\d{2})[\/-](\d{4}|\d{2})\b/g, // MM-YYYY or MM/YYYY or MM-YY or MM/YY
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)[\/-](\d{4}|\d{2})\b/g, // Full month name-YYYY or month/YYYY or month-YY or month/YY
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[\/-](\d{4}|\d{2})\b/g, // Short month name-YYYY or short month/YYYY or short month-YY or short month/YY
  ];

  let extractedDates = [];

  for (const pattern of datePatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      let year = match[match.length - 1];
      if (year.length === 2) {
        year = `20${year}`; // Convert YY to 20YY (assuming 21st century dates)
      }
      if (match.length === 4) {
        extractedDates.push(new Date(`${year}-${match[2]}-${match[1]}`));
      } else if (match.length === 3) {
        extractedDates.push(new Date(`${year}-${match[1]}-01`));
      }
    }
    if (extractedDates.length > 0) break; // Stop after the first matching category
  }

  if (extractedDates.length === 0) return "Not found";

  // If there are two dates, return the second one
  let expiryDate =
    extractedDates.length > 1 ? extractedDates[1] : extractedDates[0];

  return `${expiryDate.getDate()}/${
    expiryDate.getMonth() + 1
  }/${expiryDate.getFullYear()}`;
}
