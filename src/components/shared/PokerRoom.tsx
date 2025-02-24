"use client";
import { initializeSocket } from "@/lib/socketService";
import React, { useState, useEffect } from "react";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { useTonAddress } from "@tonconnect/ui-react";
import { Button } from "../ui/button";

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
    socket.on(`poker-room-${id}`, (data: IRoomData) => {
      console.log(data);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(`poker-room-${id}`);
    };
  }, [id, initData?.user?.username, walletAddress]); // 确保依赖地址和 launch 参数更新时重新绑定

  if (!roomData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{isConnected ? "connected" : "disconnected"}</h1>
      <div className="flex relative justify-center min-h-screen items-center bg-mycolor-100 text-white">
        {/* player card */}
        <div className="flex absolute z-50 flex-col justify-center items-center top-0 left-0 p-4 space-y-2"></div>
        <div className="border-[15px] shadow-lg shadow-slate-200 max-lg:border-[20px] border-black bg-mycolor-700 justify-between flex relative flex-col lg:rounded-full max-lg:h-screen max-lg:w-full lg:w-full lg:max-w-[1200px] lg:h-screen lg:max-h-[600px]">
          <div className="flex flex-col justify-center items-center">
            <p>4</p>
            {playerList[3] && <div>Player4</div>}
          </div>
          <div className="flex flex-row justify-between px-10">
            <div className="flex flex-col justify-center items-center">
              <p>3</p>
              {playerList[2] && <div>Player3</div>}
            </div>
            <div className="flex flex-col justify-center items-center">
              <p>5</p>
              {playerList[4] && <div>Player5</div>}
            </div>
          </div>
          <div className="flex flex-row justify-between px-10">
            <div className="flex flex-col justify-center items-center">
              <p>2</p>
              {playerList[1] && <div>player2</div>}
            </div>
            <div className="flex flex-col justify-center items-center">
              <p>6</p>
              {playerList[5] && <div>player 6</div>}
            </div>
          </div>

          {/* <div className="flex justify-center items-center flex-col">
            <p>1</p>
            {roomData?.players.some(
              (player) => player.tonWalletAddress === walletAddress
            ) && <Button onClick={() => {}}>Sit Down</Button>}
            {playerList[0] &&
              playerList[0].tonWalletAddress === walletAddress && (
                <div className="flex flex-col">
                  <div>Player 1</div>
                </div>
              )}
          </div> */}
          {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-row gap-2 items-center justify-center">
              {roomData?.communityCards.map((card) => (
                <div key={card}>cards</div>
              ))}
            </div>
          </div> */}
          <h1 className="absolute text-3xl opacity-20 top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            在线德州扑克 :{" "}
            {roomData?.gameStatus !== "waiting"
              ? `${roomData.gameStatus}`
              : "等待中"}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default PokerRoom;
