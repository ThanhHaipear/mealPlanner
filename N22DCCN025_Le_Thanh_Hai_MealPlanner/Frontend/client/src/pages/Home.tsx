import { useEffect, useState } from "react";
import { getMeals, createMeal, deleteMeal, Meal } from "../api";

function Home() {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [form, setForm] = useState({
        name: "",
        type: "sáng",
        calories: 0,
        date: new Date().toISOString().split("T")[0], // yyyy-MM-dd
    });
    const [page, setPage] = useState(1);
    const [limit] = useState(5);

    // 📌 format ngày an toàn
    const formatDate = (date: any) => {
        if (!date) return "N/A";
        const d = new Date(date);
        return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString("vi-VN");
    };

    // Lấy toàn bộ meals từ backend
    const fetchMeals = async () => {
        try {
            const data = await getMeals(); // data: Meal[]
            setMeals(data);
        } catch (err) {
            console.error("❌ Lỗi khi fetch meals:", err);
        }
    };

    // Thêm meal
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newMeal: Omit<Meal, "_id"> = {
            name: form.name,
            type: form.type as "sáng" | "trưa" | "tối",   // 👈 ép kiểu
            calories: Number(form.calories),
            date: form.date ? new Date(form.date) : new Date(),
        };

        try {
            await createMeal(newMeal);
            setForm({
                name: "",
                type: "sáng",
                calories: 0,
                date: new Date().toISOString().split("T")[0],
            });
            fetchMeals();
        } catch (err) {
            console.error("❌ Lỗi khi tạo meal:", err);
        }
    };

    // Xóa meal
    const handleDelete = async (id: string) => {
        try {
            await deleteMeal(id);
            fetchMeals();
        } catch (err) {
            console.error("❌ Lỗi khi xóa meal:", err);
        }
    };

    // 📌 Phân trang trên frontend
    const totalPages = Math.ceil(meals.length / limit);
    const currentMeals = meals.slice((page - 1) * limit, page * limit);

    // 📌 Thống kê theo ngày chọn trong form
    const selectedDate = form.date;
    const mealsOfSelectedDate = meals.filter((meal) => {
        if (!meal.date) return false;
        const mealDate = new Date(meal.date);
        if (isNaN(mealDate.getTime())) return false;
        return mealDate.toISOString().split("T")[0] === selectedDate;
    });
    const totalCaloriesOfDate = mealsOfSelectedDate.reduce(
        (sum, meal) => sum + meal.calories,
        0
    );

    // Giao diện màu & icon
    const getMealTypeColor = (type: string) => {
        switch (type) {
            case "sáng":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "trưa":
                return "bg-orange-100 text-orange-800 border-orange-300";
            case "tối":
                return "bg-purple-100 text-purple-800 border-purple-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };
    const getMealTypeIcon = (type: string) => {
        switch (type) {
            case "sáng":
                return "🌅";
            case "trưa":
                return "☀️";
            case "tối":
                return "🌙";
            default:
                return "🍽️";
        }
    };

    useEffect(() => {
        fetchMeals();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
                        🍽️ MealPlanner
                    </h1>
                    <p className="text-gray-600">
                        Quản lý bữa ăn và theo dõi calo hàng ngày
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Form thêm bữa ăn */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold mb-6 text-blue-600">
                            ➕ Thêm bữa ăn
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <input
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
                                placeholder="Tên món ăn..."
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                                required
                            />
                            <select
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
                                value={form.type}
                                onChange={(e) =>
                                    setForm({ ...form, type: e.target.value })
                                }
                            >
                                <option value="sáng">🌅 Sáng</option>
                                <option value="trưa">☀️ Trưa</option>
                                <option value="tối">🌙 Tối</option>
                            </select>
                            <input
                                type="number"
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
                                placeholder="Calories..."
                                value={form.calories}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        calories: Number(e.target.value),
                                    })
                                }
                                required
                            />
                            <input
                                type="date"
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
                                value={form.date}
                                onChange={(e) =>
                                    setForm({ ...form, date: e.target.value })
                                }
                            />
                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl transition"
                            >
                                ➕ Thêm bữa ăn
                            </button>
                        </form>

                        {/* Thống kê theo ngày */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-xl border">
                            <h3 className="font-semibold text-gray-700">
                                📊 Tổng calo ngày {formatDate(selectedDate)}
                            </h3>
                            <p className="text-lg font-bold text-blue-600">
                                {totalCaloriesOfDate} cal
                            </p>
                        </div>
                    </div>

                    {/* Danh sách bữa ăn */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold mb-6 text-purple-600">
                            📋 Danh sách bữa ăn
                        </h2>

                        {currentMeals.length > 0 ? (
                            <div className="space-y-4">
                                {currentMeals.map((meal) => (
                                    <div
                                        key={meal._id}
                                        className={`p-4 rounded-xl border flex justify-between items-center ${getMealTypeColor(
                                            meal.type
                                        )}`}
                                    >
                                        <div>
                                            <h3 className="font-bold text-lg">{meal.name}</h3>
                                            <p className="text-sm">
                                                {getMealTypeIcon(meal.type)} {meal.type} -{" "}
                                                {meal.calories} cal
                                            </p>
                                            <p className="text-sm">
                                                📅 {formatDate(meal.date)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(meal._id!)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">Chưa có dữ liệu</p>
                        )}

                        {/* Phân trang frontend */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-6 gap-2">
                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1
                                ).map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => setPage(num)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${page === num
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 hover:bg-gray-300"
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
