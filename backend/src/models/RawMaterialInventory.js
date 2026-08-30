import mongoose from "mongoose";

const rawMaterialInventorySchema = new mongoose.Schema(
  {
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    rawMaterialId: { type: mongoose.Schema.Types.ObjectId, ref: "RawMaterial", required: true },
    quantity: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true }
);

rawMaterialInventorySchema.index({ branchId: 1, rawMaterialId: 1 }, { unique: true });

export default mongoose.model("RawMaterialInventory", rawMaterialInventorySchema);
