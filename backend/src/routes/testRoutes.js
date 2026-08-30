import express from "express";
import protect from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorizeMiddleware.js";

const router = express.Router();

router.get(
  "/protected",
  protect,
  authorize("owner"),
  (req, res) => {
    res.json({
      message: "You are authorized as owner",
      user: req.user,
    });
  }
);

export default router;