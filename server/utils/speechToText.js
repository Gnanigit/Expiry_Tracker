import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import util from "util";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegPath.path);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Promisify file operations
const writeFile = util.promisify(fs.writeFile);
const unlinkFile = util.promisify(fs.unlink);

export const speechToText = async (req, res) => {
  const { audioUrl, format } = req.body; // Format can be "mp3", "mp4", etc.

  if (!audioUrl) {
    return res.status(422).json({ error: "No audio data provided." });
  }

  try {
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Save the received file
    const inputFilePath = path.join(uploadsDir, `input_audio.${format}`);
    const audioBuffer = Buffer.from(audioUrl, "base64");
    await writeFile(inputFilePath, audioBuffer);

    // Ensure file exists and is not empty
    const stats = fs.statSync(inputFilePath);
    if (stats.size === 0) {
      await unlinkFile(inputFilePath);
      return res.status(400).json({ error: "Audio file is empty." });
    }

    // Convert to WAV if needed
    let finalFilePath = inputFilePath;

    if (format !== "wav" || format === "wav") {
      finalFilePath = path.join(uploadsDir, "converted_audio.wav");
      await new Promise((resolve, reject) => {
        ffmpeg(inputFilePath)
          .toFormat("wav")
          .audioFrequency(16000) // Set sample rate to 16kHz (recommended by Azure)
          .on("end", resolve)
          .on("error", reject)
          .save(finalFilePath);
      });
      await unlinkFile(inputFilePath); // Remove original file
    }

    // Configure Azure Speech SDK
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_TO_TEXT_API_KEY_1,
      process.env.AZURE_REGION
    );

    speechConfig.speechRecognitionLanguage = "en-US";
    const audioConfig = sdk.AudioConfig.fromWavFileInput(
      fs.readFileSync(finalFilePath)
    );

    const speechRecognizer = new sdk.SpeechRecognizer(
      speechConfig,
      audioConfig
    );

    // Perform speech recognition
    speechRecognizer.recognizeOnceAsync((result) => {
      if (result.reason === sdk.ResultReason.RecognizedSpeech) {
        res.json({ text: result.text });
      } else if (result.reason === sdk.ResultReason.NoMatch) {
        res.status(400).json({ error: "No speech recognized." });
      } else if (result.reason === sdk.ResultReason.Canceled) {
        res.status(400).json({ error: "Speech recognition canceled." });
      }
      speechRecognizer.close();
      unlinkFile(finalFilePath); // Clean up
    });
  } catch (error) {
    console.error("Error processing speech to text:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
