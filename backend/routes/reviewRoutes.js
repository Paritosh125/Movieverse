// reviewRoutes.js
import express from "express";
import Review from "../models/Review.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// 🧠 Get all reviews (Admin)
router.get("/all", protect, admin, async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate("movieId", "title")
            .populate("userId", "username email")
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error.message);
        res.status(500).json({ message: "Failed to fetch reviews" });
    }
});

// 🎬 Get reviews for a specific movie (Public/User)
router.get("/:movieId", async (req, res) => {
    try {
        const reviews = await Review.find({ movieId: req.params.movieId })
            .populate("userId", "username")
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✍️ Post a review (Logged-in user)
router.post("/", protect, async (req, res) => {
    try {
        const { movieId, reviewText, rating } = req.body;

        const review = new Review({
            movieId,
            userId: req.user._id,
            reviewText,
            rating,
        });

        await review.save();
        const populatedReview = await review.populate("userId", "username");
        res.status(201).json(populatedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✏️ Update a review (User can update their own review)
router.put("/:id", protect, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: "Review not found" });

        // Only the review owner can update
        if (review.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to edit this review" });
        }

        review.reviewText = req.body.reviewText || review.reviewText;
        review.rating = req.body.rating ?? review.rating;

        await review.save();
        const populatedReview = await review.populate("userId", "username");
        res.json(populatedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 🗑️ Delete a review (Admin can delete any, User can delete own)
router.delete("/:id", protect, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: "Review not found" });

        // If user is NOT owner and NOT admin, block
        if (review.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: "Not authorized to delete this review" });
        }

        await review.remove();
        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



export default router;
