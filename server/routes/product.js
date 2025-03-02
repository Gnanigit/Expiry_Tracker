import express from "express";
import {
  getProductDetails,
  createProduct,
  getAllProducts,
  deleteProduct,
  searchProducts,
  getPriceComparison,
  // extractExpiryDateAzure,

  // getProductName,
  // getBarcodeNumber,
} from "../controllers/product.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { extractExpiryDateAzure } from "../controllers/Azure.js";
import { speechToText } from "../utils/speechToText.js";
const ProductRouter = express.Router();

ProductRouter.get("/prod-name", getProductDetails);
ProductRouter.get("/getAllProducts", authenticateUser, getAllProducts);
ProductRouter.get("/search-products", authenticateUser, searchProducts);
ProductRouter.get("/price-comparison", authenticateUser, getPriceComparison);

ProductRouter.post("/create-product", authenticateUser, createProduct);
ProductRouter.post("/speech-to-text", speechToText);

ProductRouter.delete("/delete-product", authenticateUser, deleteProduct);

ProductRouter.post("/process-image", extractExpiryDateAzure);

export default ProductRouter;

// getBarcodeNumber,
// getProductName,

// ProductRouter.post("/scan-barcode", getBarcodeNumber);
