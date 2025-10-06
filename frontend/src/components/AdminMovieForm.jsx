import { useState, useEffect } from "react";
import axios from "../axios";

const AdminMovieForm = ({ movieToEdit, onSuccess, onCancel }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [genre, setGenre] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [posterURL, setPosterURL] = useState("");

    useEffect(() => {
        if (movieToEdit) {
            setTitle(movieToEdit.title);
            setDescription(movieToEdit.description);
            setGenre(movieToEdit.genre.join(", "));
            setReleaseDate(movieToEdit.releaseDate?.split("T")[0]);
            setPosterURL(movieToEdit.posterURL);
        } else {
            setTitle("");
            setDescription("");
            setGenre("");
            setReleaseDate("");
            setPosterURL("");
        }
    }, [movieToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const movieData = {
            title,
            description,
            genre: genre.split(",").map((g) => g.trim()),
            releaseDate,
            posterURL,
        };

        try {
            if (movieToEdit) {
                await axios.put(`/movies/${movieToEdit._id}`, movieData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Movie updated successfully!");
            } else {
                await axios.post("/movies", movieData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Movie added successfully!");
            }
            onSuccess(); // Refresh movie list
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Error saving movie");
        }
    };

    return (
        <div className="bg-[#121212] border border-gray-700 p-6 rounded-xl shadow-lg max-w-lg mx-auto text-white">
            <h2 className="text-2xl font-bold text-center text-red-500 mb-6">
                {movieToEdit ? "Edit Movie" : "Add New Movie"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Movie Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full p-3 bg-[#1a1a1a] rounded text-white border border-gray-600 focus:ring-2 focus:ring-red-500 outline-none"
                />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full p-3 bg-[#1a1a1a] rounded text-white border border-gray-600 h-24 focus:ring-2 focus:ring-red-500 outline-none"
                />

                <input
                    type="text"
                    placeholder="Genre (comma separated)"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    required
                    className="w-full p-3 bg-[#1a1a1a] rounded text-white border border-gray-600 focus:ring-2 focus:ring-red-500 outline-none"
                />

                <input
                    type="date"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    required
                    className="w-full p-3 bg-[#1a1a1a] rounded text-white border border-gray-600 focus:ring-2 focus:ring-red-500 outline-none"
                />

                <input
                    type="url"
                    placeholder="Poster Image URL"
                    value={posterURL}
                    onChange={(e) => setPosterURL(e.target.value)}
                    required
                    className="w-full p-3 bg-[#1a1a1a] rounded text-white border border-gray-600 focus:ring-2 focus:ring-red-500 outline-none"
                />

                <div className="flex justify-between mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded font-semibold transition"
                    >
                        {movieToEdit ? "Update" : "Add"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminMovieForm;
