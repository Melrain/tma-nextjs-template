"use client";

import axios from "axios";
import { GamePhase } from "@/types/GameTypes";
import { useRouter } from "next/navigation";

export function useGameActions(userData: any) {
  const router = useRouter();

  const createGame = async () => {
    try {
      await axios.post("http://localhost:8080/api/game/create", {
        userId: userData.user?.id,
        createGameDto: {
          gameId: userData.user?.id,
          gameName: `${userData.user?.firstName}的游戏`,
          gamePhase: GamePhase.Waiting,
          players: [],
          maxPlayers: 6,
          waitingList: [],
          bigBlind: 1,
          pot: 0,
          currentMinBet: 0,
          dealerId: "",
          currentPlayerId: "",
          communityCards: { flop: [], turn: null, river: null },
          actions: [],
        },
      });
    } catch (err) {
      console.error("Error creating game:", err);
    }
  };

  const joinGame = async (gameId: string) => {
    try {
      await axios.post("http://localhost:8080/api/game/join-game", {
        gameId,
        username: userData.user?.firstName,
        playerId: userData.user?.id,
        buyInAmount: 100,
        avatar: userData.user?.photoUrl,
      });

      router.push(`/game/${gameId}`);
    } catch (err) {
      console.error("Error joining game:", err);
    }
  };

  return {
    createGame,
    joinGame,
  };
}
