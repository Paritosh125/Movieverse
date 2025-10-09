// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-gray-950 text-center text-white p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <h1 className="text-6xl font-bold text-indigo-500 mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
            <p className="text-gray-400 max-w-md mb-6">
                Oops! The page you’re looking for doesn’t exist or has been moved.
                Please check the URL or return to the homepage.
            </p>
            <Link
                to="/"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
            >
                Go Home
            </Link>
        </motion.div>
    );
}
