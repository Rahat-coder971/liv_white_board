import { useEffect, useState } from "react";
import socket from "../socket/socket";

export default function Chat({ roomId }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {

    // receive previous messages
    socket.on("chat-history", (data) => {
      setMessages(data);
    });

    // receive live message
    socket.on("chat-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat-history");
      socket.off("chat-message");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("chat-message", {
      roomId,
      message,
      username: "Rahat"
    });

    setMessage("");
  };

  return (
    <div className="bg-gray-800 w-80 h-full flex flex-col rounded-lg">

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className="text-sm">
            <span className="text-blue-400 font-semibold">
              {msg.username || "User"}:
            </span>{" "}
            {msg.message}
          </div>
        ))}
      </div>

      <div className="p-3 flex gap-2 border-t border-gray-700">
        <input
          className="flex-1 bg-gray-700 text-white p-2 rounded outline-none"
          placeholder="Type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 px-4 rounded text-white"
        >
          Send
        </button>
      </div>

    </div>
  );
}
