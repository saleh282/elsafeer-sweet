import ProductInventory from "../models/ProductInventory.js";
import RawMaterialInventory from "../models/RawMaterialInventory.js";
import StockMovement from "../models/StockMovement.js";
import asyncHandler from "../utils/asyncHandler.js";

const getProductInventory = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.branchId) filter.branchId = req.query.branchId;

  const inventory = await ProductInventory.find(filter)
    .populate("branchId", "name")
    .populate("productId", "name unit");
  res.json(inventory);
});

const getRawMaterialInventory = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.branchId) filter.branchId = req.query.branchId;

  const inventory = await RawMaterialInventory.find(filter)
    .populate("branchId", "name")
    .populate("rawMaterialId", "name unit minStockLevel");
  res.json(inventory);
});

// Raw materials whose stock in a branch has dropped at or below their configured minimum level
const getLowStockAlerts = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.branchId) filter.branchId = req.query.branchId;

  const inventory = await RawMaterialInventory.find(filter).populate("rawMaterialId", "name unit minStockLevel").populate("branchId", "name");

  const lowStock = inventory.filter(
    (i) => i.rawMaterialId && i.quantity <= i.rawMaterialId.minStockLevel
  );

  res.json(lowStock);
});

const getStockMovements = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.branchId) filter.branchId = req.query.branchId;
  if (req.query.itemType) filter.itemType = req.query.itemType;
  if (req.query.itemId) filter.itemId = req.query.itemId;

  const movements = await StockMovement.find(filter).sort({ createdAt: -1 }).limit(500);
  res.json(movements);
});

export { getProductInventory, getRawMaterialInventory, getLowStockAlerts, getStockMovements };
