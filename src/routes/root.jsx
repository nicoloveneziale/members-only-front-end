import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Message from "../components/messageComponent";
import {
  FaUsers,
  FaSignOutAlt,
  FaPlusCircle,
  FaSignInAlt,
  FaUserPlus,
  FaGlobe,
} from "react-icons/fa";

export default function Root() {
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sortBy, setSortBy] = useState("new");
  const location = useLocation();

  // Fetch user info
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    fetch("http://localhost:8080/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user));
  }, [token]);

  // Fetch messages
  useEffect(() => {
    fetch(`http://localhost:8080/messages/${sortBy}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
      });
  }, [sortBy]);

  // Log Out
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 min-h-screen font-sans text-gray-900 flex flex-col">
      <header className="bg-white bg-opacity-95 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <FaGlobe className="w-8 h-8 mr-2 text-purple-600" />
            <span className="text-xl font-semibold text-gray-800 tracking-tight">
              Members Only
            </span>
          </Link>
          <nav className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">
                  👋 Hi,{" "}
                  <span className="font-bold text-purple-700">
                    {user.username}
                  </span>
                  !
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  <FaSignOutAlt className="mr-2" />
                  Log Out
                </button>
                {!user.membership_status && (
                  <Link
                    to="/join"
                    className="flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <FaUsers className="mr-2" />
                    Join
                  </Link>
                )}
                <Link
                  to="/messages/create"
                  className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <FaPlusCircle className="mr-2" />
                  New Post
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition duration-200 ease-in-out"
                >
                  <FaSignInAlt className="mr-1" />
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-3 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <FaUserPlus className="mr-1" />
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-8">
        {location.pathname === "/" ? (
          <div className="space-y-6">
            <div className="flex justify-end mb-4">
              <label className="mr-2 font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="new">Newest</option>
                <option value="hot">Hot</option>
                <option value="most liked">Most Liked</option>
              </select>
            </div>
            {messages.map((message) => (
              <Message key={message.id} message={message} user={user} />
            ))}
          </div>
        ) : (
          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-lg shadow-md p-6">
            <Outlet />
          </div>
        )}
      </main>

      <footer className="bg-white bg-opacity-95 backdrop-blur-md shadow-inner py-6 mt-12">
        <div className="container mx-auto px-6 text-center text-gray-600 text-sm font-medium">
          &copy; {new Date().getFullYear()} Members Only. All rights reserved.
          <p className="mt-2 text-xs text-gray-500">
            Connect and share with our exclusive community!
          </p>
        </div>
      </footer>
    </div>
  );
}
