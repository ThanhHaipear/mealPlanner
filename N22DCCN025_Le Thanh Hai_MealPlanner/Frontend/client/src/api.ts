import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

// 🔹 Interface cho Meal
export interface Meal {
    _id?: string;
    name: string;
    type: "sáng" | "trưa" | "tối";
    calories: number;
    date: string | Date;
}

export const getMeals = async () => {
    const res = await api.get<Meal[]>("/meals");
    return res.data;
};

export const createMeal = async (meal: Omit<Meal, "_id">) => {
    const res = await api.post<Meal>("/meals", meal);
    return res.data;
};

export const deleteMeal = async (id: string) => {
    const res = await api.delete(`/meals/${id}`);
    return res.data;
};

// 🔹 Thêm hàm getStats
export const getStats = async () => {
    const res = await api.get("/meals/stats");
    return res.data;
};
