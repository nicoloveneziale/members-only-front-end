import React from "react";
import {
  FaUsers,
  FaSignOutAlt,
  FaPlusCircle,
  FaSignInAlt,
  FaUserPlus,
  FaGlobe,
  FaBars,
  FaTimes,
  FaUser,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

export default function MobileNav({
  isOpen,
  onClose,
  user,
  profile,
  handleLogout,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 flex"
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="bg-white w-64 p-6 space-y-6 relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
              aria-label="Close Menu"
            >
              <FaTimes className="w-6 h-6" />
            </button>
            <div className="flex items-center">
              <FaGlobe className="w-8 h-8 mr-2 text-purple-600" />
              <span className="text-xl font-semibold text-gray-800 tracking-tight">
                Members Only
              </span>
            </div>
            <nav className="flex flex-col space-y-4">
              {user ? (
                <>
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
                      onClick={onClose}
                      className="flex items-center text-gray-700 hover:bg-gray-100 py-2 px-3 rounded-md transition duration-300 ease-in-out"
                    >
                      <FaUser className="mr-2 w-5 h-5" />
                      My Profile
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      onClose();
                    }}
                    className="flex items-center text-gray-700 hover:bg-gray-100 py-2 px-3 rounded-md transition duration-300 ease-in-out"
                  >
                    <FaSignOutAlt className="mr-2 w-5 h-5" />
                    Log Out
                  </button>
                  {!user.membership_status && (
                    <Link
                      to="/join"
                      onClick={onClose}
                      className="flex items-center text-gray-700 hover:bg-gray-100 py-2 px-3 rounded-md transition duration-300 ease-in-out"
                    >
                      <FaUsers className="mr-2 w-5 h-5" />
                      Join
                    </Link>
                  )}
                  <Link
                    to="/messages/create"
                    onClick={onClose}
                    className="flex items-center text-gray-700 hover:bg-gray-100 py-2 px-3 rounded-md transition duration-300 ease-in-out"
                  >
                    <FaPlusCircle className="mr-2 w-5 h-5" />
                    New Post
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="flex items-center text-gray-700 hover:bg-gray-100 py-2 px-3 rounded-md transition duration-300 ease-in-out"
                  >
                    <FaSignInAlt className="mr-2 w-5 h-5" />
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={onClose}
                    className="flex items-center text-gray-700 hover:bg-gray-100 py-2 px-3 rounded-md transition duration-300 ease-in-out"
                  >
                    <FaUserPlus className="mr-2 w-5 h-5" />
                    Register
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
