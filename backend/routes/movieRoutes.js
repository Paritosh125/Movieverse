import express from "express";
import Movie from "../models/Movie.js";
import Review from "../models/Review.js"; // ✅ import Review
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Predefined genres for dropdown
export const GENRES = [
    "Action", "Adventure", "Animation", "Mythology", "Family",
    "Drama", "Horror", "Comedy", "Thriller", "Fantasy",
    "Romance", "Music", "Biography", "Sport", "Sci-Fi",
    "Crime", "Documentary", "Mystery", "Animation", "Mythology"
];


// GET all movies (for dashboard & public)
router.get("/", async (req, res) => {
    try {
        const movies = await Movie.find().sort({ releaseDate: -1 });
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single movie + its reviews
router.get("/:id", async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: "Movie not found" });

        // fetch reviews and populate user's name
        const reviews = await Review.find({ movieId: req.params.id })
            .populate("userId", "username")
            .sort({ createdAt: -1 });

        res.json({ movie, reviews });
    } catch (err) {
        console.error("Error fetching movie:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// POST new movie (Admin only)
router.post("/", protect, admin, async (req, res) => {
    try {
        const { title, description, genre, releaseDate, posterURL, rating } = req.body;

        if (!title || !description || !genre || !releaseDate)
            return res.status(400).json({ message: "Missing required fields" });

        if (!Array.isArray(genre) || genre.some(g => !GENRES.includes(g)))
            return res.status(400).json({ message: "Invalid genre selection" });

        const movie = new Movie({ title, description, genre, releaseDate, posterURL, rating });
        await movie.save();
        res.status(201).json(movie);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update movie (Admin only)
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const { title, description, genre, releaseDate, posterURL, rating } = req.body;

        if (genre && (!Array.isArray(genre) || genre.some(g => !GENRES.includes(g))))
            return res.status(400).json({ message: "Invalid genre selection" });

        const updated = await Movie.findByIdAndUpdate(
            req.params.id,
            { title, description, genre, releaseDate, posterURL, rating },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Movie not found" });

        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE movie (Admin only)
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) return res.status(404).json({ message: "Movie not found" });
        res.json({ message: "Movie deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
