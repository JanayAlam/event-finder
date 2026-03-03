import http from "node:http";
import { Server, Socket } from "socket.io";
import { PUBLIC_SERVER_URL } from "./settings/config";

let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: PUBLIC_SERVER_URL,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true
    }
  });

  io.on("connection", (socket: Socket) => {
    socket.on("join-event", (eventId: string) => {
      socket.join(`event-${eventId}`);
    });

    socket.on("leave-event", (eventId: string) => {
      socket.leave(`event-${eventId}`);
    });

    socket.on("join-user", (userId: string) => {
      socket.join(`user-${userId}`);
    });

    socket.on("leave-user", (userId: string) => {
      socket.leave(`user-${userId}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
