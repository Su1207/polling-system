import { io, Socket } from "socket.io-client";

let socket: Socket;

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const connectSocket = () => {
  if (!socket) {
    socket = io(BACKEND_URL);
  }
  return socket;
};

export const getSocket = () => socket;
