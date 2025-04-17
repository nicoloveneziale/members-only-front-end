import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Join() {
  const [passcode, setPasscode] = useState("");
  const { token, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ passcode }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token);
        navigate("/");
      } else {
        console.log(response);
        alert("Incorrect Passcode!");
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred");
    }
  };

  return (
    <div className="container">
      <div className="form-container login-form-container">
        <h1 className="form-title login-title">Join</h1>
        <form onSubmit={handleSubmit} className="form login-form">
          <div className="form-group">
            <label htmlFor="passcode" className="form-label">
              Passcode
            </label>
            <input
              id="passcode"
              name="passcode"
              placeholder="Passcode"
              type="text"
              className="form-input"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
            />
          </div>
          <button type="submit" className="form-button login-button">
            Join
          </button>
        </form>
      </div>
    </div>
  );
}
