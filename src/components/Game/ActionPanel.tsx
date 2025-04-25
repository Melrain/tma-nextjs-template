"use client";

import React, { useEffect, useState } from "react";
import { initData, parseInitData } from "@telegram-apps/sdk-react";
import { useSocket } from "./SocketContext";
import {
  PlayerAction,
  ActionType,
  CODE,
  GamePhase,
  PlayerStatus,
} from "@/types/GameTypes";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface ActionPanelProps {
  gameId: string;
  currentPlayerId: string;
  gamePhase: GamePhase;
  playerTotalChips: number;
  playerStatus: PlayerStatus;
  availableActions: PlayerAction[];
}

const ActionPanel = ({
  gameId,
  currentPlayerId,
  gamePhase,
  playerTotalChips,
  playerStatus,
  availableActions,
}: ActionPanelProps) => {
  const userData = parseInitData(initData.raw());
  const userId = userData.user?.id || "";
  const socket = useSocket();

  const [isActed, setIsActed] = useState(false);
  const [raiseAmount, setRaiseAmount] = useState(0);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const onAction = (action: ActionType, amount: number = 0) => {
    socket.emit(CODE.PLAYER_ACTION, {
      gameId,
      action: { type: action, amount },
      playerId: userId,
    });
    setIsActed(true);
    setPopoverOpen(false);
  };

  useEffect(() => {
    const handleTimer = (data: { playerId: string; seconds: number }) => {
      if (data.playerId === userId) {
        setIsActed(false);
      }
    };
    socket.on(CODE.TIMER, handleTimer);
    return () => {
      socket.off(CODE.TIMER, handleTimer);
    };
  }, [socket, userId]);

  if (
    currentPlayerId !== userId ||
    gamePhase === GamePhase.Waiting ||
    gamePhase === GamePhase.Ended ||
    gamePhase === GamePhase.Showdown ||
    playerStatus === PlayerStatus.AllIn
  ) {
    return null;
  }

  return (
    <div className="flex w-full flex-col items-center gap-2">
      {isActed ? (
        <div className="text-sm text-white">您已操作，等待其他玩家...</div>
      ) : (
        <div className="flex flex-row justify-center gap-2">
          {availableActions.map((action) => {
            const { type, amount = 0, minAmount = 0, maxAmount = 0 } = action;

            const isRaiseType =
              type === ActionType.Raise || type === ActionType.Bet;
            const isAllInFallback = type === ActionType.AllIn;

            const isRedundantAllIn =
              isAllInFallback &&
              availableActions.some(
                (a) =>
                  (a.type === ActionType.Raise || a.type === ActionType.Bet) &&
                  a.maxAmount === playerTotalChips,
              );

            if (isRedundantAllIn) return null;

            if (isRaiseType) {
              return (
                <Popover
                  key={`${type}-${minAmount}-${maxAmount}`}
                  open={popoverOpen}
                  onOpenChange={setPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <button
                      onClick={() => setPopoverOpen(true)}
                      className="flex h-[40px] w-[100px] flex-row items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 px-1 text-center text-sm font-semibold text-white transition-all duration-200 ease-in-out"
                    >
                      {type === ActionType.Raise ? "⬆️ Raise" : "💰 Bet"}
                    </button>
                  </PopoverTrigger>

                  <PopoverContent className="z-50 flex w-[90vw] max-w-xs flex-col items-center space-y-4 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-md">
                    <Slider
                      min={minAmount}
                      max={maxAmount}
                      value={[raiseAmount]}
                      step={1}
                      onValueChange={(val) => setRaiseAmount(val[0])}
                    />
                    <div className="text-sm text-white">
                      {ActionType[type]}: <strong>{raiseAmount}</strong> (Min:{" "}
                      {minAmount}, Max: {maxAmount})
                    </div>
                    <div className="flex w-full justify-between gap-4">
                      <Button
                        variant="secondary"
                        className="flex-1"
                        onClick={() => setPopoverOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        disabled={
                          raiseAmount < minAmount || raiseAmount > maxAmount
                        }
                        className="flex-1 text-white"
                        onClick={() => {
                          const isAllIn = raiseAmount === maxAmount;
                          onAction(
                            isAllIn ? ActionType.AllIn : type,
                            raiseAmount,
                          );
                        }}
                      >
                        {raiseAmount === maxAmount ? "ALL-IN" : "Confirm"}
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              );
            }

            const labelMap: Partial<Record<ActionType, string>> = {
              [ActionType.Fold]: "Fold",
              [ActionType.Check]: "Check",
              [ActionType.Call]: `Call ${amount}`,
              [ActionType.CallAllIn]: `ALL-IN (Call) ${amount}`,
              [ActionType.RaiseAllIn]: `ALL-IN (Raise) ${amount}`,
              [ActionType.AllIn]: `ALL-IN ${amount}`,
            };

            const pulse =
              type === ActionType.AllIn ||
              type === ActionType.CallAllIn ||
              type === ActionType.RaiseAllIn;

            return (
              <ActionButton
                key={`${type}-${amount}`}
                label={labelMap[type] || ActionType[type]}
                actionType={type}
                pulse={pulse}
                onClick={() => onAction(type, amount)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActionPanel;

const ActionButton = ({
  label,
  onClick,
  actionType,
  pulse = false,
}: {
  label: string;
  onClick: () => void;
  actionType: ActionType;
  pulse?: boolean;
}) => {
  const iconMap: Partial<Record<ActionType, string>> = {
    [ActionType.Fold]: "🃏",
    [ActionType.Check]: "✅",
    [ActionType.Bet]: "💰",
    [ActionType.Call]: "📞",
    [ActionType.CallAllIn]: "📞💥",
    [ActionType.Raise]: "⬆️",
    [ActionType.RaiseAllIn]: "⬆️💥",
    [ActionType.AllIn]: "💥",
  };

  const handleClick = () => {
    if (navigator.vibrate) navigator.vibrate(80);
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex h-[40px] w-[100px] flex-row items-center justify-center rounded-xl px-1 text-center text-sm font-semibold text-white transition-all duration-200 ease-in-out",
        "border-2 border-black shadow-sm backdrop-blur-xl",
        "hover:scale-105 hover:opacity-90",
        pulse
          ? "animate-breathe bg-gradient-to-r from-yellow-300 via-orange-500 to-red-600 ring-2 ring-yellow-400 ring-offset-2"
          : "bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600",
      )}
    >
      <span className="mr-1">{iconMap[actionType]}</span>
      {label}
    </button>
  );
};
