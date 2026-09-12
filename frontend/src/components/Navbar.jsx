import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const dashboardLink =
    user?.role === "farmer" ? "/farmer/dashboard" : user?.role === "admin" ? "/admin" : "/products";

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-glass border-b border-leaf-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-xl text-leaf-700">
          <span>🌾</span> உழவன் சந்தை
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-leaf-900">
          <Link to="/products" className="hover:text-leaf-600">பொருட்கள்</Link>
          <Link to="/nearby-farmers" className="hover:text-leaf-600">அருகிலுள்ள விவசாயிகள்</Link>
          <Link to="/customer-info" className="hover:text-leaf-600">வாடிக்கையாளர் தகவல்</Link>
          {user?.role === "farmer" && <Link to="/farmer/info-center" className="hover:text-leaf-600">தகவல் மையம்</Link>}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to={dashboardLink} className="btn-secondary hidden sm:inline-block">
                {user.role === "farmer" ? "என் டாஷ்போர்டு" : user.role === "admin" ? "நிர்வாகம்" : "என் ஆர்டர்கள்"}
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="btn-primary"
              >
                வெளியேறு
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">Login</Link>
              <Link to="/register" className="btn-primary hidden sm:inline-block">Register</Link>
            </>
          )}
          <button className="md:hidden text-2xl" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden flex flex-col gap-3 px-4 pb-4 text-sm font-medium text-leaf-900">
          <Link to="/products" onClick={() => setOpen(false)}>பொருட்கள்</Link>
          <Link to="/nearby-farmers" onClick={() => setOpen(false)}>அருகிலுள்ள விவசாயிகள்</Link>
          <Link to="/customer-info" onClick={() => setOpen(false)}>வாடிக்கையாளர் தகவல்</Link>
          {!user && <Link to="/register" onClick={() => setOpen(false)}>Register</Link>}
        </div>
      )}
    </header>
  );
}
