import express from "express";
import protect from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorizeMiddleware.js";
import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  getSupplierBalance,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getSuppliers)
  .post(authorize("owner", "manager"), createSupplier);

router.route("/:id")
  .get(getSupplierById)
  .put(authorize("owner", "manager"), updateSupplier)
  .delete(authorize("owner"), deleteSupplier);

router.get("/:id/balance", getSupplierBalance);

export default router;
