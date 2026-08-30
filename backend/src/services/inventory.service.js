import ProductInventory from "../models/ProductInventory.js";
import RawMaterialInventory from "../models/RawMaterialInventory.js";
import StockMovement from "../models/StockMovement.js";
import ApiError from "../utils/ApiError.js";

// delta can be positive (stock in) or negative (stock out)
const adjustRawMaterialStock = async ({ branchId, rawMaterialId, delta, reason, referenceId, session }) => {
  const inventory = await RawMaterialInventory.findOneAndUpdate(
    { branchId, rawMaterialId },
    { $setOnInsert: { branchId, rawMaterialId, quantity: 0 } },
    { upsert: true, new: true, session }
  );

  const newQuantity = inventory.quantity + delta;
  if (newQuantity < 0) {
    throw new ApiError(400, "Not enough raw material stock available");
  }

  inventory.quantity = newQuantity;
  await inventory.save({ session });

  await StockMovement.create(
    [{ branchId, itemType: "rawMaterial", itemId: rawMaterialId, quantity: delta, reason, referenceId }],
    { session }
  );

  return inventory;
};

const adjustProductStock = async ({ branchId, productId, delta, reason, referenceId, session }) => {
  const inventory = await ProductInventory.findOneAndUpdate(
    { branchId, productId },
    { $setOnInsert: { branchId, productId, quantity: 0 } },
    { upsert: true, new: true, session }
  );

  const newQuantity = inventory.quantity + delta;
  if (newQuantity < 0) {
    throw new ApiError(400, "Not enough product stock available");
  }

  inventory.quantity = newQuantity;
  await inventory.save({ session });

  await StockMovement.create(
    [{ branchId, itemType: "product", itemId: productId, quantity: delta, reason, referenceId }],
    { session }
  );

  return inventory;
};

export { adjustRawMaterialStock, adjustProductStock };
