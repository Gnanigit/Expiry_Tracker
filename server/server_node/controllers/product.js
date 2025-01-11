import { spawn } from "child_process";
import path from "path";
import bodyParser from "body-parser";
import fs from "fs";
import express from "express";

import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
});
export const getBarcodeNumber = (req, res) => {
  // Use multer middleware to parse the image
  upload.single("file")(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(500).json({ error: "File upload failed" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image data received" });
    }

    console.log("File received:", req.file);

    const pythonProcess = spawn("python", [
      "C:\\Users\\Gnaneswar Yalla\\Desktop\\Expiry_Tracker\\server\\server_python\\final.py",
    ]);

    // Write the file buffer to Python's stdin
    pythonProcess.stdin.write(req.file.buffer);
    pythonProcess.stdin.end();

    let result = [];

    pythonProcess.stdout.on("data", (data) => {
      const parsedData = JSON.parse(data);

      result = result.concat(parsedData);
    });

    pythonProcess.stderr.on("data", (error) => {
      console.error("Error:", error.toString());
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        try {
          res.status(200).json({ result });
        } catch (err) {
          res.status(500).json({ error: "Failed to parse Python response" });
        }
      } else {
        res.status(500).json({ error: "Python script failed" });
      }
    });
  });
};
