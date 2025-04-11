"use client";
import { useCountdown } from "@/hooks/useCountdown";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CircularCountdownProps {
  playerId: string;
  currentPlayerId: string;
  total?: number;
  className?: string;
  gameId: string;
}

export function CircularCountdown({
  playerId,
  currentPlayerId,
  total = 30,
  className,
  gameId,
}: CircularCountdownProps) {
  const isActive = playerId === currentPlayerId;
  const { secondsLeft, progress } = useCountdown({
    gameId,
    playerId,
    active: isActive,
    total,
  });

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = ((100 - progress) / 100) * circumference;

  const [danger, setDanger] = useState(false);

  useEffect(() => {
    setDanger(secondsLeft !== null && secondsLeft <= 5);
    if (danger && navigator.vibrate) {
      navigator.vibrate(100);
    }
  }, [danger, secondsLeft]);

  const strokeColor = danger ? "#ef4444" : "#facc15"; // red or yellow

  return (
    <motion.div
      className={"relative h-10 w-10 " + className}
      animate={{ scale: danger ? [1, 1.1, 1] : 1 }}
      transition={{ duration: 0.6, repeat: danger ? Infinity : 0 }}
    >
      <svg className="h-full w-full">
        <circle
          cx="20"
          cy="20"
          r={radius}
          stroke="#555"
          strokeWidth="3"
          fill="none"
        />
        <circle
          cx="20"
          cy="20"
          r={radius}
          stroke={strokeColor}
          strokeWidth="3"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 20 20)"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-mono text-sm text-white">
        {isActive && secondsLeft !== null ? secondsLeft : "--"}
      </div>
    </motion.div>
  );
}
