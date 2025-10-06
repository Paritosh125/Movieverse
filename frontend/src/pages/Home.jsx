import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import axios from "../axios";
import MovieCard from "../components/MovieCard";

export default function Home({ searchTerm, sortOption, genreFilter }) {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await axios.get("/movies");
                const data = res.data;
                setMovies(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error fetching movies:", err);
                setMovies([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    const filteredMovies = useMemo(() => {
        let filtered = [...movies];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(m =>
                m.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Genre filter
        if (genreFilter) {
            filtered = filtered.filter(m => m.genre.includes(genreFilter));
        }

        // Sort logic
        if (sortOption === "rating") {
            filtered.sort((a, b) => b.rating - a.rating);
        } else if (sortOption === "year") {
            filtered.sort(
                (a, b) =>
                    new Date(b.releaseDate).getFullYear() -
                    new Date(a.releaseDate).getFullYear()
            );
        }

        return filtered;
    }, [movies, searchTerm, sortOption, genreFilter]);

    if (loading) {
        return <div className="text-center text-gray-400 mt-32">Loading movies...</div>;
    }

    return (
        <div className="pt-28 px-6 md:px-12 pb-12 bg-gradient-to-b from-[var(--color-cyber-dark)] to-black min-h-screen">
            <h2 className="text-3xl md:text-4xl font-orbitron text-[var(--color-cyber-blue)] mb-8 text-center">
                Explore Movies
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {filteredMovies.length > 0 ? (
                    filteredMovies.map((movie, index) => (
                        <motion.div
                            key={movie._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.4 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <MovieCard movie={movie} />
                        </motion.div>
                    ))
                ) : (
                    <p className="text-gray-400 text-center col-span-full">
                        No movies found 😔
                    </p>
                )}
            </div>
        </div>
    );
}
