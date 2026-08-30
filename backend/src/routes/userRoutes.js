import express from "express";
import protect from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorizeMiddleware.js";
import { createUser, getUsers, updateUser, changeOwnPassword } from "../controllers/userController.js";

const router = express.Router();
router.use(protect);

router.route("/")
  .get(authorize("owner"), getUsers)
  .post(authorize("owner"), createUser);

router.put("/:id", authorize("owner"), updateUser);
router.put("/me/password", changeOwnPassword);

export default router;
