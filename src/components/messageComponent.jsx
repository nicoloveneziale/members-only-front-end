import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMessages } from "../context/MessageContext";
import { timeAgo } from "../utils/timeAgo";
import { FaHeart, FaRegHeart, FaTrash } from "react-icons/fa";

export default function Message({ message, user, onDelete = null }) {
  const { token } = useAuth();
  const { deleteMessage } = useMessages();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(message._count?.likedBy || 0);
  const isOwner = user?.id === message.users.id;
  const canSeeDetails = user?.membership_status;

  function handleDelete() {
    if (onDelete) onDelete(message.id);
    deleteMessage(message.id, user);
  }

  useEffect(() => {
    if (!token) return;

    fetch(`http://localhost:8080/messages/${message.id}/like`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLiked(data.liked);
      });
  }, [message.id, token]);

  const handleLike = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://members-only-production-3673.up.railway.app/messages/${message.id}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        setLiked(!liked);
        setLikeCount((prev) => prev + (liked ? -1 : 1));
      } else {
        alert("Unable to like");
      }
    } catch (error) {
      alert("An error occurred");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 max-w-2xl mx-auto">
      <div className="flex items-center mb-4">
        <div className="flex items-center mb-4">
          {canSeeDetails || isOwner ? (
            <>
              <img
                src={`${message.users.profile?.avatar || "default-avatar.png"}`}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-purple-400"
              />
              <div className="ml-3">
                <div className="flex items-center space-x-2">
                  <a
                    href={`/profile/${message.users.profile.id}`}
                    className="text-sm font-semibold text-indigo-700 hover:underline"
                  >
                    {message.users.username}
                  </a>
                  {message.users.membership_status && (
                    <span className="text-xs text-green-600 font-semibold">
                      (Member)
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {timeAgo(message.date)}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse blur-sm" />
              <div className="ml-3">
                <div className="text-sm font-semibold text-gray-400 blur-sm">
                  Hidden Member
                </div>
                <div className="text-xs text-gray-400 blur-sm">
                  Become a member to view details
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{message.title}</h3>
        <p className="text-gray-700 mt-1">{message.text}</p>
        {message.image && (
          <div className="mt-4">
            <img
              src={message.image}
              alt="message"
              className="w-full max-h-[500px] rounded-lg border object-cover"
            />
          </div>
        )}
      </div>

      {user && (
        <div className="flex justify-between items-center mt-4 border-t pt-3">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors duration-200 ${
              liked ? "font-semibold" : ""
            }`}
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
            <span>{liked ? "Unlike" : "Like"}</span>
            <span className="text-gray-600">({likeCount})</span>
          </button>

          {isOwner && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors duration-200"
            >
              <FaTrash />
              <span>Delete</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
