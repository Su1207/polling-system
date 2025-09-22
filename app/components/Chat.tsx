import React, { useEffect } from "react";

interface Message {
  user: string;
  text: string;
}

interface ChatProps {
  messages: Message[];
  newMessage: string;
  onMessageChange: (val: string) => void;
  onSendMessage: () => void;
}

const Chat: React.FC<ChatProps> = ({
  messages,
  newMessage,
  onMessageChange,
  onSendMessage,
}) => {
  const username = sessionStorage.getItem("username") || "";

  useEffect(() => {
    const chatWindow = document.getElementById("chat-window");
    if (chatWindow) {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div
        id="chat-window"
        className="flex-1 overflow-y-auto p-3 rounded bg-gray-100"
      >
        {messages.length === 0 ? (
          <div className="text-gray-500 text-sm">No messages yet</div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 max-w-[80%] text-sm break-words rounded ${
                msg.user === username
                  ? "bg-purple-500 text-white ml-auto"
                  : "bg-gray-700 text-white mr-auto"
              }`}
            >
              <span className="font-semibold mr-1">
                {msg.user === username ? "You" : msg.user}:
              </span>
              <span>{msg.text}</span>
            </div>
          ))
        )}
      </div>

      <div className="mt-2 flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Type a message"
          className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          onClick={onSendMessage}
          className="bg-purple-600 text-white px-4 py-1 rounded text-sm hover:bg-purple-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
