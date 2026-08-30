import express from "express";
import protect from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorizeMiddleware.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getProducts)
  .post(authorize("owner", "manager"), createProduct);

router.route("/:id")
  .get(getProductById)
  .put(authorize("owner", "manager"), updateProduct)
  .delete(authorize("owner"), deleteProduct);

export default router;
