import Payment from "../models/Payment.js";
import PurchaseInvoice from "../models/PurchaseInvoice.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

// Records a payment against a purchase invoice and updates its paidAmount.
const createPayment = asyncHandler(async (req, res) => {
  const { purchaseInvoiceId, amount, method, paymentDate } = req.body;

  const invoice = await PurchaseInvoice.findById(purchaseInvoiceId);
  if (!invoice) throw new ApiError(404, "Purchase invoice not found");

  const dueAmount = invoice.total - invoice.paidAmount;
  if (amount > dueAmount) {
    throw new ApiError(400, `Payment (${amount}) exceeds the remaining due amount (${dueAmount})`);
  }

  const payment = await Payment.create({
    purchaseInvoiceId,
    amount,
    method,
    paymentDate,
    createdBy: req.user._id,
  });

  invoice.paidAmount += amount;
  await invoice.save();

  res.status(201).json({ payment, invoice });
});

const getPaymentsByInvoice = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ purchaseInvoiceId: req.params.invoiceId }).sort({ paymentDate: -1 });
  res.json(payments);
});

export { createPayment, getPaymentsByInvoice };
