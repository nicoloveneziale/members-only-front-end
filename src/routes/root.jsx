import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function Root() {
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const location = useLocation();

  //Fetch user info
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

  //Fetch messages
  useEffect(() => {
    fetch("http://localhost:8080")
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages);
      });
  }, []);

  //Log Out
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="font-sans min-h-screen flex flex-col bg-gray-100 text-gray-800">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          {user ? (
            <>
              <h1 className="text-xl font-semibold">
                Hi, <span className="font-bold">{user.username}</span>!
              </h1>
              <nav>
                <ul className="flex gap-4">
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-blue-500 hover:underline"
                    >
                      Log Out
                    </button>
                  </li>
                  {!user.membership_status && (
                    <li>
                      <Link
                        to="/join"
                        className="text-blue-500 hover:underline"
                      >
                        Join Club
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      to="/messages/create"
                      className="text-blue-500 hover:underline"
                    >
                      Create Post
                    </Link>
                  </li>
                </ul>
              </nav>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold">Members Only</h1>
              <nav>
                <ul className="flex gap-4">
                  <li>
                    <Link to="/login" className="text-blue-500 hover:underline">
                      Log In
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="text-blue-500 hover:underline"
                    >
                      Register
                    </Link>
                  </li>
                </ul>
              </nav>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        {location.pathname === "/" && (
          <div className="grid gap-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-bold">{message.title}</h3>
                <p className="mt-2">{message.text}</p>

                {user && user.membership_status !== null && (
                  <div className="text-sm text-gray-500 mt-3">
                    <span>{timeAgo(message.date)}</span> ·{" "}
                    <span>
                      Posted by {message.users.username}
                      {message.users.membership_status ? " (member)" : ""}
                    </span>
                  </div>
                )}

                {user && (
                  <form
                    method="POST"
                    action={`/messages/${message.id}/like`}
                    className="mt-2"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <button
                      type="submit"
                      className="text-red-500 hover:underline"
                    >
                      ❤️ Like ({message._count?.likedBy || 0})
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
        <Outlet />
      </main>

      <footer className="bg-white shadow py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          &copy; 2025 Members Only. Connect with others!
        </div>
      </footer>
    </div>
  );
}
