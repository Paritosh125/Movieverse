import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true }, // Constraint: Unique + Required
    description: { type: String, required: true },
    genre: { type: [String], required: true },
    releaseDate: { type: Date, required: true },
    rating: { type: Number, min: 0, max: 10, default: 0 }, // Constraint: CHECK (0–10)
    posterURL: { type: String }
}, { timestamps: true });

export default mongoose.model("Movie", movieSchema);
