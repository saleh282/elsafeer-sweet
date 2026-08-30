import RawMaterial from "../models/RawMaterial.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const createRawMaterial = asyncHandler(async (req, res) => {
  const rawMaterial = await RawMaterial.create(req.body);
  res.status(201).json(rawMaterial);
});

const getRawMaterials = asyncHandler(async (req, res) => {
  const rawMaterials = await RawMaterial.find().sort({ name: 1 });
  res.json(rawMaterials);
});

const getRawMaterialById = asyncHandler(async (req, res) => {
  const rawMaterial = await RawMaterial.findById(req.params.id);
  if (!rawMaterial) throw new ApiError(404, "Raw material not found");
  res.json(rawMaterial);
});

const updateRawMaterial = asyncHandler(async (req, res) => {
  const rawMaterial = await RawMaterial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!rawMaterial) throw new ApiError(404, "Raw material not found");
  res.json(rawMaterial);
});

const deleteRawMaterial = asyncHandler(async (req, res) => {
  const rawMaterial = await RawMaterial.findByIdAndDelete(req.params.id);
  if (!rawMaterial) throw new ApiError(404, "Raw material not found");
  res.json({ message: "Raw material deleted" });
});

export { createRawMaterial, getRawMaterials, getRawMaterialById, updateRawMaterial, deleteRawMaterial };
