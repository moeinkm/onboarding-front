import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">
        Onboarding App
      </Link>
      <div className="navbar-nav">
        {isAuthenticated ? (
          <>
            <Link className="nav-item nav-link" to="/files">
              Files
            </Link>
            <Link className="nav-item nav-link" to="/upload">
              Upload
            </Link>
            <button className="nav-item nav-link btn btn-link" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="nav-item nav-link" to="/login">
              Login
            </Link>
            <Link className="nav-item nav-link" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
