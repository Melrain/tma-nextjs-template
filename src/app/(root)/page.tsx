"use client";

import React, { useState } from "react";
import { useLobbyData } from "@/hooks/useLobbyData";
import { useLobbySocket } from "@/hooks/useLobbySocket";
import { Button } from "@/components/ui/button";
import { Input } from "@telegram-apps/telegram-ui";
import { GameCard } from "@/components/Game/GameCard";
import { useRouter } from "next/navigation";
import { IPlayer } from "@/types/GameTypes";

const LobbyPage = () => {
  const { user, games, createGame, joinGame } = useLobbyData();
  const { isConnected } = useLobbySocket();
  const [buyInAmount, setBuyInAmount] = useState(100);
  const router = useRouter();

  if (!isConnected) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-500">连接服务器中...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center space-y-6 bg-gray-100 px-4 py-8">
      <Button
        onClick={createGame}
        className="absolute right-6 top-6 bg-gradient-to-r from-pink-500 to-yellow-500 text-white"
      >
        创建一个新游戏
      </Button>
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          欢迎, {user?.username}
        </h1>
        <p className="text-gray-600">余额：{user?.balance}</p>
      </div>
      {games.length === 0 ? (
        <div className="mt-10 text-gray-400">
          暂无游戏房间，快来创建一个吧！
        </div>
      ) : (
        <div className="grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
          {games.map((game) => {
            const isJoined = game.players.some(
              (p: IPlayer) => p.playerId === user?.userId,
            );

            return (
              <GameCard
                key={game.gameId}
                gameName={game.gameName}
                gameId={game.gameId}
                players={game.players}
                maxPlayers={game.maxPlayers}
                isJoined={isJoined}
                onJoin={() => joinGame(game.gameId, buyInAmount)}
                onRejoin={() => router.push(`/game/${game.gameId}`)}
              />
            );
          })}
        </div>
      )}
      {/* 买入金额输入框
      <div className="fixed bottom-6 left-6">
        <Input
          type="number"
          value={buyInAmount}
          onChange={(e) => setBuyInAmount(Number(e.target.value))}
          placeholder="买入金额"
        />
      </div> */}
    </div>
  );
};

export default LobbyPage;
