import { io, Socket } from "socket.io-client";

let socket: Socket;

const BACKEND_URL = "http://localhost:3000";

export const connectSocket = () => {
  if (!socket) {
    socket = io(BACKEND_URL, {
      transports: ["websocket", "polling"],
    });
  }
  return socket;
};

export const getSocket = () => socket;
