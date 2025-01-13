import express from "express";
import { getBarcodeNumber, getProductName } from "../controllers/product.js";
const ProductRouter = express.Router();

ProductRouter.post("/scan-barcode", getBarcodeNumber);
ProductRouter.get("/prod-name", getProductName);

export default ProductRouter;
