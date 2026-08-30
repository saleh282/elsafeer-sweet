import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    purchaseInvoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "PurchaseInvoice", required: true },
    amount: { type: Number, required: true, min: 0.01 },
    paymentDate: { type: Date, default: Date.now },
    method: { type: String, enum: ["cash", "bank_transfer", "other"], default: "cash" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
