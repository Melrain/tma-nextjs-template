/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useSocket } from "@/components/Game/SocketContext";
import { Button } from "@/components/ui/button";
import { CODE, GamePhase } from "@/types/GameTypes";
import { initData, parseInitData } from "@telegram-apps/sdk-react";
import { useTonAddress } from "@tonconnect/ui-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface IPlayer {}
interface IPokerRoom {
  _id: string;
  roomName: string;
  players: IPlayer[];
}

const page = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [games, setGames] = useState([]);
  const [user, setUser] = useState(null);
  const socket = useSocket();
  const userData = parseInitData(initData.raw());
  const tonWalletAddress = useTonAddress();
  const [buyInAmount, setBuyInAmount] = useState(100);

  const router = useRouter();
  //创建游戏
  const onCreateGame = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/game/create",
        {
          createGameDto: {
            gameName: `${userData.user?.firstName}的游戏`,
            gamePhase: GamePhase.Waiting,
            players: [],
            maxPlayers: 6,
            waitingList: [],
            bigBlind: 1,
            pot: 0,
            dealerId: "",
            currentPlayerId: "",
            communityCards: {
              flop: [],
              turn: null,
              river: null,
            },
            actions: [],
          },
        },
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  //加入游戏
  const joinGame = async (gameId: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/game/join-game",
        {
          gameId: gameId,
          username: userData.user?.firstName,
          playerId: userData.user?.id,
          buyInAmount: 100,
        },
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.on("connect", async () => {
      setIsConnected(true);
      //获取用户信息
      const userResponse = await axios.post(
        "http://localhost:8080/api/user/login",
        {
          userId: userData.user?.id,
          username: userData.user?.firstName,
          walletAddress: tonWalletAddress,
          avatar: userData.user?.photoUrl,
        },
      );
      if (userResponse.data) {
        console.log(userResponse.data);
        setUser(userResponse.data);
      }

      // 获取房间列表
      const gamesResponse = await axios.get(
        "http://localhost:8080/api/game/all",
      );
      if (gamesResponse.data) {
        console.log("games:", gamesResponse.data);
        setGames(gamesResponse.data.data);
      }
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
      setIsConnected(false);
    });

    socket.on(CODE.GAMES_UPDATED, (data) => {
      setGames(data);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off(CODE.GAMES_UPDATED);
    };
  }, [
    socket,
    tonWalletAddress,
    userData.user?.firstName,
    userData.user?.id,
    userData.user?.photoUrl,
  ]);

  useEffect(() => {
    if (socket.connected) {
      setIsConnected(true);
      const refetch = async () => {
        //获取用户信息
        const userResponse = await axios.post(
          "http://localhost:8080/api/user/login",
          {
            userId: userData.user?.id,
            username: userData.user?.firstName,
            walletAddress: tonWalletAddress,
            avatar: userData.user?.photoUrl,
          },
        );
        if (userResponse.data) {
          console.log(userResponse.data);
          setUser(userResponse.data);
        }

        // 获取房间列表
        const gamesResponse = await axios.get(
          "http://localhost:8080/api/game/all",
        );
        if (gamesResponse.data) {
          console.log("games:", gamesResponse.data);
          setGames(gamesResponse.data.data);
        }
      };
      refetch();
    }
  }, [
    socket.connected,
    tonWalletAddress,
    userData.user?.firstName,
    userData.user?.id,
    userData.user?.photoUrl,
  ]);

  if (!isConnected) {
    return <div>Connecting...</div>;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-6">
      <Button
        onClick={() => {
          onCreateGame();
        }}
        className="absolute right-2 top-2 bg-white text-black"
      >
        创建一个游戏
      </Button>
      <div>
        <h1>游戏房间: {games.length}</h1>
        <div className="flex flex-col space-y-2">
          {games.map((game: any) => (
            <div key={game.gameName} className="flex flex-row space-x-2">
              <span>{game.gameName}</span>
              <span>
                {game.players.length}/{game.maxPlayers}
              </span>
              {game.players.find(
                (player: { playerId: number }) =>
                  player.playerId === userData.user?.id,
              ) ? (
                <button
                  onClick={() => {
                    router.push(`/game/${game._id}`);
                  }}
                >
                  Rejoin
                </button>
              ) : (
                <button
                  onClick={() => {
                    joinGame(game._id);
                  }}
                >
                  join
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
