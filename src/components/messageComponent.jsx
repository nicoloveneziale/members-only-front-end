import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { timeAgo } from "../utils/timeAgo";
import { FaHeart, FaRegHeart, FaTrash } from "react-icons/fa";

export default function Message({ message, user }) {
  const { token } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(message._count?.likedBy || 0);

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
        `http://localhost:8080/messages/${message.id}/like`,
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

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/messages/${message.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            user: user,
          },
        },
      );

      if (response.ok) {
        console.log("deleted");
      } else {
        console.log(response);
        alert("Unable to delete");
      }
    } catch (error) {
      alert("An error occurred");
    }
  };

  return (
    <div
      key={message.id}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
          {message.title}
        </h3>
        <p className="mt-2 text-gray-700 line-clamp-3">{message.text}</p>
        {message.image && (
          <div className="mt-4">
            <img
              src={`http://localhost:8080/${message.image}`}
              alt="Message"
              className="max-w-full h-auto rounded-md shadow-md"
            />
          </div>
        )}
        {user?.membership_status && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <span>{timeAgo(message.date)}</span>
              <span className="ml-2">
                Posted by{" "}
                <span className="font-medium text-indigo-600">
                  {message.users.username}
                </span>
                <span className="text-green-500 font-semibold ml-1">
                  (Member)
                </span>
              </span>
            </div>
          </div>
        )}

        {user && (
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={handleLike}
              className={`flex items-center text-red-500 hover:text-red-600 focus:outline-none transition-colors duration-200 ${
                liked ? "font-semibold" : ""
              }`}
            >
              {liked ? (
                <FaHeart className="mr-2" />
              ) : (
                <FaRegHeart className="mr-2" />
              )}
              <span>{liked ? "Unlike" : "Like"}</span>
              <span className="ml-1 text-gray-600">({likeCount})</span>
            </button>

            {user.id === message.author_id && (
              <button
                onClick={handleDelete}
                className="flex items-center text-red-600 hover:text-red-700 focus:outline-none transition-colors duration-200"
              >
                <FaTrash className="mr-2" />
                <span>Delete</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
