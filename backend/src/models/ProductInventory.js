import mongoose from "mongoose";

const productInventorySchema = new mongoose.Schema(
  {
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true }
);

productInventorySchema.index({ branchId: 1, productId: 1 }, { unique: true });

export default mongoose.model("ProductInventory", productInventorySchema);
