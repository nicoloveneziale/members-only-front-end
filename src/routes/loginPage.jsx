import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        login(data.token);
        navigate("/");
      } else {
        console.log(response);
        alert("Invalid credentials");
      }
    } catch (error) {
      alert("An error occurred");
    }
  };

  return (
    <div className="container">
      <div className="form-container login-form-container">
        <h1 className="form-title login-title">Log In</h1>
        <form onSubmit={handleSubmit} className="form login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              name="username"
              placeholder="Username"
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="form-button login-button">
            Log In
          </button>
        </form>
        <div className="form-footer">
          <p>
            Don't have an account?
            <a href="/register" className="register-link">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
