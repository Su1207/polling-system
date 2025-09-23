import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "~/lib/store";

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
  const username = useSelector((state: RootState) => state.user.username);

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
            <div key={index} className={`mb-2 w-full font-normal`}>
              <div
                className={`font-semibold mb-1 text-xs text-[#4F0BD3] ${
                  msg.user === username ? "text-right" : "text-left"
                }`}
              >
                {msg.user === username ? "You" : msg.user}
              </div>
              <p
                className={`text-sm max-w-[80%] font-normal w-fit break-words rounded-b-lg text-white p-2 pr-4 ${
                  msg.user === username
                    ? "bg-[#8F64E1] ml-auto rounded-tl-lg"
                    : "bg-[#3A3A3B] mr-auto rounded-tr-lg"
                }`}
              >
                {msg.text}
              </p>
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
          className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm outline-none"
        />
        <button
          onClick={onSendMessage}
          className="bg-black text-white px-4 py-1 rounded text-sm hover:bg-purple-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
