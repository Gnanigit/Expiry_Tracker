import speechSdk from "microsoft-cognitiveservices-speech-sdk";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import multer from "multer";
import { Readable } from "stream";

dotenv.config();

// Multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
export const upload = multer({ storage });

// Function to convert file to stream
const fileToStream = (filePath) => {
  const buffer = fs.readFileSync(filePath);
  return Readable.from(buffer);
};

// Speech-to-Text Processing
export const speechToText = async (req, res) => {
  try {
    console.log("Received speech request");

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const audioFilePath = path.join(process.cwd(), req.file.path);
    console.log("Processing audio:", audioFilePath);

    // Azure Speech SDK Configuration
    const speechConfig = speechSdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_TO_TEXT_API_KEY_1,
      process.env.AZURE_REGION
    );
    speechConfig.speechRecognitionLanguage = "en-US";

    // Increase silence timeout to avoid early cut-offs
    speechConfig.setProperty(
      speechSdk.PropertyId.SpeechServiceConnection_InitialSilenceTimeoutMs,
      "10000"
    );
    speechConfig.setProperty(
      speechSdk.PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs,
      "5000"
    );

    // Convert audio file to a stream and use fromStreamInput()
    const audioStream = fileToStream(audioFilePath);
    const pushStream = speechSdk.AudioInputStream.createPushStream();
    audioStream.on("data", (chunk) => pushStream.write(chunk));
    audioStream.on("end", () => pushStream.close());

    const audioConfig = speechSdk.AudioConfig.fromStreamInput(pushStream);
    const recognizer = new speechSdk.SpeechRecognizer(
      speechConfig,
      audioConfig
    );

    console.log("Recognizer initialized, starting recognition...");

    recognizer.recognizeOnceAsync((result) => {
      console.log("Full Azure Response:", JSON.stringify(result, null, 2));

      fs.unlinkSync(audioFilePath); // Delete file after processing

      if (result.reason === speechSdk.ResultReason.RecognizedSpeech) {
        console.log(`Recognized: ${result.text}`);
        res.json({ text: result.text });
      } else if (result.reason === speechSdk.ResultReason.NoMatch) {
        console.log("No speech detected.");
        res.json({ text: "No speech recognized" });
      } else if (result.reason === speechSdk.ResultReason.Canceled) {
        const cancellationDetails =
          speechSdk.CancellationDetails.fromResult(result);
        console.error(
          "Speech recognition canceled:",
          cancellationDetails.reason
        );
        if (cancellationDetails.reason === speechSdk.CancellationReason.Error) {
          console.error("Error details:", cancellationDetails.errorDetails);
        }
        res.status(500).json({
          error: "Speech recognition canceled",
          details: cancellationDetails,
        });
      } else {
        res.status(500).json({ error: "Unknown error occurred" });
      }
    });
  } catch (error) {
    console.error("Speech-to-Text Error:", error);
    res.status(500).json({ error: "Error processing speech" });
  }
};
