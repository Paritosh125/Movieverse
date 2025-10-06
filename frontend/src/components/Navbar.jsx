import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Menu, X, SlidersHorizontal } from "lucide-react"; // icons for menu & filters

const Navbar = ({
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    genreFilter,
    setGenreFilter,
}) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (location.pathname !== "/") navigate("/");
    };

    const handleLogout = () => {
        logout();
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-gray-900 shadow-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
                {/* Logo */}
                <Link
                    to="/"
                    className="text-white font-bold text-2xl md:text-3xl tracking-wide hover:text-blue-400 transition"
                >
                    MovieVerse
                </Link>

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-3 md:hidden">
                    <button
                        onClick={() => setFiltersOpen((prev) => !prev)}
                        className="text-gray-300 hover:text-blue-400 transition"
                    >
                        <SlidersHorizontal size={22} />
                    </button>
                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="text-gray-300 hover:text-blue-400 transition"
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Desktop Filters */}
                <form
                    onSubmit={handleSearchSubmit}
                    className="hidden md:flex flex-wrap items-center gap-3 bg-gray-800 px-4 py-2 rounded-full border border-gray-700"
                >
                    <input
                        type="text"
                        placeholder="Search..."
                        className="px-3 py-2 rounded-full bg-gray-700 text-white border border-gray-600 outline-none focus:ring-1 focus:ring-blue-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <select
                        className="px-3 py-2 rounded-full bg-gray-700 text-white border border-gray-600 hover:bg-gray-600 transition"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="">Sort</option>
                        <option value="rating">Rating</option>
                        <option value="year">Year</option>
                    </select>

                    <select
                        className="px-3 py-2 rounded-full bg-gray-700 text-white border border-gray-600 hover:bg-gray-600 transition"
                        value={genreFilter}
                        onChange={(e) => setGenreFilter(e.target.value)}
                    >
                        <option value="">All Genres</option>
                        <option value="Action">Action</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Drama">Drama</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Sci-Fi">Sci-Fi</option>
                        <option value="Romance">Romance</option>
                        <option value="Animation">Animation</option>
                        <option value="Mythology">Mythology</option>
                        <option value="Family">Family</option>
                        <option value="Romance">Romance</option>
                        <option value="Horror">Horror</option>
                        <option value="Thriller">Thriller</option>
                        <option value="Fantasy">Fantasy</option>
                    </select>
                </form>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center space-x-4">
                    {user ? (
                        <>
                            <span className="text-white font-semibold">{user.username}</span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-white hover:text-blue-400 transition">
                                Login
                            </Link>
                            <Link to="/register" className="text-white hover:text-blue-400 transition">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Filters */}
            {filtersOpen && (
                <div className="md:hidden bg-gray-800 border-t border-gray-700 px-4 py-3 space-y-3">
                    <form onSubmit={handleSearchSubmit} className="space-y-3">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <select
                            className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="">Sort By</option>
                            <option value="rating">Rating</option>
                            <option value="year">Year</option>
                        </select>

                        <select
                            className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600"
                            value={genreFilter}
                            onChange={(e) => setGenreFilter(e.target.value)}
                        >
                            <option value="">All Genres</option>
                            <option value="Action">Action</option>
                            <option value="Drama">Drama</option>
                            <option value="Comedy">Comedy</option>
                            <option value="Sci-Fi">Sci-Fi</option>
                            <option value="Romance">Romance</option>
                        </select>
                    </form>
                </div>
            )}

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-gray-800 border-t border-gray-700 px-4 py-3 space-y-3">
                    {user ? (
                        <>
                            <div className="text-white font-semibold">{user.username}</div>
                            <button
                                onClick={handleLogout}
                                className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="block text-white hover:text-blue-400 transition"
                                onClick={() => setMenuOpen(false)}
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="block text-white hover:text-blue-400 transition"
                                onClick={() => setMenuOpen(false)}
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
