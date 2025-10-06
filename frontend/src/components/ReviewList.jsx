import { useEffect, useState } from "react";
import axios from "../axios";

const ReviewList = ({ movieId, refreshTrigger }) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(`/reviews/${movieId}`);
                setReviews(res.data);
            } catch (err) {
                console.error("Error loading reviews:", err);
            }
        };
        fetchReviews();
    }, [movieId, refreshTrigger]);

    return (
        <div className="mt-8">
            <h3 className="text-2xl mb-4 text-blue-400 font-semibold">User Reviews</h3>
            {reviews.length === 0 ? (
                <p className="text-gray-400">No reviews yet.</p>
            ) : (
                <ul className="space-y-4">
                    {reviews.map((rev) => (
                        <li key={rev._id} className="p-4 bg-gray-800 rounded-lg shadow-sm">
                            <p className="font-semibold text-white">
                                {rev.userId?.username || "Anonymous"} — ⭐ {rev.rating}/10
                            </p>
                            <p className="text-gray-300">{rev.reviewText}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ReviewList;
