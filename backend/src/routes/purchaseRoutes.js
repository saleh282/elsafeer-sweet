import express from "express";
import protect from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorizeMiddleware.js";
import {
  createPurchaseInvoice,
  getPurchaseInvoices,
  getPurchaseInvoiceById,
} from "../controllers/purchaseController.js";

const router = express.Router();
router.use(protect);

router.route("/")
  .get(getPurchaseInvoices)
  .post(authorize("owner", "manager"), createPurchaseInvoice);

router.get("/:id", getPurchaseInvoiceById);

export default router;
