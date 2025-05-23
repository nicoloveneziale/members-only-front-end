import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Message from "../components/messageComponent";
import { useAuth } from "../context/AuthContext";
import { PuffLoader } from "react-spinners";

export default function Profile() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);

  const { id } = useParams();
  const { token } = useAuth();

  function onDelete(messageId) {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message.id !== messageId),
    );
  }

  useEffect(() => {
    const fetchUser = async () => {
      setUserLoading(true);
      try {
        const res = await fetch(
          "https://members-only-production-3673.up.railway.app/api/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setUserLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://members-only-production-3673.up.railway.app/profile/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();
        const profile = data.profile;
        setBio(profile.bio || "");
        setLocation(profile.location || "");
        setWebsite(profile.website || "");
        setUsername(profile.user?.username || "Unknown User");
        setMessages(profile.user?.messages || []);
        setAvatar(profile.avatar);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, token]);

  if (loading || userLoading) {
    return (
      <div className="bg-gray-100 min-h-screen py-10 px-4 flex items-center justify-center">
        <PuffLoader color="#6D28D9" size={60} />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-purple-300 shadow">
            {avatar ? (
              <img
                src={avatar}
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
