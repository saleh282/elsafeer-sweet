import express from "express";
import protect from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorizeMiddleware.js";
import {
  createBranch,
  getBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
} from "../controllers/branchController.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getBranches)
  .post(authorize("owner"), createBranch);

router.route("/:id")
  .get(getBranchById)
  .put(authorize("owner"), updateBranch)
  .delete(authorize("owner"), deleteBranch);

export default router;
