"use client";

import { useLobbyData } from "@/hooks/useLobbyData";
import { GameCard } from "@/components/Game/GameCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LobbyPage() {
  const { user, games, createGame, joinGame } = useLobbyData();
  const router = useRouter();
  const [buyInAmount, setBuyInAmount] = useState(100);

  if (!user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-900">
        <div className="text-gray-400">加载中...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col space-y-6 bg-gradient-to-b from-emerald-950 via-gray-900 to-black p-6 py-10">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-gold-400 text-2xl font-bold">
            欢迎, {user.username}
          </h1>
          <p className="text-sm text-gray-400">余额: {user.balance} 💰</p>
        </div>
        <Button
          onClick={createGame}
          className="bg-green-700 text-white hover:bg-green-600"
        >
          创建新游戏
        </Button>
      </div>

      {/* 房间列表 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {games.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            暂无可加入的游戏
          </div>
        ) : (
          games.map((game) => {
            const isJoined = game.players.some(
              (p: any) => p.playerId === user.userId,
            );

            const handleJoin = async () => {
              await joinGame(game.gameId, buyInAmount);
              router.push(`/game/${game.gameId}`);
            };

            const handleRejoin = () => {
              router.push(`/game/${game.gameId}`);
            };

            return (
              <GameCard
                key={game.gameId}
                gameId={game.gameId}
                gameName={game.gameName}
                bigBlind={game.bigBlind}
                minBuyIn={game.bigBlind * 20}
                maxPlayers={game.maxPlayers}
                players={game.players || []}
                isJoined={isJoined}
                onJoin={handleJoin}
                onRejoin={handleRejoin}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
