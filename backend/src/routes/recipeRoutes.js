import express from "express";
import protect from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorizeMiddleware.js";
import {
  createRecipe,
  getRecipes,
  getRecipeByProduct,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipeController.js";

const router = express.Router();
router.use(protect);

router.route("/")
  .get(getRecipes)
  .post(authorize("owner", "manager"), createRecipe);

router.get("/product/:productId", getRecipeByProduct);

router.route("/:id")
  .put(authorize("owner", "manager"), updateRecipe)
  .delete(authorize("owner"), deleteRecipe);

export default router;
