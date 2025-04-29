import { useState } from "react";

interface FlyingChip {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export const useFlyingChips = () => {
  const [chips, setChips] = useState<FlyingChip[]>([]);

  const launchChips = (
    startX: number,
    startY: number,
    winners: { index: number; x: number; y: number }[],
  ) => {
    const newChips: FlyingChip[] = [];

    winners.forEach((winner, winnerIdx) => {
      for (let i = 0; i < 5; i++) {
        // 每个赢家飞5个筹码
        newChips.push({
          id: `${winnerIdx}-${i}-${Date.now()}`,
          startX,
          startY,
          endX: winner.x,
          endY: winner.y,
        });
      }
    });

    setChips(newChips);

    // 飞行结束后自动清除
    setTimeout(() => {
      setChips([]);
    }, 1500); // 飞行时间 + 留一点时间
  };

  return { chips, launchChips };
};
