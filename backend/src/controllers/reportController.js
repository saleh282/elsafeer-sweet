import SaleInvoice from "../models/SaleInvoice.js";
import ReturnInvoice from "../models/ReturnInvoice.js";
import PurchaseInvoice from "../models/PurchaseInvoice.js";
import ProductionBatch from "../models/ProductionBatch.js";
import asyncHandler from "../utils/asyncHandler.js";

const buildDateFilter = (req) => {
  const filter = {};
  if (req.query.branchId) filter.branchId = req.query.branchId;
  if (req.query.from || req.query.to) {
    filter.invoiceDate = {};
    if (req.query.from) filter.invoiceDate.$gte = new Date(req.query.from);
    if (req.query.to) filter.invoiceDate.$lte = new Date(req.query.to);
  }
  return filter;
};

// Sales grouped by product, for a date range / branch
const getSalesReport = asyncHandler(async (req, res) => {
  const filter = buildDateFilter(req);

  const invoices = await SaleInvoice.find(filter);
  const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);

  const byProduct = {};
  for (const invoice of invoices) {
    for (const item of invoice.items) {
      const key = item.productId.toString();
      if (!byProduct[key]) byProduct[key] = { productId: key, quantity: 0, total: 0 };
      byProduct[key].quantity += item.quantity;
      byProduct[key].total += item.quantity * item.price;
    }
  }

  res.json({ invoiceCount: invoices.length, totalSales, byProduct: Object.values(byProduct) });
});

// Purchases grouped by supplier, for a date range / branch
const getPurchasesReport = asyncHandler(async (req, res) => {
  const filter = buildDateFilter(req);
  const invoices = await PurchaseInvoice.find(filter);

  const totalPurchases = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);

  res.json({
    invoiceCount: invoices.length,
    totalPurchases,
    totalPaid,
    totalDue: totalPurchases - totalPaid,
  });
});

// Production totals by product, for a date range / branch
const getProductionReport = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.branchId) filter.branchId = req.query.branchId;
  if (req.query.from || req.query.to) {
    filter.productionDate = {};
    if (req.query.from) filter.productionDate.$gte = new Date(req.query.from);
    if (req.query.to) filter.productionDate.$lte = new Date(req.query.to);
  }

  const batches = await ProductionBatch.find(filter);
  const totalQuantityProduced = batches.reduce((sum, b) => sum + b.quantityProduced, 0);

  res.json({ batchCount: batches.length, totalQuantityProduced });
});

// Returns totals, for a date range / branch
const getReturnsReport = asyncHandler(async (req, res) => {
  const filter = buildDateFilter(req);
  const invoices = await ReturnInvoice.find(filter);
  const totalReturns = invoices.reduce((sum, inv) => sum + inv.total, 0);

  res.json({ invoiceCount: invoices.length, totalReturns });
});

export { getSalesReport, getPurchasesReport, getProductionReport, getReturnsReport };
