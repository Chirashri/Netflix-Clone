import React, { useState } from "react";
import API from "../api";   // ✅ IMPORTANT
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="login">
      <div className="login_box">
        <h1>Sign In</h1>

        <input
          type="email"
          placeholder="Email or phone number"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Sign In</button>

        <p>
          New to Netflix?{" "}
          <span onClick={() => navigate("/register")}>
            Sign up now.
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
