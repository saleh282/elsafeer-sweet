import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { createReturnInvoice, getReturnInvoices } from "../controllers/returnController.js";

const router = express.Router();
router.use(protect);

router.route("/")
  .get(getReturnInvoices)
  .post(createReturnInvoice);

export default router;
