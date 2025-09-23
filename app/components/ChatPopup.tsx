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

const ChatPopup: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

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

  console.log(participants);

  return (
    <>
      <div
        className="fixed bottom-5 z-50 right-5 bg-[#5A66D1] p-3 rounded-full cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <img src={"/chat.svg"} alt="chat" className="w-8 h-8" />
      </div>

      {/* Popover */}
      {open && (
        <div className="fixed bottom-16 mx-4 sm:right-5 z-50 w-full sm:w-96 h-[400px] bg-white shadow-lg rounded-lg flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-2 text-sm font-medium transition-all duration-300 ease-in-out ${
                chatOpen
                  ? "font-semibold border-b-4 border-[#8F64E1]"
                  : "text-[#4E4A4A]"
              }`}
              onClick={() => setChatOpen(true)}
            >
              Chat
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium transition-all duration-300 ease-in-out ${
                !chatOpen
                  ? "font-semibold border-b-4 border-[#8F64E1]"
                  : "text-[#4E4A4A]"
              }`}
              onClick={() => setChatOpen(false)}
            >
              Participants
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-3 overflow-y-auto">
            {chatOpen ? (
              <Chat
                messages={messages}
                newMessage={newMessage}
                onMessageChange={setNewMessage}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <div className="max-h-[300px] p-2 overflow-y-auto">
                {participants.length === 0 ? (
                  <div className="text-[#4E4A4A] text-sm">
                    No participants connected
                  </div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-[#4E4A4A]">
                        <th className="font-normal pb-2">Name</th>
                        {username === "teacher" && (
                          <th className="font-normal pb-2">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((p, index) => (
                        <tr key={index} className="">
                          <td className="font-semibold py-1">{p}</td>
                          {username === "teacher" && p && p !== "teacher" && (
                            <td className="">
                              <button
                                className="font-semibold text-[#1D68BD] underline"
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

export default ChatPopup;
