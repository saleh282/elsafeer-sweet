import mongoose from "mongoose";

// Immutable audit log of every stock change, so inventory levels are always explainable
const stockMovementSchema = new mongoose.Schema(
  {
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    itemType: { type: String, enum: ["product", "rawMaterial"], required: true },
    // References Product or RawMaterial depending on itemType; not a dynamic ref since
    // itemType stores "product"/"rawMaterial", not the Mongoose model names.
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true }, // positive = in, negative = out
    reason: {
      type: String,
      enum: ["purchase", "production_in", "production_out", "sale", "return", "transfer_in", "transfer_out", "adjustment"],
      required: true,
    },
    referenceId: { type: mongoose.Schema.Types.ObjectId }, // the invoice/batch/transfer that caused this movement
  },
  { timestamps: true }
);

export default mongoose.model("StockMovement", stockMovementSchema);
