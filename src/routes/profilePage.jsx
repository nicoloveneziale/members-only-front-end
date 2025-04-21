import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Message from "../components/messageComponent";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [messages, setMessages] = useState([]);

  const { id } = useParams();
  const { token } = useAuth();

  function onDelete(messageId) {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message.id !== messageId),
    );
  }

  useEffect(() => {
    console.log(token);
    const fetchUser = async () => {
      await fetch("http://localhost:8080/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUser(data.user));
    };
    fetchUser();
  }, [token]);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch(`http://localhost:8080/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      const profile = data.profile;
      setBio(profile.bio || "");
      setLocation(profile.location || "");
      setWebsite(profile.website || "");
      setUsername(profile.user?.username || "Unknown User");
      console.log(profile.user.messages);
      setMessages(profile.user?.messages || []);
      setAvatar(profile.avatar);
      if (profile.avatar) {
        setAvatarPreview(`http://localhost:8080/${profile.avatar}`);
      }
    };
    fetchProfile();
  }, [id, token]);

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-purple-300 shadow">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                No Avatar
              </div>
            )}
          </div>
          <h1 className="text-xl font-semibold mt-4">{username}'s Profile</h1>
        </div>
        {user && username === user.username && (
          <a
            href={`/profile/edit`}
            className="text-purple-600 font-medium underline hover:text-purple-800"
          >
            Edit Profile
          </a>
        )}
        <div className="space-y-4">
          {bio && (
            <div>
              <h2 className="text-sm text-gray-600 font-medium">Bio</h2>
              <p className="text-gray-800">{bio}</p>
            </div>
          )}

          {location && (
            <div>
              <h2 className="text-sm text-gray-600 font-medium">Location</h2>
              <p className="text-gray-800">{location}</p>
            </div>
          )}

          {website && (
            <div>
              <h2 className="text-sm text-gray-600 font-medium">Website</h2>
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 underline"
              >
                {website}
              </a>
            </div>
          )}

          <div>
            <h2 className="text-md font-semibold text-gray-700 mt-6 mb-2">
              Messages
            </h2>
            {messages.length > 0 ? (
              <ul className="space-y-2">
                {messages.map((message) => (
                  <Message
                    key={message.id}
                    message={message}
                    user={user}
                    onDelete={onDelete}
                  />
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No messages posted yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
