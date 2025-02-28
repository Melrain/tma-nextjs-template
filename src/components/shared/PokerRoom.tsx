"use client";
import { initializeSocket } from "@/lib/socketService";
import React, { useState, useEffect } from "react";
import { initData, parseInitData } from "@telegram-apps/sdk-react";
import { useTonAddress } from "@tonconnect/ui-react";

import { SocketCode } from "@/types/SocketCode";
import RoomUI from "./RoomUI";

interface IPlayer {
  playerId: string;
  playerName: string;
  tonWalletAddress: string;
  avatar: string;
  chipsInGame: number;
  currentBet: number;
  hand: string[];
  action: string;
}
interface IRoomData {
  roomName: string;
  players: IPlayer[];
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
  const [playerList, setPlayerList] = useState<IPlayer[]>([]);
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
      socket.emit("join-room", id);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(SocketCode.GET_ROOM + id, (data) => {
      console.log(data);
    });

    socket.on(SocketCode.ROOM_MESSAGE + id, (data) => {
      console.log(data);
      setRoomMessage(data.message);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(SocketCode.GET_ROOM + id);
      socket.off(SocketCode.ROOM_MESSAGE + id);
    };
  }, [_initData.user?.firstName, id, walletAddress]); // 确保依赖地址和 launch 参数更新时重新绑定

  const players = [
    { id: 1, name: "Alice", chips: 1000, seatNumber: 1 },
    { id: 2, name: "Bob", chips: 800, seatNumber: 2 },
    { id: 3, name: "Charlie", chips: 1200, seatNumber: 3 },
    { id: 4, name: "Diana", chips: 500, seatNumber: 4 },
    { id: 5, name: "Eve", chips: 700, seatNumber: 5 },
    { id: 6, name: "Frank", chips: 600, seatNumber: 6 },
  ];

  return (
    <div>
      <RoomUI
        players={players}
        communicateCards={["SA", "SA", "SA", "SA", "SA"]}
      />
    </div>
  );
};

export default PokerRoom;
