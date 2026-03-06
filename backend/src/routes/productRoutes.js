import { Router } from "express";
import {
  addReview,
  catalogSummary,
  createProduct,
  getProductBySlug,
  listProducts,
  lowStock,
  priceStats,
  reserveStock,
  restockVariant,
  topRated
} from "../controllers/productController.js";

const router = Router();

router.get("/", listProducts);
router.post("/", createProduct);
router.get("/slug/:slug", getProductBySlug);
router.post("/:id/reviews", addReview);
router.patch("/:id/stock/reserve", reserveStock);
router.patch("/:id/stock/restock", restockVariant);

router.get("/analytics/top-rated", topRated);
router.get("/analytics/price-stats", priceStats);
router.get("/analytics/low-stock", lowStock);
router.get("/analytics/summary", catalogSummary);

export default router;
