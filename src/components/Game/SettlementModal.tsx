"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCountUp } from "@/hooks/useCountUp";
import Image from "next/image";

interface PlayerInfo {
  playerId: string;
  username: string;
  avatar: string;
  currentChips: number;
}

interface WinnerInfo {
  playerId: string;
  wonAmount: number;
  currentChips: number;
}

interface Props {
  players?: PlayerInfo[];
  winners?: WinnerInfo[];
  onClose?: () => void;
}

const SettlementModal = ({ players = [], winners = [], onClose }: Props) => {
  const [showWinAmount, setShowWinAmount] = useState(true);

  const winnerIds = winners.map((w) => w.playerId);

  useEffect(() => {
    const winAmountTimer = setTimeout(() => setShowWinAmount(false), 1500);

    const autoCloseTimer = setTimeout(() => {
      if (onClose) onClose();
    }, 5000); // 5秒后自动关闭

    return () => {
      clearTimeout(winAmountTimer);
      clearTimeout(autoCloseTimer);
    };
  }, [onClose]);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open && onClose) onClose();
      }}
    >
      <DialogContent className="max-w-2xl rounded-xl bg-gradient-to-b from-gray-900 via-gray-800 to-black p-6 text-white shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-gold-400 mb-4 text-center text-2xl font-bold">
            🏆 游戏结果
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {players.map((player) => {
            const isWinner = winnerIds.includes(player.playerId);
            const wonData = winners.find((w) => w.playerId === player.playerId);

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const animatedChips = useCountUp(
              player.currentChips - (wonData?.wonAmount ?? 0),
              player.currentChips,
            );

            return (
              <div
                key={player.playerId}
                className={`flex items-center justify-between rounded-md p-3 transition-all duration-500 ${
                  isWinner
                    ? "bg-gradient-to-r from-yellow-500/20 via-purple-400/20 to-transparent"
                    : "bg-gray-800/50 opacity-70"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Image
                      src={player.avatar}
                      alt="avatar"
                      className={`h-10 w-10 rounded-full border object-cover ${
                        isWinner
                          ? "border-yellow-400 shadow-lg shadow-yellow-400/30"
                          : "border-gray-600 grayscale"
                      }`}
                    />
                    {/* 赢得金额的爆炸动画 */}
                    {isWinner && showWinAmount && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 animate-bounce text-sm font-bold text-green-400">
                        +{wonData?.wonAmount}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold">{player.username}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="text-sm font-bold text-yellow-300">
                    {animatedChips} 🪙
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="bg-gold-400 rounded-full px-6 py-2 font-bold text-black transition hover:bg-yellow-400"
          >
            确认
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettlementModal;
