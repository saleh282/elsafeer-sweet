import Role from "../models/Role.js";

const seedRoles = async () => {
  const roles = ["owner", "manager", "cashier"];

  for (const name of roles) {
    await Role.updateOne(
      { name },
      { $setOnInsert: { name } },
      { upsert: true }
    );
  }

  console.log("Roles seeded successfully");
};

export default seedRoles;