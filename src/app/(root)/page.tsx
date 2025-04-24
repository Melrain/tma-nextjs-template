/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useSocket } from "@/components/Game/SocketContext";
import { Button } from "@/components/ui/button";
import { CODE, GamePhase } from "@/types/GameTypes";
import { initData, parseInitData } from "@telegram-apps/sdk-react";
import { Input } from "@telegram-apps/telegram-ui";
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

function useUniqueGames(games: any[]) {
  return Array.from(new Map(games.map((g) => [g.gameId, g])).values());
}

const page = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [games, setGames] = useState([]);
  const [user, setUser] = useState<{
    username: string;
    balance: number;
  } | null>(null);
  const socket = useSocket();
  const userData = parseInitData(initData.raw());
  const tonWalletAddress = useTonAddress();
  const [buyInAmount, setBuyInAmount] = useState(100);

  const router = useRouter();

  const onCreateGame = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/game/create",
        {
          userId: userData.user?.id,
          createGameDto: {
            gameId: userData.user?.id,
            gameName: `${userData.user?.firstName}的游戏`,
            gamePhase: GamePhase.Waiting,
            players: [],
            maxPlayers: 6,
            waitingList: [],
            bigBlind: 1,
            mainPot: {
              amount: 0,
              eligiblePlayerIds: [],
            },
            lastRoundActions: [],
            autoProceed: false,
            sidePots: [],
            currentMinBet: 0,
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

  const joinGame = async (gameId: string, buyInAmount: number) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/game/join-game",
        {
          gameId: gameId,
          username: userData.user?.firstName,
          playerId: userData.user?.id,
          buyInAmount: buyInAmount,
          avatar: userData.user?.photoUrl,
        },
      );
      if (response) {
        router.push(`/game/${gameId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const createUserResponse = await axios.post(
          "http://localhost:8080/api/user/login",
          {
            userId: userData.user?.id,
            username: userData.user?.firstName,
            walletAddress: tonWalletAddress,
            avatar: userData.user?.photoUrl,
          },
        );
        if (createUserResponse.data) {
          setUser(createUserResponse.data);
        }

        const gamesResponse = await axios.get(
          "http://localhost:8080/api/game/all",
        );
        if (gamesResponse.data) {
          setGames(gamesResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    setIsConnected(socket.connected);

    socket.on("connect", async () => {});

    socket.on("disconnect", () => {
      console.log("disconnected");
    });

    socket.on(CODE.REDIS_TOUCH, async () => {
      const gamesResponse = await axios.get(
        "http://localhost:8080/api/game/all",
      );
      if (gamesResponse.data) {
        setGames(gamesResponse.data.data);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off(CODE.GAMES_UPDATED);
    };
  }, [
    socket,
    socket.connected,
    tonWalletAddress,
    userData.user?.firstName,
    userData.user?.id,
    userData.user?.photoUrl,
  ]);

  const uniqueGames = useUniqueGames(games);

  if (!isConnected) {
    return <div>连接中...</div>;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-6">
      <Button
        onClick={onCreateGame}
        className="absolute right-2 top-2 bg-white text-black"
      >
        创建一个游戏
      </Button>
      <div>
        <h1>欢迎您:{user?.username}</h1>
        <h1>balance:{user?.balance}</h1>
        <h1>游戏房间: {uniqueGames.length}</h1>
        <div className="flex flex-col space-y-2">
          {uniqueGames.map(
            (game: {
              gameName: string;
              maxPlayers: number;
              players: [];
              gameId: string;
            }) => (
              <div key={game.gameId} className="flex flex-row space-x-2">
                <span>{game.gameName}</span>
                <span>
                  {game.players.length}/{game.maxPlayers}
                </span>
                {game.players.find(
                  (player: { playerId: number }) =>
                    player.playerId === userData.user?.id,
                ) ? (
                  <button onClick={() => router.push(`/game/${game.gameId}`)}>
                    Rejoin
                  </button>
                ) : (
                  <div className="flex flex-col">
                    <Input
                      onChange={(e) => {
                        setBuyInAmount(+e.target.value);
                      }}
                    />

                    <button onClick={() => joinGame(game.gameId, buyInAmount)}>
                      join
                    </button>
                  </div>
                )}
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
