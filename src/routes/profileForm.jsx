import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch("http://localhost:8080/profile/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setBio(data.profile.bio || "");
      setLocation(data.profile.location || "");
      setWebsite(data.profile.website || "");
      setAvatarFile(data.profile.avatar);
      if (data.profile.avatar) {
        setAvatarPreview(`http://localhost:8080/${data.profile.avatar}`);
      }
    };
    fetchProfile();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleClear = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("location", location);
    formData.append("website", website);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      const response = await fetch("http://localhost:8080/profile/edit", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log(response);
        navigate(`/profile/${data.profile.id}`);
      } else {
        alert(data?.message || "Profile creation failed.");
      }
    } catch (error) {
      alert("An unexpected error occurred.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 min-h-screen px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Your Profile
        </h1>

        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-300 shadow">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                No Avatar
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="mt-3 block text-sm text-gray-600"
          />
          {avatarFile && (
            <button
              onClick={handleClear}
              type="button"
              className="mt-2 text-sm text-red-500 hover:underline"
            >
              Clear Avatar
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bio <span className="text-gray-400 text-sm">(optional)</span>
            </label>
            <textarea
              rows="3"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-400"
              placeholder="Tell us about yourself"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location <span className="text-gray-400 text-sm">(optional)</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400"
              placeholder="e.g. London, UK"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Website <span className="text-gray-400 text-sm">(optional)</span>
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400"
              placeholder="https://yourwebsite.com"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md transition duration-300"
          >
            Create Profile
          </button>
        </form>
      </div>
    </div>
  );
}
