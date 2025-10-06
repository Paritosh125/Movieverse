import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// GET all users (Admin only)
router.get("/", protect, admin, async (req, res) => {
    try {
        const users = await User.find()
            .select("username email role createdAt updatedAt")
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE a user (Admin only)
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



export default router;
