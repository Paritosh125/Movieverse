import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
    return (
        <Link
            to={`/movies/${movie._id}`}
            className="group relative rounded-xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-[0_0_20px_#00BFFF] bg-[#0a0f1f] border border-[rgba(0,191,255,0.3)]"
        >
            <img
                src={movie.posterURL || "https://via.placeholder.com/300x450?text=No+Poster"}
                alt={movie.title}
                className="w-full h-72 object-cover group-hover:opacity-80 transition"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-4">
                <h3 className="text-lg font-semibold text-[var(--color-cyber-neon)]">
                    {movie.title}
                </h3>
                <p className="text-gray-300 text-sm">
                    {new Date(movie.releaseDate).getFullYear()}
                </p>
            </div>
        </Link>
    );
};

export default MovieCard;
