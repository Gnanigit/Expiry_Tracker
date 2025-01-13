import { spawn } from "child_process";
import multer from "multer";
import path from "path";
import bodyParser from "body-parser";
import fs from "fs";
import express from "express";
import getProdDetails from "../utils/getProdDetails.js";

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

    const pythonProcess = spawn("python", [
      "C:\\Users\\Gnaneswar Yalla\\Desktop\\Expiry_Tracker\\server\\server_python\\final.py",
    ]);

    // Write the file buffer to Python's stdin
    pythonProcess.stdin.write(req.file.buffer);
    pythonProcess.stdin.end();

    let result = [];

    pythonProcess.stdout.on("data", (data) => {
      try {
        const parsedData = JSON.parse(data);

        // Filter and process the data
        const validData = parsedData.filter((item) =>
          Object.values(item).some((value) => value.length === 13)
        );

        if (validData.length > 0) {
          const selectedData = validData.find((item) =>
            Object.keys(item).includes("data_1")
          );

          const response = {
            data: selectedData
              ? selectedData.data_1
              : Object.values(validData[0])[0],
          };

          result = response;
        }
      } catch (err) {
        console.error("Error parsing data:", err.message);
      }
    });

    pythonProcess.stderr.on("data", (error) => {
      console.error("Error:", error.toString());
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        try {
          res.status(200).json(result);
        } catch (err) {
          res.status(500).json({ error: "Failed to process response" });
        }
      } else {
        res.status(500).json({ error: "Python script failed" });
      }
    });
  });
};

export const getProductName = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ message: "Barcode is required" });
  }

  try {
    const productDetails = await getProdDetails({ barcode: code });
    const result = {
      description: productDetails["Product description"],
      image: productDetails.img,
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getProductName:", error);
    return res.status(500).json({ message: "Failed to fetch product details" });
  }
};
