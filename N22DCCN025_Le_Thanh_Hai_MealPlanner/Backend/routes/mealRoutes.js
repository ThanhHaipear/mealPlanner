import express from "express";
import { getMeals, createMeal, deleteMeal, getStats } from "../controllers/mealController.js";

const router = express.Router();

router.get("/", getMeals);
router.post("/", createMeal);
router.delete("/:id", deleteMeal);
router.get("/stats", getStats);  // 📌 thêm route thống kê

export default router;
