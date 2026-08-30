import mongoose from "mongoose";
import SaleInvoice from "../models/SaleInvoice.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { adjustProductStock } from "../services/inventory.service.js";

// Creates a sale invoice and decreases product stock for every item, atomically.
// Fails with 400 if any item does not have enough stock in that branch.
const createSaleInvoice = asyncHandler(async (req, res) => {
  const { branchId, items, invoiceDate } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Sale invoice must contain at least one item");
  }

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const session = await mongoose.startSession();
  try {
    let invoice;
    await session.withTransaction(async () => {
      const created = await SaleInvoice.create(
        [{ userId: req.user._id, branchId, items, total, invoiceDate }],
        { session }
      );
      invoice = created[0];

      for (const item of items) {
        await adjustProductStock({
          branchId,
          productId: item.productId,
          delta: -item.quantity,
          reason: "sale",
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

const getSaleInvoices = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.branchId) filter.branchId = req.query.branchId;
  if (req.query.from || req.query.to) {
    filter.invoiceDate = {};
    if (req.query.from) filter.invoiceDate.$gte = new Date(req.query.from);
    if (req.query.to) filter.invoiceDate.$lte = new Date(req.query.to);
  }

  const invoices = await SaleInvoice.find(filter)
    .populate("branchId", "name")
    .populate("userId", "name")
    .sort({ invoiceDate: -1 });
  res.json(invoices);
});

const getSaleInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await SaleInvoice.findById(req.params.id)
    .populate("branchId", "name")
    .populate("userId", "name")
    .populate("items.productId", "name unit");
  if (!invoice) throw new ApiError(404, "Sale invoice not found");
  res.json(invoice);
});

export { createSaleInvoice, getSaleInvoices, getSaleInvoiceById };
