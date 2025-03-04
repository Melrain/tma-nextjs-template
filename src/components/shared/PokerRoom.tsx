"use client";
import { initializeSocket } from "@/lib/socketService";
import React, { useState, useEffect } from "react";
import { initData, parseInitData } from "@telegram-apps/sdk-react";
import { useTonAddress } from "@tonconnect/ui-react";

import { SocketCode } from "@/types/SocketCode";
import RoomUI from "./RoomUI";
import { players } from "@/lib/FakeData";

interface IRoomData {
  roomName: string;
  players: [];
  host: string;
  deck: string[];
  communityCards: string[];
  pot: number;
  bigBlind: number;
  smallBlind: number;
  maxPlayers: number;
  currentTurnPlayer: string;
  gameStatus: string;
  round: number;
}

const PokerRoom = ({ id }: { id: string }) => {
  const [playerList, setPlayerList] = useState<[]>([]);
  const [roomData, setRoomData] = useState<IRoomData>();
  const [roomMessage, setRoomMessage] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const walletAddress = useTonAddress();

  const _initData = parseInitData(initData.raw());

  useEffect(() => {
    // const userFriendlyAddress = toUserFriendlyAddress(wallet.account.address);

    // 初始化 socket，只会被调用一次
    const socket = initializeSocket({
      url: "http://localhost:8080/",
      tonwallet: walletAddress,
      username: _initData.user?.firstName || "user",
      roomid: id,
    });

    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      socket.emit(SocketCode.JOIN_ROOM, id);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on(SocketCode.ROOM_MESSAGE + id, (data) => {
      console.log(data);
      setRoomMessage(data.message);
    });

    //监控房间渲染数据
    socket.on(SocketCode.ROOM_DATA + id, (data) => {
      console.log("room data:", data[0].data);
      setRoomData(data[0].data);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(SocketCode.ROOM_MESSAGE + id);
      socket.off(SocketCode.ROOM_DATA + id);
    };
  }, [_initData.user?.firstName, id, walletAddress]); // 确保依赖地址和 launch 参数更新时重新绑定

  if (!roomData) {
    return <div>Loading Room...</div>;
  }

  return (
    <div>
      <RoomUI
        minBuyIn={roomData.bigBlind * 20}
        maxBuyIn={roomData.bigBlind * 100}
        players={[]}
        communicateCards={[]}
        roomId={id}
      />
    </div>
  );
};

export default PokerRoom;
