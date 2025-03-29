"use client";
import React, { createContext, useContext, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) throw new Error("SocketContext未被初始化");
  return socket;
};

export const SocketProvider = ({
  url,
  userId,
  username,
  initDataRaw,
  tonWalletAddress,
  children,
}: {
  url: string;
  userId: string;
  initDataRaw: string;
  username: string;
  tonWalletAddress: string;

  children: React.ReactNode;
}) => {
  const socketRef = useRef<Socket | null>(null);

  if (!socketRef.current) {
    socketRef.current = io(url, {
      auth: {
        userId,
        username,
        initDataRaw,
        tonWalletAddress,
      },
    });
  }

  useEffect(() => {
    const socket = socketRef.current;
    if (socket) {
      socket.connect();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [url]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};
