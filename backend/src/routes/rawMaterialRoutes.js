import express from "express";
import protect from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorizeMiddleware.js";
import {
  createRawMaterial,
  getRawMaterials,
  getRawMaterialById,
  updateRawMaterial,
  deleteRawMaterial,
} from "../controllers/rawMaterialController.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getRawMaterials)
  .post(authorize("owner", "manager"), createRawMaterial);

router.route("/:id")
  .get(getRawMaterialById)
  .put(authorize("owner", "manager"), updateRawMaterial)
  .delete(authorize("owner"), deleteRawMaterial);

export default router;
