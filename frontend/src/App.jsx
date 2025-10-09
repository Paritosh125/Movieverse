// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "./context/AuthContext.jsx";

import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import MovieDetails from "./pages/MovieDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Footer from "./components/Footer.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [genreFilter, setGenreFilter] = useState("");

  return (
    <AuthProvider>
      <Router>
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortOption={sortOption}
          setSortOption={setSortOption}
          genreFilter={genreFilter}
          setGenreFilter={setGenreFilter}
        />

        <Routes>
          <Route
            path="/"
            element={
              <Home
                searchTerm={searchTerm}
                sortOption={sortOption}
                genreFilter={genreFilter}
              />
            }
          />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Route path="*" element={<NotFound />} />
      </Router>
      <Router>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
