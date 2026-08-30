import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
    isFactory: { type: Boolean, default: false }, // marks the main production branch
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Branch", branchSchema);
