import { useState, useEffect } from "react";
import axios from "../axios";

const ReviewForm = ({ movieId, userId, onReviewUpdated }) => {
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(0);
    const [existingReview, setExistingReview] = useState(null);

    useEffect(() => {
        const fetchUserReview = async () => {
            if (!userId) return;
            try {
                const res = await axios.get(`/reviews/${movieId}`);
                const userReview = res.data.find(r => r.userId?._id === userId);
                if (userReview) {
                    setExistingReview(userReview);
                    setReviewText(userReview.reviewText);
                    setRating(userReview.rating);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchUserReview();
    }, [movieId, userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            alert("You must be logged in to post or edit a review.");
            return;
        }

        try {
            let res;
            if (existingReview) {
                res = await axios.put(
                    `/reviews/${existingReview._id}`,
                    { reviewText, rating },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                res = await axios.post(
                    "/reviews",
                    { movieId, reviewText, rating },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            setExistingReview(res.data);
            onReviewUpdated();
            alert(existingReview ? "Review updated!" : "Review added!");
        } catch (err) {
            console.error(err);
            alert("Failed to submit review.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-900 p-5 rounded-lg mb-6 shadow-md">
            <h3 className="text-xl mb-3 font-semibold text-blue-400">
                {existingReview ? "Edit Your Review" : "Write a Review"}
            </h3>
            <textarea
                className="w-full p-3 rounded bg-gray-800 text-white mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Write your review..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
            />
            <div className="flex items-center gap-3">
                <input
                    type="number"
                    min="0"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-24 p-2 rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 outline-none"
                    required
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded font-semibold transition"
                >
                    {existingReview ? "Update Review" : "Submit Review"}
                </button>
            </div>
        </form>
    );
};

export default ReviewForm;
