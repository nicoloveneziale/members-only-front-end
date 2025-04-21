import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMessages } from "../context/MessageContext";
import { useNavigate } from "react-router-dom";

export default function MessageForm() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const { addMessage } = useMessages();
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("text", text);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("http://localhost:8080/messages/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.ok) {
        const newMessage = (await response.json()).data;

        console.log(newMessage);

        const profile = await fetch(
          `http://localhost:8080/api/profile/${newMessage.users.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log(profile);

        newMessage.users.profile = (await profile.json()).profile;

        console.log(newMessage);

        addMessage(newMessage);
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating message:", error);
      alert("Failed to create message. Please try again.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Create a New Post
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Enter your post title"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="text"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Message Text
              </label>
              <textarea
                id="text"
                name="text"
                rows="4"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Write your message here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="image"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Add Image
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:shadow-outline w-full transition duration-300 ease-in-out"
            >
              Post Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
