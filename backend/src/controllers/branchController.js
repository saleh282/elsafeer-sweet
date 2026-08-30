import Branch from "../models/Branch.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const createBranch = asyncHandler(async (req, res) => {
  const branch = await Branch.create(req.body);
  res.status(201).json(branch);
});

const getBranches = asyncHandler(async (req, res) => {
  const branches = await Branch.find().sort({ createdAt: -1 });
  res.json(branches);
});

const getBranchById = asyncHandler(async (req, res) => {
  const branch = await Branch.findById(req.params.id);
  if (!branch) throw new ApiError(404, "Branch not found");
  res.json(branch);
});

const updateBranch = asyncHandler(async (req, res) => {
  const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!branch) throw new ApiError(404, "Branch not found");
  res.json(branch);
});

const deleteBranch = asyncHandler(async (req, res) => {
  const branch = await Branch.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!branch) throw new ApiError(404, "Branch not found");
  res.json({ message: "Branch deactivated", branch });
});

export { createBranch, getBranches, getBranchById, updateBranch, deleteBranch };
