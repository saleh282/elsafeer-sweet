import Supplier from "../models/Supplier.js";
import PurchaseInvoice from "../models/PurchaseInvoice.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const createSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.create(req.body);
  res.status(201).json(supplier);
});

const getSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await Supplier.find().sort({ name: 1 });
  res.json(suppliers);
});

const getSupplierById = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) throw new ApiError(404, "Supplier not found");
  res.json(supplier);
});

// Shows every purchase invoice for this supplier plus total due, so the owner can see who they owe money to
const getSupplierBalance = asyncHandler(async (req, res) => {
  const invoices = await PurchaseInvoice.find({ supplierId: req.params.id }).sort({ invoiceDate: -1 });
  const totalDue = invoices.reduce((sum, inv) => sum + (inv.total - inv.paidAmount), 0);
  res.json({ invoices, totalDue });
});

const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!supplier) throw new ApiError(404, "Supplier not found");
  res.json(supplier);
});

const deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!supplier) throw new ApiError(404, "Supplier not found");
  res.json({ message: "Supplier deactivated", supplier });
});

export { createSupplier, getSuppliers, getSupplierById, getSupplierBalance, updateSupplier, deleteSupplier };
