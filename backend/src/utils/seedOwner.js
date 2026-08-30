import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Role from "../models/Role.js";

const seedOwner = async () => {
  const ownerRole = await Role.findOne({ name: "owner" });

  if (!ownerRole) {
    throw new Error("Owner role not found");
  }

  const existingOwner = await User.findOne({
    email: "saleh.salehh567@gmail.com",
  });

  if (existingOwner) {
    console.log("Owner already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("Saleh1234!ERP", 12);

  await User.create({
    name: "Saleh",
    email: "saleh.salehh567@gmail.com",
    password: hashedPassword,
    roleId: ownerRole._id,
  });

  console.log("Owner user created successfully");
};

export default seedOwner;
