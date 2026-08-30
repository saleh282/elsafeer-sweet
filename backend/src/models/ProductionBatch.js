import mongoose from "mongoose";

const productionBatchSchema = new mongoose.Schema(
  {
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    quantityProduced: { type: Number, required: true, min: 1 },
    producedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productionDate: { type: Date, default: Date.now },
    // snapshot of raw materials consumed, kept for historical/cost reporting even if the recipe changes later
    rawMaterialsUsed: [
      {
        _id: false,
        rawMaterialId: { type: mongoose.Schema.Types.ObjectId, ref: "RawMaterial" },
        quantity: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("ProductionBatch", productionBatchSchema);
