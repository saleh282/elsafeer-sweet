import mongoose from "mongoose";
import ReturnInvoice from "../models/ReturnInvoice.js";
import SaleInvoice from "../models/SaleInvoice.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { adjustProductStock } from "../services/inventory.service.js";

// Creates a return invoice against an existing sale, and restores product stock.
const createReturnInvoice = asyncHandler(async (req, res) => {
  const { saleInvoiceId, branchId, items, invoiceDate } = req.body;

  const saleInvoice = await SaleInvoice.findById(saleInvoiceId);
  if (!saleInvoice) throw new ApiError(404, "Original sale invoice not found");

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Return invoice must contain at least one item");
  }

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const session = await mongoose.startSession();
  try {
    let invoice;
    await session.withTransaction(async () => {
      const created = await ReturnInvoice.create(
        [{ saleInvoiceId, branchId, items, total, createdBy: req.user._id, invoiceDate }],
        { session }
      );
      invoice = created[0];

      for (const item of items) {
        await adjustProductStock({
          branchId,
          productId: item.productId,
          delta: item.quantity,
          reason: "return",
          referenceId: invoice._id,
          session,
        });
      }
    });

    res.status(201).json(invoice);
  } finally {
    session.endSession();
  }
});

const getReturnInvoices = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.branchId) filter.branchId = req.query.branchId;

  const invoices = await ReturnInvoice.find(filter)
    .populate("branchId", "name")
    .populate("saleInvoiceId")
    .sort({ invoiceDate: -1 });
  res.json(invoices);
});

export { createReturnInvoice, getReturnInvoices };
