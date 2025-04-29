"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useSocket } from "./SocketContext";
import { CODE } from "@/types/GameTypes"; // 你的事件常量
import { AnimatedChips } from "./AnimatedClips";

interface WinnerInfo {
  playerId: string;
  username: string;
  avatar: string;
  wonAmount: number;
  currentChips: number;
}

const SettlementModal = ({ gameId }: { gameId: string }) => {
  const [winners, setWinners] = useState<WinnerInfo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showWinAmount, setShowWinAmount] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    const handleShowdownWinners = (data: WinnerInfo[] | any) => {
      console.log("✅ [SettlementModal] 收到winners:", data);

      if (Array.isArray(data)) {
        setWinners(data);
      } else if (data?.winners && Array.isArray(data.winners)) {
        setWinners(data.winners);
      } else {
        console.warn("SettlementModal收到格式不对的数据:", data);
        return;
      }

      setShowModal(true);
      setShowWinAmount(true);

      setTimeout(() => {
        setShowWinAmount(false);
      }, 1500);

      setTimeout(() => {
        setShowModal(false);
        setWinners([]);
      }, 5000);
    };

    socket.on(CODE.SHOW_DOWN_RESULT + gameId, handleShowdownWinners);

    return () => {
      socket.off(CODE.SHOW_DOWN_RESULT + gameId, handleShowdownWinners);
    };
  }, [socket, gameId]);

  const handleClose = () => {
    setShowModal(false);
    setWinners([]);
  };

  if (!showModal || winners.length === 0) return null;

  return (
    <Dialog
      open={showModal}
      modal={false}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="max-w-2xl rounded-xl bg-gradient-to-b from-gray-900 via-gray-800 to-black p-6 text-white shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-gold-400 mb-4 text-center text-2xl font-bold">
            🏆 游戏结果
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {winners.map((winner) => (
            <div
              key={winner.playerId}
              className="flex items-center justify-between rounded-md bg-gradient-to-r from-yellow-500/20 via-purple-400/20 to-transparent p-3 transition-all duration-500"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Image
                    src={winner.avatar}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full border border-yellow-400 object-cover shadow-lg shadow-yellow-400/30"
                  />
                  {showWinAmount && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 animate-bounce text-sm font-bold text-green-400">
                      +{winner.wonAmount}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-semibold">{winner.username}</div>
                </div>
              </div>

              {/* 这里用 AnimatedChips 显示动态筹码变化 */}
              <AnimatedChips
                start={winner.currentChips - winner.wonAmount}
                end={winner.currentChips}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleClose}
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
