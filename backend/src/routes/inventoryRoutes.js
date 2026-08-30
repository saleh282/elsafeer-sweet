import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  getProductInventory,
  getRawMaterialInventory,
  getLowStockAlerts,
  getStockMovements,
} from "../controllers/inventoryController.js";

const router = express.Router();
router.use(protect);

router.get("/products", getProductInventory);
router.get("/raw-materials", getRawMaterialInventory);
router.get("/low-stock", getLowStockAlerts);
router.get("/movements", getStockMovements);

export default router;
