import Meal from "../models/Meal.js";

// Lấy danh sách meals
export const getMeals = async (req, res) => {
    try {
        // sort theo date (nếu có), nếu không thì fallback createdAt
        const meals = await Meal.find().sort({ date: -1, createdAt: -1 });
        res.json(meals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Thêm meal mới
export const createMeal = async (req, res) => {
    try {
        const meal = new Meal({
            ...req.body,
            // nếu không gửi date thì mặc định hôm nay
            date: req.body.date ? new Date(req.body.date) : new Date(),
        });
        const saved = await meal.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Xóa meal
export const deleteMeal = async (req, res) => {
    try {
        await Meal.findByIdAndDelete(req.params.id);
        res.json({ message: "Meal deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 📌 Thống kê tổng calo theo ngày
export const getStats = async (req, res) => {
    try {
        const stats = await Meal.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: { $ifNull: ["$date", "$createdAt"] } // 👈 fallback
                        }
                    },
                    totalCalories: { $sum: "$calories" }
                }
            },
            { $sort: { _id: -1 } }
        ]);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
