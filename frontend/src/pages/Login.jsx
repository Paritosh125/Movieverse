import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await api.post("/auth/login", { email, password });
            const userData = res.data.user;

            login(userData);
            localStorage.setItem("token", res.data.token);

            if (userData.role === "admin") navigate("/admin/dashboard");
            else navigate("/");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-black text-white px-4">
            <motion.form
                onSubmit={handleLogin}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_0_40px_rgba(99,102,241,0.4)] 
                   p-8 rounded-2xl w-full max-w-sm text-center"
            >
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold text-indigo-400 mb-6 font-orbitron"
                >
                    Welcome Back 👋
                </motion.h2>

                {error && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400 text-sm mb-3 bg-red-900/30 py-2 rounded-lg"
                    >
                        {error}
                    </motion.p>
                )}

                <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-3 mb-4 rounded-lg bg-white/10 border border-white/20 text-white 
                     placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3 mb-6 rounded-lg bg-white/10 border border-white/20 text-white 
                     placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(99,102,241,0.7)" }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold 
                     rounded-lg transition-all duration-300"
                >
                    Log In
                </motion.button>

                <p className="mt-5 text-sm text-gray-400">
                    Don’t have an account?{" "}
                    <span
                        onClick={() => navigate("/register")}
                        className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium"
                    >
                        Register here
                    </span>
                </p>

                <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl" />
            </motion.form>
        </div>
    );
};

export default Login;
