import * as FileSystem from "expo-file-system"; // For reading image files
import { GoogleGenerativeAI } from "@google/generative-ai"; // Google Gemini API
import { GEMINI_API_KEY } from "@env";
const API_KEY = GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const extractExpiryDate = async (imageUri) => {
  try {
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: "Extract expiry date from the image" },
            { inlineData: { data: base64Image, mimeType: "image/png" } },
          ],
        },
      ],
    });

    const text = response.response.text();
    // console.log("Extracted Expiry Date Raw:", text);

    const datePatterns = [
      /\b(\d{1,2})[\/\s-](\d{1,2})[\/\s-](\d{4})\b/,
      /\b(\d{1,2})[\/\s-](\d{4})\b/,
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
        break;
      }
    }

    if (!extractedDate) return "Not found";

    const formattedDate = `${extractedDate.getDate()}/${
      extractedDate.getMonth() + 1
    }/${extractedDate.getFullYear()}`;
    // console.log("Formatted Expiry Date:", formattedDate);

    return formattedDate;
  } catch (error) {
    // console.error("Error extracting expiry date:", error);
    return "Failed to extract expiry date.";
  }
};
