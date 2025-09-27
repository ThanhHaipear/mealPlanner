import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ["sáng", "trưa", "tối"], required: true },
    calories: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now } // 📌 ngày ăn (có thể nhập bù)
}, { timestamps: true }); // timestamps vẫn giữ để biết ngày tạo/sửa record

export default mongoose.model("Meal", mealSchema);
