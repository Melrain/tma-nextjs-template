import React from "react";
import { Button } from "@/components/ui/button";

interface GameCardProps {
  gameName: string;
  gameId: string;
  players: { playerId: string; avatar?: string }[];
  maxPlayers: number;
  isJoined: boolean;
  onJoin: () => void;
  onRejoin: () => void;
}

export const GameCard = ({
  gameName,
  gameId,
  players,
  maxPlayers,
  isJoined,
  onJoin,
  onRejoin,
}: GameCardProps) => {
  return (
    <div className="flex flex-col rounded-2xl border bg-white p-4 shadow-md transition-transform hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">{gameName}</h2>
          <p className="text-sm text-gray-500">
            {players.length}/{maxPlayers} 玩家
          </p>
        </div>
        <div className="flex -space-x-2">
          {players.slice(0, 3).map((p) => (
            // eslint-disable-next-line @next/next/no-img-element
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

      <div className="mt-4 flex justify-end space-x-2">
        {isJoined ? (
          <Button variant="secondary" onClick={onRejoin}>
            重新加入
          </Button>
        ) : (
          <Button onClick={onJoin} className="bg-blue-600 text-white">
            加入游戏
          </Button>
        )}
      </div>
    </div>
  );
};
