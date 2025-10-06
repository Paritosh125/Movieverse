import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "../axios";
import ReviewForm from "../components/ReviewForm";
import { AuthContext } from "../context/AuthContext";

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await axios.get(`/movies/${id}`);
                setMovie(res.data.movie);
                setReviews(res.data.reviews);
            } catch (err) {
                console.error("Error fetching movie:", err);
            }
        };
        fetchMovie();
    }, [id, refresh]);

    const handleDeleteReview = async (reviewId) => {
        if (!confirm("Delete this review?")) return;

        try {
            await axios.delete(`/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setRefresh(!refresh); // refresh reviews
        } catch (err) {
            console.error("Failed to delete review:", err);
        }
    };

    if (!movie) {
        return <p className="text-center mt-32 text-gray-500">Loading movie details...</p>;
    }

    return (
        <div className="pt-24 px-6 min-h-screen bg-black text-white">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 bg-gray-900 rounded-lg shadow-md overflow-hidden">
                <img
                    src={movie.posterURL || "https://via.placeholder.com/300x450?text=No+Poster"}
                    alt={movie.title}
                    className="w-full md:w-1/3 object-cover rounded-l-lg"
                />
                <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-blue-400 mb-4">{movie.title}</h1>
                        <p className="text-gray-400 mb-2"><strong>Year:</strong> {new Date(movie.releaseDate).getFullYear()}</p>
                        <p className="text-gray-400 mb-2"><strong>Genre:</strong> {movie.genre.join(", ")}</p>
                        <p className="text-gray-300 leading-relaxed">{movie.description}</p>
                    </div>
                    <p className="text-gray-400 mt-4"><strong>Rating:</strong> {movie.rating}/10</p>
                </div>
            </div>

            {/* Reviews Section */}
            {/* Reviews Section */}
            <div className="max-w-4xl mx-auto mt-10">
                {user ? (
                    <ReviewForm
                        movieId={movie._id}
                        userId={user._id}
                        onReviewUpdated={() => setRefresh(!refresh)}
                    />
                ) : (
                    <p className="text-blue-400 mb-4 text-center">
                        Please <span className="font-semibold">log in</span> to post a review.
                    </p>
                )}

                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">Reviews</h2>
                    {reviews.length === 0 && <p className="text-gray-400">No reviews yet.</p>}
                    {reviews.map((r) => (
                        <div key={r._id} className="bg-gray-800 p-4 mb-3 rounded-lg flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-indigo-400">{r.userId?.username || "Unknown User"}</p>
                                <p className="text-gray-300">{r.reviewText}</p>
                                <p className="text-gray-400 mt-1 text-sm">Rating: {r.rating}/10</p>
                            </div>
                            {user && user._id === r.userId?._id && (
                                <button
                                    onClick={() => handleDeleteReview(r._id)}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default MovieDetails;
