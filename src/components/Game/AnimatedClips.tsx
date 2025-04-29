"use client";

import { useCountUp } from "@/hooks/useCountUp";

interface AnimatedChipsProps {
  start: number;
  end: number;
}

export const AnimatedChips = ({ start, end }: AnimatedChipsProps) => {
  const animatedChips = useCountUp(start, end);
  return (
    <div className="text-sm font-bold text-yellow-300">{animatedChips} 🪙</div>
  );
};
