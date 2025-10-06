import { useEffect, useState } from "react";
import api from "../axios.js";
import { motion } from "framer-motion";
import { Edit, Trash2, PlusCircle } from "lucide-react";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("overview");
    const [movies, setMovies] = useState([]);
    const [users, setUsers] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        genre: [],
        releaseDate: "",
        posterURL: "",
    });
    const [editMovieId, setEditMovieId] = useState(null);

    const allGenres = [
        "Action", "Adventure", "Animation", "Mythology", "Family",
        "Drama", "Horror", "Comedy", "Thriller", "Fantasy",
        "Romance", "Music", "Biography", "Sport", "Sci-Fi",
        "Crime", "Documentary", "Mystery", "Animation", "Mythology"
    ];

    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // Fetch all dashboard data
    const fetchMovies = async () => {
        try {
            const res = await api.get("/movies", config);
            setMovies(res.data);
        } catch (err) {
            console.error("Error fetching movies:", err.response?.data || err.message);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get("/users", config);
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users:", err.response?.data || err.message);
        }
    };

    const fetchReviews = async () => {
        try {
            const res = await api.get("/reviews/all", config);
            const safeReviews = res.data.map((r) => ({
                ...r,
                movieId: r.movieId || { title: "Unknown Movie" },
                userId: r.userId || { username: "Unknown User" },
            }));
            setReviews(safeReviews);
        } catch (err) {
            console.error("Error fetching reviews:", err.response?.data || err.message);
        }
    };

    useEffect(() => {
        fetchMovies();
        fetchUsers();
        fetchReviews();
    }, []);

    // Add or edit movie
    const handleSaveMovie = async (e) => {
        e.preventDefault();
        try {
            if (editMovieId) {
                await api.put(`/movies/${editMovieId}`, formData, config);
            } else {
                await api.post("/movies", formData, config);
            }
            setShowForm(false);
            setEditMovieId(null);
            setFormData({ title: "", description: "", genre: [], releaseDate: "", posterURL: "" });
            fetchMovies();
        } catch (err) {
            console.error("Error saving movie:", err.response?.data || err.message);
        }
    };

    const handleDeleteMovie = async (id) => {
        if (!confirm("Delete this movie?")) return;
        try {
            await api.delete(`/movies/${id}`, config);
            fetchMovies();
        } catch (err) {
            console.error("Error deleting movie:", err.response?.data || err.message);
        }
    };

    const handleEditMovie = (movie) => {
        setFormData({
            title: movie.title,
            description: movie.description,
            genre: movie.genre,
            releaseDate: movie.releaseDate.split("T")[0],
            posterURL: movie.posterURL,
        });
        setEditMovieId(movie._id);
        setShowForm(true);
    };

    const handleDeleteUser = async (id) => {
        if (!confirm("Delete this user?")) return;
        try {
            await api.delete(`/users/${id}`, config);
            fetchUsers();
        } catch (err) {
            console.error("Error deleting user:", err.response?.data || err.message);
        }
    };

    const handleDeleteReview = async (id) => {
        try {
            await api.delete(`/reviews/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReviews(reviews.filter((r) => r._id !== id));
        } catch (err) {
            console.error("Failed to delete review:", err);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-gray-950 text-white p-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-100">Admin Dashboard</h1>

            {/* Tabs */}
            <div className="flex justify-center gap-4 mb-8">
                {["overview", "movies", "users", "reviews"].map((tab) => (
                    <button
                        key={tab}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${activeTab === tab ? "bg-indigo-600" : "bg-gray-800 hover:bg-gray-700"}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Overview */}
            {activeTab === "overview" && (
                <motion.div className="grid sm:grid-cols-3 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {[{ label: "Total Movies", value: movies.length },
                    { label: "Total Users", value: users.length },
                    { label: "Total Reviews", value: reviews.length }
                    ].map((stat, i) => (
                        <div key={i} className="bg-gray-800 rounded-xl p-6 text-center shadow-lg">
                            <h2 className="text-2xl font-bold text-indigo-400">{stat.value}</h2>
                            <p className="text-gray-400 mt-2">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            )}

            {/* Movies */}
            {activeTab === "movies" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Movies List</h2>
                        <button
                            className="flex items-center bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg"
                            onClick={() => setShowForm(true)}
                        >
                            <PlusCircle size={18} className="mr-2" /> Add Movie
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-gray-700 text-left">
                                    <th className="px-4 py-3">Title</th>
                                    <th className="px-4 py-3">Genre</th>
                                    <th className="px-4 py-3">Release Date</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movies.map((movie) => (
                                    <tr key={movie._id} className="border-t border-gray-700">
                                        <td className="px-4 py-3">{movie.title}</td>
                                        <td className="px-4 py-3">{movie.genre.join(", ")}</td>
                                        <td className="px-4 py-3">{new Date(movie.releaseDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 flex gap-2">
                                            <button className="text-yellow-400 hover:text-yellow-500" onClick={() => handleEditMovie(movie)}>
                                                <Edit size={18} />
                                            </button>
                                            <button className="text-red-500 hover:text-red-600" onClick={() => handleDeleteMovie(movie._id)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Movie Form */}
                    {showForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                            <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
                                <h2 className="text-lg font-semibold mb-4">{editMovieId ? "Edit Movie" : "Add New Movie"}</h2>
                                <form onSubmit={handleSaveMovie} className="space-y-3">
                                    <input type="text" placeholder="Title" className="w-full p-2 bg-gray-800 rounded"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                    <textarea placeholder="Description" className="w-full p-2 bg-gray-800 rounded"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                    <div className="flex flex-wrap gap-2">
                                        {allGenres.map((genre) => (
                                            <button
                                                key={genre}
                                                type="button"
                                                className={`px-3 py-1 rounded-full text-sm border ${formData.genre.includes(genre)
                                                    ? "bg-indigo-600 border-indigo-600 text-white"
                                                    : "bg-gray-800 border-gray-600 text-gray-300"
                                                    }`}
                                                onClick={() => {
                                                    const updated = formData.genre.includes(genre)
                                                        ? formData.genre.filter((g) => g !== genre)
                                                        : [...formData.genre, genre];
                                                    setFormData({ ...formData, genre: updated });
                                                }}
                                            >
                                                {genre}
                                            </button>
                                        ))}
                                    </div>
                                    <input type="date" className="w-full p-2 bg-gray-800 rounded"
                                        value={formData.releaseDate}
                                        onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                                        required
                                    />
                                    <input type="text" placeholder="Poster URL" className="w-full p-2 bg-gray-800 rounded"
                                        value={formData.posterURL}
                                        onChange={(e) => setFormData({ ...formData, posterURL: e.target.value })}
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600">Cancel</button>
                                        <button type="submit" className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700">{editMovieId ? "Save" : "Add"}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

            {/* Users */}
            {activeTab === "users" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="text-xl font-semibold mb-4">User Details</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-gray-700 text-left">
                                    <th className="px-4 py-3">Username</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} className="border-t border-gray-700">
                                        <td className="px-4 py-3">{user.username}</td>
                                        <td className="px-4 py-3">{user.email}</td>
                                        <td className="px-4 py-3">
                                            <button className="text-red-500 hover:text-red-600" onClick={() => handleDeleteUser(user._id)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {/* Reviews */}
            {activeTab === "reviews" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="text-xl font-semibold mb-4">Reviews</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-gray-700 text-left">
                                    <th className="px-4 py-3">Movie</th>
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Rating</th>
                                    <th className="px-4 py-3">Review</th>
                                    {/* <th className="px-4 py-3">Actions</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map((r) => (
                                    <tr key={r._id} className="border-t">
                                        <td className="px-4 py-3">{r.movieId?.title || "N/A"}</td>
                                        <td className="px-4 py-3">{r.userId?.username || "Unknown"}</td>
                                        <td className="px-4 py-3">{r.rating}/10</td>
                                        <td className="px-4 py-3">{r.reviewText}</td>
                                        {/* <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleDeleteReview(r._id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </td> */}
                                    </tr>
                                ))}
                            </tbody>


                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

