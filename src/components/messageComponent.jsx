import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { timeAgo } from "../utils/timeAgo";

export default function Message({ message, user }) {
  const { token } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(message._count?.likedBy || 0);

  useEffect(() => {
    if (!token) return;

    fetch(`http://localhost:8080/messages/${message.id}/liked`, {
      Authorization: `Bearer: ${token}`,
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

  return (
    <div key={message.id} className="bg-white p-6 rounded-lg shadow-md">
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
        <form onSubmit={handleLike}>
          <button type="submit" className="text-red-500 hover:underline">
            {liked ? "💔 Unlike" : "❤️ Like"} ({likeCount})
          </button>
        </form>
      )}
    </div>
  );
}
