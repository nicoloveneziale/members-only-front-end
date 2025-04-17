import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
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
        localStorage.setItem("token", data.token);
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
}
