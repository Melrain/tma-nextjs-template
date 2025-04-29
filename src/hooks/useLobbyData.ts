"use client";

import { useState, useEffect, useCallback } from "react";
import { useSocket } from "@/components/Game/SocketContext";
import axios from "axios";
import { initData, parseInitData } from "@telegram-apps/sdk-react";
import { useTonAddress } from "@tonconnect/ui-react";
import { CODE, GamePhase } from "@/types/GameTypes";

export function useLobbyData() {
  const [user, setUser] = useState<{
    username: string;
    balance: number;
    userId: string;
  } | null>(null);
  const [games, setGames] = useState<any[]>([]);
  const socket = useSocket();
  const userData = parseInitData(initData.raw());
  const tonWalletAddress = useTonAddress();

  const fetchGames = useCallback(async () => {
    try {
      const { data } = await axios.get("http://3.80.125.152:8080/api/game/all");
      setGames(data.data);
    } catch (error) {
      console.error("[useLobbyData] Error fetching games:", error);
    }
  }, []);

  const createUser = useCallback(async () => {
    try {
      const { data } = await axios.post(
        "http://3.80.125.152:8080/api/user/login",
        {
          userId: userData.user?.id,
          username: userData.user?.firstName,
          walletAddress: tonWalletAddress,
          avatar: userData.user?.photoUrl,
        },
      );
      setUser(data);
    } catch (error) {
      console.error("[useLobbyData] Error creating user:", error);
    }
  }, [
    userData.user?.id,
    userData.user?.firstName,
    userData.user?.photoUrl,
    tonWalletAddress,
  ]);

  const createGame = useCallback(async () => {
    try {
      await axios.post("http://3.80.125.152:8080/api/game/create", {
        userId: userData.user?.id,
        createGameDto: {
          gameId: userData.user?.id,
          gameName: `${userData.user?.firstName}的游戏`,
          gamePhase: GamePhase.Waiting,
          players: [],
          maxPlayers: 6,
          waitingList: [],
          bigBlind: 1,
          mainPot: { amount: 0, eligiblePlayerIds: [] },
          lastRoundActions: [],
          autoProceed: false,
          sidePots: [],
          currentMinBet: 0,
          dealerId: "",
          currentPlayerId: "",
          communityCards: { flop: [], turn: null, river: null },
          actions: [],
        },
      });
    } catch (error) {
      console.error("[useLobbyData] Error creating game:", error);
    }
  }, [userData.user?.id, userData.user?.firstName]);

  const joinGame = useCallback(
    async (gameId: string, buyInAmount: number) => {
      try {
        await axios.post("http://3.80.125.152:8080/api/game/join-game", {
          gameId,
          username: userData.user?.firstName,
          playerId: userData.user?.id,
          buyInAmount,
          avatar: userData.user?.photoUrl,
        });
      } catch (error) {
        console.error("[useLobbyData] Error joining game:", error);
      }
    },
    [userData.user?.id, userData.user?.firstName, userData.user?.photoUrl],
  );

  useEffect(() => {
    if (!socket) return;
    createUser();
    fetchGames();

    const handleGamesUpdated = async () => {
      await fetchGames();
    };

    socket.on(CODE.REDIS_TOUCH, handleGamesUpdated);
    return () => {
      socket.off(CODE.REDIS_TOUCH, handleGamesUpdated);
    };
  }, [socket, createUser, fetchGames]);

  const uniqueGames = Array.from(
    new Map(games.map((g) => [g.gameId, g])).values(),
  );

  return { user, games: uniqueGames, createGame, joinGame };
}
