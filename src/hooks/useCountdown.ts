"use client";
import { useEffect, useState } from "react";
import { useSocket } from "@/components/Game/SocketContext";
import { CODE } from "@/types/GameTypes";

interface UseCountdownOptions {
  gameId: string;
  playerId: string;
  active: boolean;
  total?: number; // 默认总时长（默认30s）
}

export function useCountdown({
  playerId,
  active,
  total = 30,
  gameId,
}: UseCountdownOptions) {
  const socket = useSocket();
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [progress, setProgress] = useState<number>(0); // 百分比进度

  useEffect(() => {
    if (!active) {
      setSecondsLeft(null);
      setProgress(0);
      return;
    }

    const handler = (data: { playerId: string; seconds: number }) => {
      if (data.playerId === playerId) {
        setSecondsLeft(data.seconds);
        setProgress(((total - data.seconds) / total) * 100);
      }
      if (data.seconds <= 0) {
        setSecondsLeft(null);
        setProgress(0);
      }
    };

    socket.on(CODE.TIMER, handler);

    return () => {
      socket.off(CODE.TIMER + gameId + playerId, handler);
      console.log(
        "stopped listening to countdown event:",
        CODE.TIMER + gameId + playerId,
      );
    };
  }, [socket, playerId, active, total, gameId]);

  return { secondsLeft, progress };
}
