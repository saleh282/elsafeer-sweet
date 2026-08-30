import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Role from "../models/Role.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

// Owner-only: create staff accounts without going through public registration (if any)
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, roleName, branchId } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(400, "A user with this email already exists");

  const role = await Role.findOne({ name: roleName });
  if (!role) throw new ApiError(400, "Invalid role");

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    roleId: role._id,
    branchId: branchId || null,
  });

  res.status(201).json({ id: user._id, name: user.name, email: user.email });
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").populate("roleId", "name").populate("branchId", "name");
  res.json(users);
});

const updateUser = asyncHandler(async (req, res) => {
  const { name, roleName, branchId, isActive } = req.body;
  const update = {};

  if (name !== undefined) update.name = name;
  if (branchId !== undefined) update.branchId = branchId;
  if (isActive !== undefined) update.isActive = isActive;

  if (roleName) {
    const role = await Role.findOne({ name: roleName });
    if (!role) throw new ApiError(400, "Invalid role");
    update.roleId = role._id;
  }

  const user = await User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).select("-password");
  if (!user) throw new ApiError(404, "User not found");
  res.json(user);
});

const changeOwnPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) throw new ApiError(401, "Current password is incorrect");

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();

  res.json({ message: "Password updated successfully" });
});

export { createUser, getUsers, updateUser, changeOwnPassword };
