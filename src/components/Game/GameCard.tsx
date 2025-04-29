"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { IoMdPerson } from "react-icons/io";
import { motion } from "framer-motion"; // 记得引入 framer-motion

interface GameCardProps {
  gameName: string;
  gameId: string;
  bigBlind: number;
  minBuyIn: number;
  maxBuyIn: number;
  maxPlayers: number;
  players: { playerId: string; username?: string; avatar?: string }[];
  isJoined: boolean;
  onJoin: () => void;
  onRejoin: () => void;
}

export const GameCard = ({
  gameName,
  gameId,
  bigBlind,
  minBuyIn,
  maxBuyIn,
  maxPlayers,
  players,
  isJoined,
  onJoin,
  onRejoin,
}: GameCardProps) => {
  const [open, setOpen] = useState(false);

  const CardWrapper = players.length > 0 ? motion.div : "div";

  return (
    <CardWrapper
      initial={{ opacity: 1, boxShadow: "0 0 0px rgba(255, 215, 0, 0.5)" }}
      animate={{
        boxShadow: [
          "0 0 5px rgba(255,215,0,0.4)", // 金色微光
          "0 0 15px rgba(138,43,226,0.5)", // 紫色扩散
          "0 0 5px rgba(255,215,0,0.4)", // 金色收缩
        ],
      }}
      transition={{
        duration: 6, // ⏳ 6秒非常慢
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut", // 让光芒变化更平滑
      }}
      className="flex flex-col rounded-2xl bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 shadow-inner transition-transform hover:scale-[1.02]"
    >
      {/* 顶部 */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">{gameName}</h2>
        </div>
        <div className="flex -space-x-2">
          {players.slice(0, 3).map((p) => (
            <img
              key={p.playerId}
              src={p.avatar || "/default-avatar.png"}
              alt="avatar"
              className="h-8 w-8 rounded-full border-2 border-white object-cover"
            />
          ))}
          {players.length > 3 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-xs">
              +{players.length - 3}
            </div>
          )}
        </div>
      </div>

      {/* 中间：房间信息 */}
      <div className="mt-4 space-y-1 text-sm text-gray-300">
        <p>🏷️ 房间 ID: {gameId}</p>
        <p>💰 大盲: {bigBlind}</p>
        <p>🪙 最低买入: {minBuyIn}</p>
        <p>🪙 最高买入: {maxBuyIn}</p>
      </div>

      {/* 底部按钮 */}
      <div className="mt-4 flex items-center justify-between space-x-2">
        {isJoined ? (
          <Button variant="secondary" onClick={onRejoin}>
            重新加入
          </Button>
        ) : (
          <Button onClick={onJoin} className="bg-blue-600 text-white">
            加入游戏
          </Button>
        )}

        {/* 查看玩家 */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div className="flex cursor-pointer flex-row items-center justify-center space-x-2">
              {/* 小人图标们 */}
              <div className="flex flex-row justify-center">
                {Array.from({ length: players.length }).map((_, idx) => (
                  <IoMdPerson key={idx} className="text-green-500" />
                ))}
              </div>

              {/* 文字 */}
              <p className="text-sm text-gray-300">
                {players.length}/{maxPlayers} 玩家
              </p>
            </div>
          </DialogTrigger>
          <DialogContent>
            <div className="flex flex-col space-y-3">
              <h3 className="mb-2 text-center text-lg font-bold">玩家列表</h3>
              {players.length === 0 ? (
                <p className="text-center text-gray-400">暂无玩家</p>
              ) : (
                players.map((p) => (
                  <div
                    key={p.playerId}
                    className="flex items-center space-x-3 border-b py-2"
                  >
                    <img
                      src={p.avatar || "/default-avatar.png"}
                      alt="avatar"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <span>{p.username || "匿名玩家"}</span>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </CardWrapper>
  );
};
