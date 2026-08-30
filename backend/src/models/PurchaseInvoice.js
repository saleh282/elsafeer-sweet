import mongoose from "mongoose";

const purchaseItemSchema = new mongoose.Schema(
  {
    rawMaterialId: { type: mongoose.Schema.Types.ObjectId, ref: "RawMaterial", required: true },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 }, // unit price at time of purchase
  },
  { _id: false }
);

const purchaseInvoiceSchema = new mongoose.Schema(
  {
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    invoiceDate: { type: Date, default: Date.now },
    items: { type: [purchaseItemSchema], validate: (v) => v.length > 0 },
    total: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, default: 0, min: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

purchaseInvoiceSchema.virtual("dueAmount").get(function () {
  return this.total - this.paidAmount;
});
purchaseInvoiceSchema.set("toJSON", { virtuals: true });

export default mongoose.model("PurchaseInvoice", purchaseInvoiceSchema);
