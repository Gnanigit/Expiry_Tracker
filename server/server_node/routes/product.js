import express from "express";
import {
  getBarcodeNumber,
  getProductName,
  createProduct,
} from "../controllers/product.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
const ProductRouter = express.Router();

ProductRouter.post("/scan-barcode", getBarcodeNumber);
ProductRouter.get("/prod-name", getProductName);

ProductRouter.post("/create-product", authenticateUser, createProduct);

export default ProductRouter;
