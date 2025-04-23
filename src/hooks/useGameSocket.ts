"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/components/Game/SocketContext";
import { CODE, IGame, ActionType, IPlayer } from "@/types/GameTypes";
import { initData, parseInitData } from "@telegram-apps/sdk-react";
import { reorderPlayerList } from "@/utils/fn";
import axios from "axios";
import { useRouter } from "next/navigation";

export const useGameSocket = (gameId: string) => {
  const socket = useSocket();
  const userData = parseInitData(initData.raw());
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [gameData, setGameData] = useState<IGame>();
  const [players, setPlayers] = useState<any[]>([]);
  const [availableActions, setAvailableActions] = useState<ActionType[]>([]);
  const [currentMaxBet, setCurrentMaxBet] = useState(0);
  const [currentHighestChips, setCurrentHighestChips] = useState(0);
  const router = useRouter();

  const onLeaveGame = async () => {
    try {
      await axios.post("http://localhost:8080/api/game/leave-game", {
        gameId: gameId,
        playerId: String(userData.user?.id || ""),
      });
    } catch (error) {
      console.error("Error leaving game:", error);
    } finally {
      router.push("/");
    }
  };

  const onResetGame = async () => {
    try {
      await axios.post("http://localhost:8080/api/game/reset-game", {
        gameId: gameId,
      });
    } catch (error) {
      console.error("Error resetting game:", error);
    }
  };

  useEffect(() => {
    setIsConnected(socket.connected);

    const userId = String(userData.user?.id || "");

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    const getGame = () => {
      socket.emit(CODE.REDIS_HASH_GET_GAME, {
        gameId,
        userId,
      });
    };

    const handleTouch = () => {
      getGame();
    };

    const handlePrivateData = (data: any) => {
      const reOrderedPlayers = reorderPlayerList(
        data.gameData.players,
        userData.user?.id || 0,
      );

      setPlayers(reOrderedPlayers);
      setGameData(data.gameData);
      const maxBet = Math.max(...players.map((p) => p.bet));
      const otherPlayers = players.filter(
        (p: IPlayer) => p.playerId !== userId,
      );
      const highestChips =
        otherPlayers.length > 0
          ? Math.max(...otherPlayers.map((p) => p.totalChips))
          : 0;
      setCurrentMaxBet(maxBet);
      setCurrentHighestChips(highestChips);
    };

    const handleAvailableActions = (data: {
      playerId: string;
      actions: ActionType[];
    }) => {
      console.log(data.playerId, userId);
      if (data.playerId.toString() === userId) {
        setAvailableActions(data.actions);
        console.log("available actions", data.actions);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on(CODE.REDIS_TOUCH + gameId, handleTouch);
    socket.on(CODE.REDIS_PRIVATE_DATA + gameId + userId, handlePrivateData);
    console.log(
      "CODE.AVAILABLE_ACTIONS + gameId + userId",
      typeof gameId,
      typeof userId,
      CODE.AVAILABLE_ACTIONS + gameId + userId,
    );
    socket.on(CODE.AVAILABLE_ACTIONS + gameId + userId, handleAvailableActions);

    getGame();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off(CODE.REDIS_TOUCH + gameId, handleTouch);
      socket.off(CODE.REDIS_PRIVATE_DATA + gameId + userId, handlePrivateData);
      socket.off(
        CODE.AVAILABLE_ACTIONS + gameId + userId,
        handleAvailableActions,
      );
      console.log(
        "stopped listening available actions event:",
        CODE.AVAILABLE_ACTIONS + gameId + userId,
      );
    };
  }, [gameId, players, socket, userData.user?.id]);

  return {
    isConnected,
    players,
    gameData,
    userData,
    onLeaveGame,
    onResetGame,
    availableActions,
    currentMaxBet,
    currentHighestChips,
  };
};
