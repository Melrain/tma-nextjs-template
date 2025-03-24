"use client";
import { getSocket, initializeSocket } from "@/lib/socketService";
import React, { useState, useEffect, act } from "react";
import { initData, parseInitData } from "@telegram-apps/sdk-react";
import { useTonAddress } from "@tonconnect/ui-react";

import { SocketCode } from "@/types/SocketCode";
import RoomUI from "./RoomUI";
import axios from "axios";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { CardType } from "@/types/CardType";

interface IRoomData {
  roomName: string;
  players: { tonWalletAddress: string; holeCards: CardType[] }[];
  host: string;
  communityCards: string[];
  potSize: number;
  bigBlind: number;
  smallBlind: number;
  maxPlayers: number;
  currentTurnPlayer: string;
  gameStatus: string;
  rounds: number;
  currentMinBet: number;
}

const PokerRoom = ({ id }: { id: string }) => {
  const [playerList, setPlayerList] = useState<any[]>([]);
  const [roomData, setRoomData] = useState<IRoomData>();
  const [canAction, setCanAction] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [avaliableActions, setAvaliableActions] = useState<string[]>([]);

  const walletAddress = useTonAddress();

  const _initData = parseInitData(initData.raw());

  const onSit = async (tonAddress: string, roomId: string, chips: number) => {
    try {
      console.log("sitting");
      const response = await axios.post(
        "http://localhost:8080/api/poker-room/sit",
        {
          tonAddress,
          roomId,
          chips,
          initDataRaw: initData.raw() || "",
        },
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const onLeaveRoom = async (tonAddress: string, roomId: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/poker-room/leave",
        {
          tonAddress,
          roomId,
        },
      );
      console.log("leave room response:", response);
    } catch (error) {
      console.error(error);
    }
  };

  const onActionClick = (action: string, amount?: number) => {
    try {
      console.log("on action click:", action, walletAddress);
      const socket = getSocket();
      socket.emit(SocketCode.ON_ACTION, {
        roomId: id,
        action,
        tonWalletAddress: walletAddress,
        amount: amount,
      });
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
      initDataRaw: initData.raw()!,
    });

    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      socket.emit(SocketCode.JOIN_ROOM, {
        roomId: id,
        tonWalletAddress: walletAddress,
        initDataRaw: initData.raw() || "",
      });
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function handleRoomDataUpdate(response: any) {
      const data = response.room;
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

    function handleCanAction(response: {
      canAction: boolean;
      actions: string[];
    }) {
      console.log("can action res:", response);
      setAvaliableActions(response.actions);
      setCanAction(response.canAction);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(
      SocketCode.ROOM_DATA_UPDATE + id + walletAddress,
      handleRoomDataUpdate,
    );

    socket.on(SocketCode.CAN_ACTION + id + walletAddress, handleCanAction);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(
        SocketCode.ROOM_DATA_UPDATE + id + walletAddress,
        handleRoomDataUpdate,
      );

      socket.off(SocketCode.CAN_ACTION + id + walletAddress, handleCanAction);
    };
  }, [_initData.user?.firstName, id, walletAddress]);

  if (!isConnected) {
    return <div>disconnected from server...</div>;
  }

  if (!roomData) {
    return (
      <div className="flex flex-col items-center justify-center space-y-10">
        <h1>Loading...</h1>
        <button
          onClick={() => {
            window.location.reload();
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
        avaliableActions={avaliableActions}
        currentMinBet={roomData.currentMinBet}
        onActionClick={onActionClick}
        canAction={canAction}
        gameStatus={roomData.gameStatus}
        minBuyIn={roomData.bigBlind * 20}
        maxBuyIn={roomData.bigBlind * 100}
        players={playerList}
        communicateCards={[]}
        roomId={id}
        potSize={roomData.potSize}
        initDataRaw={initData.raw() || ""}
        onSitFn={onSit}
        onLeaveFn={onLeaveRoom}
        onCheckMyHandsFn={() => {}}
        myHoleCards={
          roomData.players.find(
            (player: { tonWalletAddress: string; holeCards: CardType[] }) =>
              player.tonWalletAddress === walletAddress,
          )?.holeCards || []
        }
      />
      <button
        onClick={() => {
          window.location.reload();
        }}
        className="absolute left-1/2 top-0"
      >
        刷新房间
      </button>
    </div>
  );
};

export default PokerRoom;
