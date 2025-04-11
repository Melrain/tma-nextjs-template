// src/hooks/useUniqueGames.ts
import { useEffect, useState } from "react";

interface Game {
  gameId: string;
  [key: string]: any;
}

export function useUniqueGames(games: Game[]) {
  const [uniqueGames, setUniqueGames] = useState<Game[]>([]);

  useEffect(() => {
    const uniqueMap = new Map<string, Game>();
    for (const game of games) {
      if (!uniqueMap.has(game.gameId)) {
        uniqueMap.set(game.gameId, game);
      }
    }
    setUniqueGames(Array.from(uniqueMap.values()));
  }, [games]);

  return uniqueGames;
}
