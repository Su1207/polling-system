import React, { useState, useEffect, useRef } from "react";
import Chat from "./Chat";
import { connectSocket } from "~/utils/socket";
import { useSelector } from "react-redux";
import type { RootState } from "~/lib/store";

interface Message {
  user: string;
  text: string;
}

const socket = connectSocket();

const ChatPopOver: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const chatWindowRef = useRef<HTMLDivElement>(null);

  const username = useSelector((state: RootState) => state.user.username);

  useEffect(() => {
    socket.emit("joinChat", { username });

    socket.on("chatMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("participantsUpdate", (participantsList: string[]) => {
      setParticipants(participantsList);
    });

    return () => {
      socket.off("chatMessage");
      socket.off("participantsUpdate");
    };
  }, [username]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = { user: username, text: newMessage };
      socket.emit("chatMessage", message);
      setNewMessage("");
    }
  };

  const handleKickOut = (participant: string) => {
    socket.emit("kickOut", participant);
  };

  return (
    <>
      {/* Chat Button */}
      <div
        className="fixed bottom-5 right-5 bg-purple-600 p-3 rounded-full cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <img src={"/chat.svg"} alt="chat" className="w-8 h-8" />
      </div>

      {/* Popover */}
      {open && (
        <div className="fixed bottom-16 right-5 w-96 h-[400px] bg-white shadow-lg rounded-lg flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-2 text-sm font-medium ${
                open ? "text-purple-600 border-b-2 border-purple-600" : ""
              }`}
              onClick={() => setOpen(true)}
            >
              Chat
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium ${
                !open ? "text-purple-600 border-b-2 border-purple-600" : ""
              }`}
              onClick={() => setOpen(false)}
            >
              Participants
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-3 overflow-y-auto">
            {open ? (
              <Chat
                messages={messages}
                newMessage={newMessage}
                onMessageChange={setNewMessage}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <div className="max-h-[300px] overflow-y-auto">
                {participants.length === 0 ? (
                  <div className="text-gray-500 text-sm">
                    No participants connected
                  </div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr>
                        <th>Name</th>
                        {username === "teacher" && <th>Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((p, index) => (
                        <tr key={index} className="border-t">
                          <td>{p}</td>
                          {username === "teacher" && (
                            <td>
                              <button
                                className="text-xs text-purple-600 hover:underline"
                                onClick={() => handleKickOut(p)}
                              >
                                Kick Out
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatPopOver;
