import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PuffLoader } from "react-spinners";

export default function Join() {
  const [passcode, setPasscode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://members-only-production-3673.up.railway.app/join",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ passcode }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        login(data.token);
        navigate("/");
      } else {
        console.error("Join failed:", response.status);
        const errorData = await response.json();
        alert(errorData?.message || "Incorrect Passcode!");
      }
    } catch (error) {
      console.error("Join error:", error);
      alert("An unexpected error occurred while trying to join.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-100 via-lime-100 to-yellow-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Join Our Club
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="passcode"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Passcode
              </label>
              <input
                id="passcode"
                name="passcode"
                type="text"
                placeholder="Enter the club passcode"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className={`bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:shadow-outline w-full transition duration-300 ease-in-out ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? <PuffLoader color="#fff" size={20} /> : "Join Club"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need a passcode? Contact an administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
