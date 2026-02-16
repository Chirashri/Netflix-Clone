import React from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{
      backgroundColor: "black",
      color: "white",
      minHeight: "100vh",
      padding: "100px 50px"
    }}>
      <h1>Profile</h1>

      <div style={{
        marginTop: "40px",
        backgroundColor: "#111",
        padding: "30px",
        maxWidth: "400px"
      }}>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>

        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
          onClick={handleLogout}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Profile;
