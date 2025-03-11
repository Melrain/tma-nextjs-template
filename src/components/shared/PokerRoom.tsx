"use client";
import { initializeSocket } from "@/lib/socketService";
import React, { useState, useEffect } from "react";
import { initData, parseInitData } from "@telegram-apps/sdk-react";
import { useTonAddress } from "@tonconnect/ui-react";

import { SocketCode } from "@/types/SocketCode";
import RoomUI from "./RoomUI";
import axios from "axios";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface IRoomData {
  roomName: string;
  players: [];
  host: string;
  deck: string[];
  communityCards: string[];
  potSize: number;
  bigBlind: number;
  smallBlind: number;
  maxPlayers: number;
  currentTurnPlayer: string;
  gameStatus: string;
  round: number;
}

const PokerRoom = ({ id }: { id: string }) => {
  const [playerList, setPlayerList] = useState<any[]>([]);
  const [roomData, setRoomData] = useState<IRoomData>();
  const [roomMessage, setRoomMessage] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [changeStreamConnected, setChangeStreamConnected] = useState(false);
  const router = useRouter();
  const walletAddress = useTonAddress();

  const _initData = parseInitData(initData.raw());

  const onRefresh = async () => {
    try {
      const roomId = id;
      const response = await axios.get(
        `http://localhost:8080/api/poker-room/room/${roomId}`,
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log("roomId:", id);
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

    function handleRoomDataUpdate(data: any) {
      console.log("room data:", data);
      setRoomData(data);

      const index = data.players.findIndex(
        (player: { tonWalletAddress: string }) =>
          player.tonWalletAddress === walletAddress,
      );
      const currentPlayer = data.players[index];
      const reOrderedPlayers = [
        currentPlayer,
        ...data.players.filter((_: any, i: any) => i !== index).reverse(),
      ];

      setPlayerList(reOrderedPlayers);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(SocketCode.ROOM_DATA_UPDATE + id, handleRoomDataUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(SocketCode.ROOM_DATA_UPDATE + id, handleRoomDataUpdate);
    };
  }, [_initData.user?.firstName, id, walletAddress]);

  if (!roomData) {
    return (
      <div className="flex flex-col items-center justify-center space-y-10">
        <h1>Loading...</h1>
        <button
          onClick={() => {
            router.push(`/poker-rooms/${id}`);
          }}
        >
          刷新页面
        </button>
      </div>
    );
  }

  return (
    <div>
      <RoomUI
        gameStatus={roomData.gameStatus}
        minBuyIn={roomData.bigBlind * 20}
        maxBuyIn={roomData.bigBlind * 100}
        players={playerList}
        communicateCards={[]}
        roomId={id}
        potSize={roomData.potSize}
      />
      <div className="absolute left-1/2 top-0">
        <Button
          onClick={() => {
            onRefresh();
          }}
        >
          get room
        </Button>
      </div>
    </div>
  );
};

export default PokerRoom;
