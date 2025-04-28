import { useState, useMemo, useEffect } from "react";
import { PlayerAction, ActionType } from "@/types/GameTypes";

export function useRaiseSlider(availableActions: PlayerAction[]) {
  const raiseAction = useMemo(
    () => availableActions.find((a) => a.type === ActionType.Raise),
    [availableActions],
  );
  const betAction = useMemo(
    () => availableActions.find((a) => a.type === ActionType.Bet),
    [availableActions],
  );

  let minAmount = raiseAction?.minAmount ?? betAction?.minAmount ?? 0;
  let maxAmount = raiseAction?.maxAmount ?? betAction?.maxAmount ?? 0;

  // ✅ 确保 minAmount <= maxAmount
  if (minAmount > maxAmount) {
    [minAmount, maxAmount] = [maxAmount, minAmount];
  }

  const [raiseAmount, setRaiseAmount] = useState(minAmount);

  // ✅ 防止 minAmount 更新时 raiseAmount 还停留在错误的地方
  useEffect(() => {
    setRaiseAmount(minAmount);
  }, [minAmount]);

  return {
    raiseAmount,
    setRaiseAmount,
    minAmount,
    maxAmount,
    raiseAction,
    betAction,
  };
}
