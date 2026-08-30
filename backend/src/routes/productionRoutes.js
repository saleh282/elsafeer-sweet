import express from "express";
import protect from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorizeMiddleware.js";
import {
  createProductionBatch,
  getProductionBatches,
  getProductionBatchById,
} from "../controllers/productionController.js";

const router = express.Router();
router.use(protect);

router.route("/")
  .get(getProductionBatches)
  .post(authorize("owner", "manager", "factory_staff"), createProductionBatch);

router.get("/:id", getProductionBatchById);

export default router;
