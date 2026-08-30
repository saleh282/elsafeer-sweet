import mongoose from "mongoose";
import PurchaseInvoice from "../models/PurchaseInvoice.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { adjustRawMaterialStock } from "../services/inventory.service.js";

// Creates a purchase invoice and increases raw material stock for every item on it, atomically.
const createPurchaseInvoice = asyncHandler(async (req, res) => {
  const { supplierId, branchId, items, paidAmount = 0, invoiceDate } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Purchase invoice must contain at least one item");
  }

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const session = await mongoose.startSession();
  try {
    let invoice;
    await session.withTransaction(async () => {
      const created = await PurchaseInvoice.create(
        [{ supplierId, branchId, items, total, paidAmount, invoiceDate, createdBy: req.user._id }],
        { session }
      );
      invoice = created[0];

      for (const item of items) {
        await adjustRawMaterialStock({
          branchId,
          rawMaterialId: item.rawMaterialId,
          delta: item.quantity,
          reason: "purchase",
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

const getPurchaseInvoices = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.supplierId) filter.supplierId = req.query.supplierId;
  if (req.query.branchId) filter.branchId = req.query.branchId;

  const invoices = await PurchaseInvoice.find(filter)
    .populate("supplierId", "name")
    .populate("branchId", "name")
    .sort({ invoiceDate: -1 });
  res.json(invoices);
});

const getPurchaseInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await PurchaseInvoice.findById(req.params.id)
    .populate("supplierId", "name")
    .populate("branchId", "name")
    .populate("items.rawMaterialId", "name unit");
  if (!invoice) throw new ApiError(404, "Purchase invoice not found");
  res.json(invoice);
});

export { createPurchaseInvoice, getPurchaseInvoices, getPurchaseInvoiceById };
