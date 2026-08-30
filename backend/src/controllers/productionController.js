import mongoose from "mongoose";
import Recipe from "../models/Recipe.js";
import ProductionBatch from "../models/ProductionBatch.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { adjustRawMaterialStock, adjustProductStock } from "../services/inventory.service.js";

// Creates a production batch: checks raw material stock, deducts it, and adds the finished product to stock.
// Runs inside a transaction so a partial failure never leaves inventory half-updated.
const createProductionBatch = asyncHandler(async (req, res) => {
  const { recipeId, branchId, quantityProduced } = req.body;

  const recipe = await Recipe.findById(recipeId);
  if (!recipe) throw new ApiError(404, "Recipe not found");

  const session = await mongoose.startSession();
  try {
    let batch;
    await session.withTransaction(async () => {
      const rawMaterialsUsed = recipe.items.map((item) => ({
        rawMaterialId: item.rawMaterialId,
        quantity: item.quantity * quantityProduced,
      }));

      const created = await ProductionBatch.create(
        [
          {
            recipeId,
            productId: recipe.productId,
            branchId,
            quantityProduced,
            producedBy: req.user._id,
            rawMaterialsUsed,
          },
        ],
        { session }
      );
      batch = created[0];

      for (const used of rawMaterialsUsed) {
        await adjustRawMaterialStock({
          branchId,
          rawMaterialId: used.rawMaterialId,
          delta: -used.quantity,
          reason: "production_out",
          referenceId: batch._id,
          session,
        });
      }

      await adjustProductStock({
        branchId,
        productId: recipe.productId,
        delta: quantityProduced,
        reason: "production_in",
        referenceId: batch._id,
        session,
      });
    });

    res.status(201).json(batch);
  } finally {
    session.endSession();
  }
});

const getProductionBatches = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.branchId) filter.branchId = req.query.branchId;

  const batches = await ProductionBatch.find(filter)
    .populate("productId", "name")
    .populate("branchId", "name")
    .sort({ productionDate: -1 });
  res.json(batches);
});

const getProductionBatchById = asyncHandler(async (req, res) => {
  const batch = await ProductionBatch.findById(req.params.id)
    .populate("productId", "name")
    .populate("branchId", "name")
    .populate("rawMaterialsUsed.rawMaterialId", "name unit");
  if (!batch) throw new ApiError(404, "Production batch not found");
  res.json(batch);
});

export { createProductionBatch, getProductionBatches, getProductionBatchById };
