"use client";

import React, { useEffect, useState } from "react";
import { initData, parseInitData } from "@telegram-apps/sdk-react";
import { useSocket } from "./SocketContext";
import { ActionType, CODE, GamePhase, PlayerStatus } from "@/types/GameTypes";
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
  currentMinBet: number;
  gamePhase: GamePhase;
  playerTotalChips: number;
  playerCurrentBet: number;
  playerStatus: PlayerStatus;
  availableActions: ActionType[];
  bigBlind: number;
}

const ActionPanel = ({
  gameId,
  currentPlayerId,
  currentMinBet,
  gamePhase,
  playerTotalChips,
  playerCurrentBet,
  playerStatus,
  availableActions,
  bigBlind,
}: ActionPanelProps) => {
  const userData = parseInitData(initData.raw());
  const userId = userData.user?.id || "";
  const socket = useSocket();

  const [isActed, setIsActed] = useState(false);
  const [raiseAmount, setRaiseAmount] = useState(bigBlind * 2);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const isAllIn = playerTotalChips <= 0;
  const callAmount = currentMinBet - playerCurrentBet;
  const isAllInCall =
    availableActions.includes(ActionType.Call) && playerTotalChips < callAmount;

  const canShowAllIn =
    availableActions.includes(ActionType.AllIn) &&
    !availableActions.includes(ActionType.Raise);

  const minRaise = currentMinBet > 0 ? currentMinBet * 2 : bigBlind * 2;
  const canRaise = playerTotalChips >= minRaise;

  const onAction = (action: ActionType, amount: number = 0) => {
    socket.emit(CODE.PLAYER_ACTION, {
      gameId,
      action: {
        type: action,
        amount,
      },
      playerId: userId,
    });
    setIsActed(true);
    setPopoverOpen(false);
  };

  useEffect(() => {
    setRaiseAmount(minRaise);
  }, [currentMinBet]);

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
    gamePhase === GamePhase.Showdown
  ) {
    return null;
  }

  return (
    <div className="flex w-full flex-col items-center gap-2">
      {isAllIn ? (
        <div className="text-sm text-yellow-300">您已全押，等待结果...</div>
      ) : isActed ? (
        <div className="text-sm text-white">您已操作，等待其他玩家...</div>
      ) : (
        <div className="flex flex-row justify-center gap-2">
          {availableActions.includes(ActionType.Fold) && (
            <ActionButton
              label="FOLD"
              actionType={ActionType.Fold}
              onClick={() => onAction(ActionType.Fold)}
            />
          )}

          {availableActions.includes(ActionType.Check) && (
            <ActionButton
              label="CHECK"
              actionType={ActionType.Check}
              onClick={() => onAction(ActionType.Check)}
            />
          )}

          {availableActions.includes(ActionType.Bet) && (
            <ActionButton
              label={`BET ${currentMinBet}`}
              actionType={ActionType.Bet}
              onClick={() => onAction(ActionType.Bet, currentMinBet)}
            />
          )}

          {availableActions.includes(ActionType.Call) && (
            <ActionButton
              label={
                isAllInCall
                  ? `ALL-IN ${playerTotalChips}`
                  : `CALL ${callAmount}`
              }
              pulse={isAllInCall}
              actionType={ActionType.Call}
              onClick={() =>
                onAction(
                  ActionType.Call,
                  isAllInCall ? playerTotalChips : callAmount,
                )
              }
            />
          )}

          {availableActions.includes(ActionType.Raise) && !isAllIn && (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  onClick={() => setPopoverOpen(true)}
                  className="flex items-center justify-center rounded-xl bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                >
                  ⬆️ Raise
                </button>
              </PopoverTrigger>

              <PopoverContent
                side="top"
                align="center"
                className="z-50 flex w-[90vw] max-w-xs flex-col items-center space-y-4 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-md"
              >
                <Slider
                  min={minRaise}
                  max={playerTotalChips}
                  step={bigBlind}
                  value={[raiseAmount]}
                  onValueChange={(val) => setRaiseAmount(val[0])}
                />

                <div className="text-sm text-white">
                  Raise: <strong>{raiseAmount}</strong> (Min: {minRaise}, Max:{" "}
                  {playerTotalChips})
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  {[1.5, 2, 3, 4].map((x) => {
                    const multiplied = Math.floor(
                      (currentMinBet > 0 ? currentMinBet : bigBlind) * x,
                    );
                    return (
                      <button
                        key={x}
                        disabled={
                          multiplied < minRaise || multiplied > playerTotalChips
                        }
                        title={
                          multiplied < minRaise
                            ? `Min raise is ${minRaise}`
                            : multiplied > playerTotalChips
                              ? "Insufficient chips"
                              : ""
                        }
                        className={cn(
                          "rounded-md px-3 py-1 text-sm",
                          multiplied < minRaise || multiplied > playerTotalChips
                            ? "cursor-not-allowed bg-gray-400 text-white"
                            : "bg-gray-600 text-white hover:bg-gray-700",
                        )}
                        onClick={() => setRaiseAmount(multiplied)}
                      >
                        {x}X
                      </button>
                    );
                  })}
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
                      raiseAmount < minRaise || raiseAmount > playerTotalChips
                    }
                    className="flex-1 text-white"
                    onClick={() => onAction(ActionType.Raise, raiseAmount)}
                  >
                    Confirm Raise
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {canShowAllIn && (
            <ActionButton
              label={`ALL-IN ${playerTotalChips}`}
              actionType={ActionType.AllIn}
              pulse
              onClick={() => onAction(ActionType.AllIn, playerTotalChips)}
            />
          )}
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
    [ActionType.Raise]: "⬆️",
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
        "flex min-w-[80px] flex-row items-center justify-center rounded-xl px-1 text-center text-sm font-semibold text-white transition-all duration-200 ease-in-out",
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
