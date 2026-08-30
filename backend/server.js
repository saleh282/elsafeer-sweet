import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import seedRoles from "./src/utils/seedRoles.js";
import seedOwner from "./src/utils/seedOwner.js";
import seedMenu from "./src/utils/seedMenu.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    await seedRoles();
    await seedOwner();
    await seedMenu();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();