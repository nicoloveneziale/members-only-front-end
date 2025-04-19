import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const MessageContext = createContext();

export function MessageProvider({ children }) {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = async (sortBy = "new") => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/messages/${sortBy}`);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id, user) => {
    try {
      const response = await fetch(`http://localhost:8080/messages/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          user: user,
        },
      });

      if (response.ok) {
        setMessages(messages.filter((message) => message.id !== id));
      } else {
        console.log(response);
        alert("Unable to delete");
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred");
    }
  };

  const addMessage = (newMessage) => {
    setMessages((prevMessages) => [newMessage, ...prevMessages]);
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        setMessages,
        fetchMessages,
        deleteMessage,
        addMessage,
        loading,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}

export const useMessages = () => useContext(MessageContext);
