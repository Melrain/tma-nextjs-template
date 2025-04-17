"use client";

import React from "react";
import { CommunityCards, GamePhase } from "@/types/GameTypes";
import PokerCard from "@/components/shared/PokerCard";

interface PublicCardsProps {
  publicCards: CommunityCards;
  gamePhase: GamePhase;
}

const PublicCards = ({ publicCards, gamePhase }: PublicCardsProps) => {
  const { flop, turn, river } = publicCards;

  // 根据阶段判断展示哪些牌
  const visibleCards = (() => {
    if (gamePhase >= GamePhase.River) return [...flop, turn, river];
    if (gamePhase === GamePhase.Turn) return [...flop, turn];
    if (gamePhase === GamePhase.Flop) return [...flop];
    return [];
  })();

  const cards = [
    ...visibleCards.map((card) => card ?? { suit: "empty", rank: "empty" }),
    ...new Array(5 - visibleCards.length).fill({
      suit: "unavailable",
      rank: "unavailable",
    }),
  ];

  if (gamePhase === GamePhase.Waiting) {
    return null;
  }

  return (
    <div className="flex gap-2">
      {cards.map((card, index) => (
        <PokerCard
          key={index}
          suit={card.suit}
          rank={card.rank}
          gamePhase={gamePhase}
        />
      ))}
    </div>
  );
};

export default PublicCards;
