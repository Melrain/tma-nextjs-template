"use client";

import React, { useEffect, useState } from "react";
import { initData, parseInitData } from "@telegram-apps/sdk-react";
import { useSocket } from "./SocketContext";
import {
  ActionType,
  CODE,
  GamePhase,
  PlayerAction,
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
import { useRaiseSlider } from "@/hooks/useRaiseSlider";

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
  const [popoverOpen, setPopoverOpen] = useState(false);

  const {
    raiseAmount,
    setRaiseAmount,
    minAmount,
    maxAmount,
    raiseAction,
    betAction,
  } = useRaiseSlider(availableActions);

  const onAction = (actionType: ActionType, amount: number = 0) => {
    socket.emit(CODE.PLAYER_ACTION, {
      gameId,
      action: { type: actionType, amount },
      playerId: userId,
    });
    setIsActed(true);
    setPopoverOpen(false);
  };

  useEffect(() => {
    if (popoverOpen) {
      const defaultVal = raiseAction?.amount ?? betAction?.amount ?? minAmount;
      setRaiseAmount((prev) => (prev < minAmount ? defaultVal : prev));
    }
  }, [popoverOpen, raiseAction, betAction, minAmount]);

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
            if (
              action.type === ActionType.Raise ||
              action.type === ActionType.Bet
            ) {
              return (
                <Popover
                  key={action.type}
                  open={popoverOpen}
                  onOpenChange={setPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <button
                      className="flex h-[40px] w-[100px] items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-sm font-semibold text-white"
                      onClick={() => setPopoverOpen(true)}
                    >
                      {action.type === ActionType.Raise ? "⬆️ Raise" : "💰 Bet"}
                    </button>
                  </PopoverTrigger>

                  <PopoverContent
                    side="top"
                    align="center"
                    className="w-[90vw] max-w-xs rounded-2xl bg-white/10 p-4 shadow-xl backdrop-blur-md"
                  >
                    <Slider
                      min={minAmount}
                      max={maxAmount}
                      value={[raiseAmount]}
                      onValueChange={(val) => setRaiseAmount(val[0])}
                    />
                    <div className="text-sm text-white">
                      {action.type === ActionType.Raise ? "Raise" : "Bet"}:{" "}
                      <strong>{raiseAmount}</strong>
                    </div>
                    <div className="mt-4 flex w-full justify-between gap-4">
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
                        onClick={() => onAction(action.type, raiseAmount)}
                      >
                        Confirm
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              );
            }

            const labelMap: Record<ActionType, string> = {
              [ActionType.Fold]: "🃏 FOLD",
              [ActionType.Check]: "✅ CHECK",
              [ActionType.Call]: `📞 CALL ${action.amount}`,
              [ActionType.AllIn]: `💥 ALL-IN ${action.amount}`,
              [ActionType.CallAllIn]: `📞 CALL ALL-IN ${action.amount}`,
              [ActionType.RaiseAllIn]: `⬆️ RAISE ALL-IN ${action.amount}`,
              [ActionType.Bet]: "", // Bet单独处理
              [ActionType.Raise]: "", // Raise单独处理
            };

            return (
              <ActionButton
                key={action.type}
                label={labelMap[action.type] || ""}
                actionType={action.type}
                onClick={() => onAction(action.type, action.amount || 0)}
                pulse={
                  action.type === ActionType.AllIn ||
                  action.type === ActionType.CallAllIn ||
                  action.type === ActionType.RaiseAllIn
                }
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
  return (
    <button
      onClick={() => {
        if (navigator.vibrate) navigator.vibrate(80);
        onClick();
      }}
      className={cn(
        "flex h-[40px] w-[100px] items-center justify-center rounded-xl px-1 text-center text-sm font-semibold text-white",
        "border-2 border-black shadow-sm backdrop-blur-xl",
        "hover:scale-105 hover:opacity-90",
        pulse
          ? "animate-breathe bg-gradient-to-r from-yellow-300 via-orange-500 to-red-600 ring-2 ring-yellow-400 ring-offset-2"
          : "bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600",
      )}
    >
      {label}
    </button>
  );
};
