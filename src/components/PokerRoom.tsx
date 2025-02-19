"use client";
import { initializeSocket } from "@/lib/socketService";
import React, { useEffect } from "react";

const PokerRoom = ({ id }: { id: string }) => {
  useEffect(() => {
    // const userFriendlyAddress = toUserFriendlyAddress(wallet.account.address);

    // 初始化 socket，只会被调用一次
    const socket = initializeSocket({
      url: "http://localhost:8080/",
      tonwallet: "",
      username: "",
      roomid: "",
    });

    if (socket.connected) {
      onConnect();
    }

    function onConnect() {}

    function onDisconnect() {}

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []); // 确保依赖地址和 launch 参数更新时重新绑定

  return <div>PokerRoom</div>;
};

export default PokerRoom;
