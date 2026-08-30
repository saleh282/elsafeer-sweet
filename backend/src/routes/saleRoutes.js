import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { createSaleInvoice, getSaleInvoices, getSaleInvoiceById } from "../controllers/saleController.js";

const router = express.Router();
router.use(protect);

router.route("/")
  .get(getSaleInvoices)
  .post(createSaleInvoice); // any authenticated staff member can record a sale

router.get("/:id", getSaleInvoiceById);

export default router;
