// src/context/AuthContext.jsx
import { createContext, useState, useContext } from "react";

// 1️⃣ Create context
export const AuthContext = createContext();

// 2️⃣ Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem("user");
            return savedUser && savedUser !== "undefined" ? JSON.parse(savedUser) : null;
        } catch (err) {
            console.error("Error parsing user from localStorage:", err);
            return null;
        }
    });

    const login = (userData) => {
        if (!userData) return;
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token"); // also remove token for cleanup
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 3️⃣ ✅ Add custom hook for easier usage
export const useAuth = () => useContext(AuthContext);
