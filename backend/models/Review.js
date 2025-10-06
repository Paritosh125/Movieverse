import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true }, // Relationship
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  // Relationship
    reviewText: { type: String, required: true },
    rating: { type: Number, min: 0, max: 10, required: true }
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
