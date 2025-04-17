import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, firstname, lastname }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token);
        navigate("/");
      } else {
        console.log(response);
        alert("Invalid details");
      }
    } catch (error) {
      alert("An error occurred");
    }
  };

  return (
    <div className="container">
      <div className="form-container register-form-container">
        <h1 className="form-title register-title">Register</h1>
        <form onSubmit={handleSubmit} className="form register-form">
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
          <div>
            <label htmlFor="firstname" className="form-label">
              First Name
            </label>
            <input
              id="firstname"
              name="firstname"
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="lastname" className="form-label">
              Last Name
            </label>
            <input
              id="lastname"
              name="lastname"
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>
          <button type="submit" className="form-button login-button">
            Register
          </button>
        </form>
        <div className="form-footer">
          <p>
            Already have an account?
            <a href="/login" className="login-link">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
