// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

// Middleware
import { protect } from "./middleware/authMiddleware.js";
import { admin } from "./middleware/adminMiddleware.js";

dotenv.config();

const app = express();

// ===============================
// 🔧 Middleware
// ===============================
app.use(express.json());

// ✅ CORS configuration
const corsOptions = {
    origin: [
        "https://movieverse-125.vercel.app", // production frontend
        "http://localhost:5173" // local frontend (optional)
    ],
    credentials: true, // allow sending cookies or auth headers
};
app.use(cors(corsOptions));

// ===============================
// 🧭 API Routes
// ===============================

// Auth routes (register/login)
app.use("/api/auth", authRoutes);

// Users route (Admin only)
app.use("/api/users", userRoutes);

// Movie routes
app.use("/api/movies", movieRoutes);

// Review routes
app.use("/api/reviews", reviewRoutes);

// Example protected route
app.get("/api/protected", protect, (req, res) => {
    res.json({ message: `Hello ${req.user.email}, you are authenticated.` });
});

// Example admin-only route
app.get("/api/admin/test", protect, admin, (req, res) => {
    res.json({ message: "Admin access verified ✅" });
});

// ===============================
// 📡 MongoDB Connection
// ===============================
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===============================
// 🏁 Default Route
// ===============================
app.get("/", (req, res) => {
    res.send("🎬 MovieVerse API running...");
});

// ===============================
// 🚀 Start Server
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
