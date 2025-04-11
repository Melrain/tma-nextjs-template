// hooks/useGameSync.ts
"use client";
import { useSocket } from "@/components/Game/SocketContext";
import { useEffect, useRef, useState } from "react";

export function useGameSync(gameId: string, playerId: string) {
  const [gameState, setGameState] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const lastVersionRef = useRef<number>(-1);

  const socket = useSocket();

  // 拉取当前游戏状态
  const fetchGameState = async () => {
    try {
      const res = await fetch(
        `/api/game-state?gameId=${gameId}&playerId=${playerId}`,
      );
      const data = await res.json();
      setGameState(data);
    } catch (err) {
      console.error("Error fetching game state:", err);
    } finally {
      setLoading(false);
    }
  };

  // 获取当前版本
  const fetchVersion = async () => {
    try {
      const res = await fetch(`/api/game-version?gameId=${gameId}`);
      const { version } = await res.json();
      return parseInt(version);
    } catch {
      return -1;
    }
  };

  // 监听 socket 和初始化拉取
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      setLoading(true);
      await fetchGameState();
      const version = await fetchVersion();
      lastVersionRef.current = version;
    };

    init();

    // 监听版本更新广播
    const handler = async ({
      gameId: changedGameId,
      version,
    }: {
      gameId: string;
      version: number;
    }) => {
      if (changedGameId !== gameId) return;

      // 对比 version
      if (version > lastVersionRef.current) {
        await fetchGameState();
        lastVersionRef.current = version;
      }
    };

    socket.on("roomStatePing", handler);

    return () => {
      mounted = false;
      socket.off("roomStatePing", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, playerId]);

  return { gameState, loading };
}
