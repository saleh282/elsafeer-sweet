import mongoose from "mongoose";

// Recipe items are embedded since they are always read/written together with the recipe
const recipeItemSchema = new mongoose.Schema(
  {
    rawMaterialId: { type: mongoose.Schema.Types.ObjectId, ref: "RawMaterial", required: true },
    quantity: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, unique: true },
    name: { type: String, trim: true },
    items: {
      type: [recipeItemSchema],
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Recipe", recipeSchema);
