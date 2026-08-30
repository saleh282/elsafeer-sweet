import Recipe from "../models/Recipe.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const createRecipe = asyncHandler(async (req, res) => {
  const existing = await Recipe.findOne({ productId: req.body.productId });
  if (existing) throw new ApiError(400, "This product already has a recipe. Update it instead.");

  const recipe = await Recipe.create(req.body);
  res.status(201).json(recipe);
});

const getRecipes = asyncHandler(async (req, res) => {
  const recipes = await Recipe.find()
    .populate("productId", "name")
    .populate("items.rawMaterialId", "name unit");
  res.json(recipes);
});

const getRecipeByProduct = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findOne({ productId: req.params.productId })
    .populate("productId", "name")
    .populate("items.rawMaterialId", "name unit cost");
  if (!recipe) throw new ApiError(404, "No recipe found for this product");
  res.json(recipe);
});

const updateRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!recipe) throw new ApiError(404, "Recipe not found");
  res.json(recipe);
});

const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findByIdAndDelete(req.params.id);
  if (!recipe) throw new ApiError(404, "Recipe not found");
  res.json({ message: "Recipe deleted" });
});

export { createRecipe, getRecipes, getRecipeByProduct, updateRecipe, deleteRecipe };
