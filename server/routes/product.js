import express from "express";
import {
  getProductDetails,
  createProduct,
  getAllProducts,
  deleteProduct,
  searchProducts,
  getPriceComparison,
  // getProductName,
  // getBarcodeNumber,
} from "../controllers/product.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
const ProductRouter = express.Router();

ProductRouter.get("/prod-name", getProductDetails);
ProductRouter.get("/getAllProducts", authenticateUser, getAllProducts);
ProductRouter.get("/search-products", authenticateUser, searchProducts);
ProductRouter.get("/price-comparison", authenticateUser, getPriceComparison);

ProductRouter.post("/create-product", authenticateUser, createProduct);

ProductRouter.delete("/delete-product", authenticateUser, deleteProduct);

export default ProductRouter;

// getBarcodeNumber,
// getProductName,

// ProductRouter.post("/scan-barcode", getBarcodeNumber);
