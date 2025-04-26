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
  const { audioUrl, format } = req.body;

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
      console.log("getting here_1");
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
    console.log("getting here_2");
    // Configure Azure Speech SDK
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_TO_TEXT_API_KEY_1,
      process.env.AZURE_REGION
    );
    console.log("getting here_2.5");
    speechConfig.speechRecognitionLanguage = "en-US";
    const audioConfig = sdk.AudioConfig.fromWavFileInput(
      fs.readFileSync(finalFilePath)
    );
    console.log("getting here_3");
    const speechRecognizer = new sdk.SpeechRecognizer(
      speechConfig,
      audioConfig
    );
    console.log("getting here_4");

    // Perform speech recognition
    speechRecognizer.recognizeOnceAsync((result) => {
      console.log("inside_1");
      if (result.reason === sdk.ResultReason.RecognizedSpeech) {
        console.log("inside_1");
        res.json({ text: result.text });
      } else if (result.reason === sdk.ResultReason.NoMatch) {
        console.log("inside_2");
        res.status(400).json({ error: "No speech recognized." });
      } else if (result.reason === sdk.ResultReason.Canceled) {
        console.log("inside_3");
        res.status(400).json({ error: "Speech recognition canceled." });
      }
      speechRecognizer.close();
      console.log("getting here_5");
      unlinkFile(finalFilePath);
    });
  } catch (error) {
    console.error("Error processing speech to text:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
