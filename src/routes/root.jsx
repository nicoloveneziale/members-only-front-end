import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useMessages } from "../context/MessageContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import MobileNav from "../components/mobileNav";
import Message from "../components/messageComponent";
import {
  FaUsers,
  FaSignOutAlt,
  FaPlusCircle,
  FaSignInAlt,
  FaUserPlus,
  FaGlobe,
  FaBars,
} from "react-icons/fa";
import { PuffLoader } from "react-spinners";

export default function Root() {
  const { token, logout } = useAuth();
  const { messages, fetchMessages, loading: messagesLoading } = useMessages();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [sortBy, setSortBy] = useState("new");
  const [userLoading, setUserLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const headerRef = useRef(null);

  const toggleMobileNav = () => {
    setMobileNavOpen(!isMobileNavOpen);
  };

  const closeMobileNav = () => {
    setMobileNavOpen(false);
  };

  useEffect(() => {
    fetchMessages(sortBy);
  }, [sortBy]);

  // Fetch user info
  useEffect(() => {
    if (!token) {
      setUser(null);
      setUserLoading(false);
      return;
    }
    const fetchUser = async () => {
      setUserLoading(true);
      try {
        const response = await fetch(
          "https://members-only-production-3673.up.railway.app/api/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUser(data.user);

        const profileResponse = await fetch(
          `https://members-only-production-3673.up.railway.app/api/profile/${data.user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const profileData = await profileResponse.json();
        setProfile(profileData.profile);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // Log Out
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (location.pathname === "/" && messagesLoading) {
    return (
      <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 min-h-screen font-sans text-gray-900 flex items-center justify-center">
        <PuffLoader color="#6D28D9" size={60} />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 min-h-screen font-sans text-gray-900 flex flex-col">
      <header
        ref={headerRef}
        className="bg-white bg-opacity-95 backdrop-blur-md shadow-lg sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <FaGlobe className="w-8 h-8 mr-2 text-purple-600" />
            <span className="text-xl font-semibold text-gray-800 tracking-tight">
              Members Only
            </span>
          </Link>
          <div className="flex items-center">
            <button
              onClick={toggleMobileNav}
              className="md:hidden text-gray-700 hover:text-gray-900 mr-4"
            >
              <FaBars className="w-6 h-6" />
            </button>

            <nav className="hidden md:flex items-center space-x-4">
              {userLoading ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium">
                    Loading user...
                  </span>
                </div>
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium">
                    👋 Hi,{" "}
                    <span className="font-bold text-purple-700">
                      {user.username}
                    </span>
                    !
                  </span>

                  {profile && (
                    <Link
                      to={`/profile/${profile.id}`}
                      className="flex items-center bg-white border border-purple-500 text-purple-600 hover:bg-purple-50 font-semibold py-2 px-3 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      <FaUserPlus className="mr-2" />
                      My Profile
                    </Link>
                  )}

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

            {messagesLoading ? (
              <div className="flex justify-center py-10">
                <PuffLoader color="#6D28D9" size={60} />
              </div>
            ) : (
              messages.map((message) => (
                <Message key={message.id} message={message} user={user} />
              ))
            )}
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
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={closeMobileNav}
        user={user}
        profile={profile}
        handleLogout={handleLogout}
      />
    </div>
  );
}
