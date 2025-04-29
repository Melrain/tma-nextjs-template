"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/components/Game/SocketContext";
import {
  CODE,
  IGame,
  ActionType,
  IPlayer,
  PlayerAction,
  GameResultType,
} from "@/types/GameTypes";
import { initData, parseInitData } from "@telegram-apps/sdk-react";
import { reorderPlayerList } from "@/utils/fn";
import axios from "axios";
import { useRouter } from "next/navigation";

export const useGameSocket = (gameId: string) => {
  const socket = useSocket();
  const userData = parseInitData(initData.raw());
  const userId = String(userData.user?.id || "");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [gameData, setGameData] = useState<IGame>();
  const [players, setPlayers] = useState<any[]>([]);
  const [availableActions, setAvailableActions] = useState<PlayerAction[]>([]);
  const [currentMinBet, setCurrentMinBet] = useState(0);
  const [currentMaxBet, setCurrentMaxBet] = useState(0);
  const [currentHighestChips, setCurrentHighestChips] = useState(0);
  const [settlementResult, setSettlementResult] =
    useState<GameResultType | null>(null);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  const onLeaveGame = async () => {
    try {
      await axios.post("http://3.80.125.152:8080/api/game/leave-game", {
        gameId,
        playerId: userId,
      });
    } catch (error) {
      console.error("Error leaving game:", error);
    } finally {
      router.push("/");
    }
  };

  const onResetGame = async () => {
    try {
      await axios.post("http://3.80.125.152:8080/api/game/reset-game", {
        gameId,
      });
    } catch (error) {
      console.error("Error resetting game:", error);
    }
  };

  // ✅ 所有 handler 保持引用稳定
  const handleConnect = () => setIsConnected(true);
  const handleDisconnect = () => setIsConnected(false);
  const handleTouch = () => {
    socket.emit(CODE.REDIS_HASH_GET_GAME, { gameId, userId });
  };

  const handlePrivateData = (data: any) => {
    const reOrderedPlayers = reorderPlayerList(
      data.gameData.players,
      Number(userId),
    );
    setPlayers(reOrderedPlayers);
    setGameData(data.gameData);

    const maxBet = Math.max(
      ...data.gameData.players.map((p: { bet: any }) => p.bet),
    );
    const otherPlayers = data.gameData.players.filter(
      (p: IPlayer) => p.playerId !== userId,
    );
    const highestChips =
      otherPlayers.length > 0
        ? Math.max(
            ...otherPlayers.map((p: { totalChips: any }) => p.totalChips),
          )
        : 0;

    setCurrentMaxBet(maxBet);
    setCurrentHighestChips(highestChips);
  };

  const handleAvailableActions = (data: {
    playerId: string;
    actions: PlayerAction[];
  }) => {
    if (data.playerId.toString() === userId) {
      setAvailableActions(data.actions);
      console.log("✅ Available actions received:", data.actions);
    }
  };

  useEffect(() => {
    setIsConnected(socket.connected);
    const eventAvailable = CODE.AVAILABLE_ACTIONS + gameId + userId;
    const eventPrivate = CODE.REDIS_PRIVATE_DATA + gameId + userId;
    const eventTouch = CODE.REDIS_TOUCH + gameId;

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on(eventTouch, handleTouch);
    socket.on(eventPrivate, handlePrivateData);
    socket.on(eventAvailable, handleAvailableActions);

    socket.emit(CODE.REDIS_HASH_GET_GAME, { gameId, userId });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off(eventTouch, handleTouch);
      socket.off(eventPrivate, handlePrivateData);
      socket.off(eventAvailable, handleAvailableActions);
      console.log(
        "🛑 stopped listening available actions event:",
        eventAvailable,
      );
      socket.off(CODE.SHOW_DOWN_RESULT + gameId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, socket, userId]); // ✅ 不包含 players 或动态函数

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
