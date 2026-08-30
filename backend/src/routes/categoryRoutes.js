import express from "express";
import protect from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorizeMiddleware.js";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getCategories)
  .post(authorize("owner", "manager"), createCategory);

router.route("/:id")
  .put(authorize("owner", "manager"), updateCategory)
  .delete(authorize("owner"), deleteCategory);

export default router;
