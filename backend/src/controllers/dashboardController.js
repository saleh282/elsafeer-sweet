import SaleInvoice from "../models/SaleInvoice.js";
import ReturnInvoice from "../models/ReturnInvoice.js";
import PurchaseInvoice from "../models/PurchaseInvoice.js";
import ProductionBatch from "../models/ProductionBatch.js";
import RawMaterialInventory from "../models/RawMaterialInventory.js";
import Branch from "../models/Branch.js";
import asyncHandler from "../utils/asyncHandler.js";

// A single summary endpoint for the main dashboard screen: today's sales/returns/production
// plus outstanding supplier debt and how many raw materials are running low, across all branches
// (or one branch if branchId is passed).
const getSummary = asyncHandler(async (req, res) => {
  const { branchId } = req.query;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const branchFilter = branchId ? { branchId } : {};
  const todayFilter = { ...branchFilter, invoiceDate: { $gte: startOfToday } };

  const [sales, returns, purchases, productionBatchesToday, branchCount] = await Promise.all([
    SaleInvoice.find(todayFilter),
    ReturnInvoice.find(todayFilter),
    PurchaseInvoice.find(),
    ProductionBatch.countDocuments({ ...branchFilter, productionDate: { $gte: startOfToday } }),
    Branch.countDocuments({ isActive: true }),
  ]);

  const todaySalesTotal = sales.reduce((sum, s) => sum + s.total, 0);
  const todayReturnsTotal = returns.reduce((sum, r) => sum + r.total, 0);
  const totalSupplierDue = purchases.reduce((sum, p) => sum + (p.total - p.paidAmount), 0);

  const lowStockCount = await RawMaterialInventory.countDocuments({
    ...branchFilter,
  }).then(async () => {
    const items = await RawMaterialInventory.find(branchFilter).populate("rawMaterialId", "minStockLevel");
    return items.filter((i) => i.rawMaterialId && i.quantity <= i.rawMaterialId.minStockLevel).length;
  });

  res.json({
    todaySalesTotal,
    todayReturnsTotal,
    netSalesToday: todaySalesTotal - todayReturnsTotal,
    productionBatchesToday,
    totalSupplierDue,
    lowStockRawMaterialsCount: lowStockCount,
    activeBranches: branchCount,
  });
});

export { getSummary };
