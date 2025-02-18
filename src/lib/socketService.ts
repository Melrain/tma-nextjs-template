"use client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
// socketService.js
import { io, Socket } from "socket.io-client";

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export const initializeSocket = ({
  tonwallet,
  username,
  roomid,
  url,
}: {
  tonwallet: string;
  username: string;
  roomid: string;
  url: string;
}) => {
  if (!socket) {
    socket = io(url, {
      extraHeaders: {
        tonwallet,
        username,
        roomid,
      },
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error(
      "Socket not initialized. Please call initializeSocket first."
    );
  }
  return socket;
};
