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

interface ActionPanelProps {
  gameId: string;
  currentPlayerId: string;
  currentMinBet: number;
  gamePhase: GamePhase;
  playerTotalChips: number;
  playerCurrentBet: number;
  playerStatus: PlayerStatus;
  availableActions: ActionType[];
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
}: ActionPanelProps) => {
  const userData = parseInitData(initData.raw());
  const userId = userData.user?.id || "";
  const socket = useSocket();

  const [isActed, setIsActed] = useState(false);
  const [showRaiseSlider, setShowRaiseSlider] = useState(false);
  const [raiseAmount, setRaiseAmount] = useState(currentMinBet * 2);

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
    setShowRaiseSlider(false);
  };

  useEffect(() => {
    setRaiseAmount(currentMinBet * 2);
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
      <span>actions:{availableActions.length}</span>
      {isActed ? (
        <div className="text-sm text-white">您已操作，等待其他玩家...</div>
      ) : (
        <div className="flex gap-2">
          {availableActions.includes(ActionType.Fold) && (
            <ActionButton
              label="FOLD"
              onClick={() => onAction(ActionType.Fold)}
            />
          )}

          {availableActions.includes(ActionType.Check) && (
            <ActionButton
              label="CHECK"
              onClick={() => onAction(ActionType.Check)}
            />
          )}

          {availableActions.includes(ActionType.Call) && (
            <ActionButton
              label={`CALL ${currentMinBet - playerCurrentBet}`}
              onClick={() =>
                onAction(ActionType.Call, currentMinBet - playerCurrentBet)
              }
            />
          )}

          {availableActions.includes(ActionType.Raise) && (
            <Popover>
              <PopoverTrigger>
                <button
                  onClick={() => setShowRaiseSlider(true)}
                  className="flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-white transition-all hover:bg-blue-700"
                >
                  Raise
                </button>
              </PopoverTrigger>

              <PopoverContent
                side="top"
                align="center"
                className="z-50 flex w-[90vw] max-w-xs flex-col items-center space-y-4 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-md"
              >
                <Slider
                  min={currentMinBet * 2}
                  max={playerTotalChips}
                  value={[raiseAmount]}
                  onValueChange={(val) => setRaiseAmount(val[0])}
                />

                <div className="flex flex-wrap justify-center gap-2">
                  {[1.5, 2, 3, 4].map((x) =>
                    playerTotalChips > currentMinBet * x ? (
                      <button
                        key={x}
                        className="rounded-md bg-gray-600 px-3 py-1 text-sm text-white hover:bg-gray-700"
                        onClick={() =>
                          setRaiseAmount(Math.floor(currentMinBet * x))
                        }
                      >
                        {x}X
                      </button>
                    ) : null,
                  )}
                </div>

                <div className="flex w-full justify-between gap-4">
                  <Button
                    className="flex-1 bg-gray-500 text-white"
                    onClick={() => setShowRaiseSlider(false)}
                  >
                    取消
                  </Button>
                  <Button
                    className="flex-1 bg-blue-500 text-white"
                    onClick={() => {
                      onAction(ActionType.Raise, raiseAmount);
                      setShowRaiseSlider(false);
                    }}
                  >
                    确认 Raise
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
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
}: {
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-all hover:bg-blue-700"
  >
    {label}
  </button>
);
