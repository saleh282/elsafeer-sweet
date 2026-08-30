import express from "express";
import protect from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorizeMiddleware.js";
import {
  getSalesReport,
  getPurchasesReport,
  getProductionReport,
  getReturnsReport,
} from "../controllers/reportController.js";

const router = express.Router();
router.use(protect);
router.use(authorize("owner", "manager"));

router.get("/sales", getSalesReport);
router.get("/purchases", getPurchasesReport);
router.get("/production", getProductionReport);
router.get("/returns", getReturnsReport);

export default router;
