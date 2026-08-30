import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { getSummary } from "../controllers/dashboardController.js";

const router = express.Router();
router.use(protect);

router.get("/summary", getSummary);

export default router;
