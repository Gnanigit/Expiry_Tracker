import express from "express";
import {
  getProductDetails,
  createProduct,
  getAllProducts,
  deleteProduct,
} from "../controllers/product.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
const ProductRouter = express.Router();

ProductRouter.get("/prod-name", getProductDetails);
ProductRouter.get("/getAllProducts", authenticateUser, getAllProducts);

ProductRouter.post("/create-product", authenticateUser, createProduct);

ProductRouter.delete("/delete-product", deleteProduct);

export default ProductRouter;

// getBarcodeNumber,
// getProductName,

// ProductRouter.post("/scan-barcode", getBarcodeNumber);
