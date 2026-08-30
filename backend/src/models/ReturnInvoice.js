import mongoose from "mongoose";

const returnItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    reason: { type: String, trim: true },
  },
  { _id: false }
);

const returnInvoiceSchema = new mongoose.Schema(
  {
    saleInvoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "SaleInvoice", required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    invoiceDate: { type: Date, default: Date.now },
    items: { type: [returnItemSchema], validate: (v) => v.length > 0 },
    total: { type: Number, required: true, min: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("ReturnInvoice", returnInvoiceSchema);
