import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="navbar">
      {/* LEFT SIDE */}
      <div className="navbar_left">
        <h1 className="navbar_logo" onClick={() => navigate("/")}>
          NETFLIX
        </h1>

        {token && (
          <>
            <span className="nav_link" onClick={() => navigate("/")}>
              Home
            </span>

            <span className="nav_link" onClick={() => navigate("/profile")}>
              Profile
            </span>
          </>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="navbar_right">
        {token && (
          <div className="search_container">
            <FaSearch
              className="search_icon"
              onClick={() => setShowSearch(!showSearch)}
            />
            <input
              type="text"
              placeholder="Titles, people, genres"
              className={`search_input ${showSearch ? "active" : ""}`}
            />
          </div>
        )}

        {!token ? (
          <button
            className="login_button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        ) : (
          <>
            <span
              className="user_name"
              onClick={() => navigate("/profile")}
            >
              {user?.name}
            </span>

            <button
              className="logout_button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
