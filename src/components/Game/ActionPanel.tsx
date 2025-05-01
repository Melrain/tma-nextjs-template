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
  const [actionInProgress, setActionInProgress] = useState(false);
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
    setIsActed(true);
    setActionInProgress(true);
    setPopoverOpen(false);

    socket.emit(CODE.PLAYER_ACTION, {
      gameId,
      action: { type: actionType, amount },
      playerId: userId,
    });
  };

  useEffect(() => {
    if (actionInProgress) {
      const isStillMyTurn = availableActions.some(
        (a) => currentPlayerId === userId && a,
      );
      if (!isStillMyTurn) {
        setActionInProgress(false); // 后端已确认轮换
      }
    }
  }, [availableActions, currentPlayerId, userId, actionInProgress]);

  // 修正 raise slider 默认值逻辑
  useEffect(() => {
    if (popoverOpen) {
      const defaultVal = raiseAction?.amount ?? betAction?.amount ?? minAmount;
      setRaiseAmount((prev) => (prev < minAmount ? defaultVal : prev));
    }
  }, [popoverOpen, raiseAction, betAction, minAmount]);

  // 处理计时器重置
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

  // ✅ 优化：立即隐藏已行动或不该显示的玩家
  const shouldHide =
    isActed ||
    actionInProgress || // ✅ 添加这一行，避免后端广播后再次渲染
    currentPlayerId !== userId ||
    [GamePhase.Waiting, GamePhase.Ended, GamePhase.Showdown].includes(
      gamePhase,
    ) ||
    playerStatus === PlayerStatus.AllIn;

  if (shouldHide) return null;

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="flex flex-row justify-center gap-2">
        {availableActions.map((action) => {
          switch (action.type) {
            case ActionType.Bet:
            case ActionType.Raise:
              return (
                <RaisePopoverButton
                  key={action.type}
                  label={action.type === ActionType.Bet ? "💰 BET" : "⬆️ RAISE"}
                  amount={raiseAmount}
                  min={minAmount}
                  max={maxAmount}
                  setAmount={setRaiseAmount}
                  onConfirm={() => onAction(action.type, raiseAmount)}
                />
              );

            default:
              return (
                <ActionButton
                  key={action.type}
                  label={getLabel(action)}
                  actionType={action.type}
                  onClick={() => onAction(action.type, action.amount || 0)}
                  pulse={
                    action.type === ActionType.AllIn ||
                    action.type === ActionType.CallAllIn ||
                    action.type === ActionType.RaiseAllIn
                  }
                />
              );
          }
        })}
      </div>
    </div>
  );
};

export default ActionPanel;

const getLabel = (action: PlayerAction): string => {
  switch (action.type) {
    case ActionType.Fold:
      return "🃏 FOLD";
    case ActionType.Check:
      return "✅ CHECK";
    case ActionType.Call:
      return `📞 CALL ${action.amount}`;
    case ActionType.AllIn:
      return `💥 ALL-IN ${action.amount}`;
    case ActionType.CallAllIn:
      return `📞 CALL ALL-IN ${action.amount}`;
    case ActionType.RaiseAllIn:
      return `⬆️ RAISE ALL-IN ${action.amount}`;
    default:
      return action.type.toString(); // ✅ ✅ ✅
  }
};

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

const RaisePopoverButton = ({
  label,
  amount,
  min,
  max,
  setAmount,
  onConfirm,
}: {
  label: string;
  amount: number;
  min: number;
  max: number;
  setAmount: (v: number) => void;
  onConfirm: () => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex h-[40px] w-[100px] items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-sm font-semibold text-white"
          onClick={() => setOpen(true)}
        >
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        className="w-[90vw] max-w-xs rounded-2xl bg-white/10 p-4 shadow-xl backdrop-blur-md"
      >
        <Slider
          min={min}
          max={max}
          value={[amount]}
          onValueChange={(val) => setAmount(val[0])}
        />
        <div className="text-sm text-white">
          {label}: <strong>{amount}</strong>
        </div>
        <div className="mt-4 flex w-full justify-between gap-4">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1 text-white"
            disabled={amount < min || amount > max}
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            Confirm
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
