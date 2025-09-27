import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mealRoutes from "./routes/mealRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/meals", mealRoutes);

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`)))
    .catch((err) => console.error("❌ DB Connection Error:", err));

// 📌 Route test MongoDB
app.get("/api/test-db", async (req, res) => {
    try {
        // chạy thử một lệnh đơn giản
        await mongoose.connection.db.admin().ping();
        res.json({ success: true, message: "✅ MongoDB đang kết nối OK" });
    } catch (err) {
        console.error("❌ MongoDB connection test error:", err);
        res.status(500).json({ success: false, message: "❌ Không kết nối được MongoDB", error: err.message });
    }
});
