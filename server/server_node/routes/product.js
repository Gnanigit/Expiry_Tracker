import express from "express";
import {
  getBarcodeNumber,
  getProductName,
  createProduct,
  getAllProducts,
} from "../controllers/product.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
const ProductRouter = express.Router();

ProductRouter.get("/prod-name", getProductName);
ProductRouter.get("/getAllProducts", authenticateUser, getAllProducts);

ProductRouter.post("/scan-barcode", getBarcodeNumber);
ProductRouter.post("/create-product", authenticateUser, createProduct);

export default ProductRouter;
