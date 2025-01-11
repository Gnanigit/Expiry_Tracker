// imports
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routes/auth.js";
import ProductRouter from "./routes/product.js";

// load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: "*",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const PORT = process.env.PORT || 6001;
const HOST = "0.0.0.0";

app.use("/auth", router);
app.use("/product", ProductRouter);

// connect to MongoDB
mongoose
  .connect(process.env.MONGOOSE_URL)
  .then(() => {
    app.listen(PORT, HOST, () =>
      console.log(`Server running at http://${HOST}:${PORT}`)
    );
  })
  .catch((error) => console.log(`${error} did not connect`));
