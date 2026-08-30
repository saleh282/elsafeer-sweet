import express from "express";
import protect from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorizeMiddleware.js";
import { createPayment, getPaymentsByInvoice } from "../controllers/paymentController.js";

const router = express.Router();
router.use(protect);

router.post("/", authorize("owner", "manager"), createPayment);
router.get("/invoice/:invoiceId", getPaymentsByInvoice);

export default router;
