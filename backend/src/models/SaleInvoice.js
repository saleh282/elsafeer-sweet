import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 }, // unit price at time of sale
  },
  { _id: false }
);

const saleInvoiceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    invoiceDate: { type: Date, default: Date.now },
    items: { type: [saleItemSchema], validate: (v) => v.length > 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("SaleInvoice", saleInvoiceSchema);
