"use client";
import { initializeSocket } from "@/lib/socketService";
import React, { useState, useEffect } from "react";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { useTonAddress } from "@tonconnect/ui-react";
import { Button } from "../ui/button";
import { SocketCode } from "@/types/SocketCode";

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
  const [isConnected, setIsConnected] = useState(false);
  const walletAddress = useTonAddress();
  const { initData } = retrieveLaunchParams();

  useEffect(() => {
    // const userFriendlyAddress = toUserFriendlyAddress(wallet.account.address);

    // 初始化 socket，只会被调用一次
    const socket = initializeSocket({
      url: "http://localhost:8080/",
      tonwallet: walletAddress,
      username: initData?.user?.username || "",
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
    socket.on(SocketCode.GET_ROOM + id, (data: any) => {
      console.log(data);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(SocketCode.GET_ROOM + id);
    };
  }, [id, initData?.user?.username, walletAddress]); // 确保依赖地址和 launch 参数更新时重新绑定

  return <div>room</div>;
};

export default PokerRoom;
