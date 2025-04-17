"use client";

import React from "react";
import {
  RiPokerClubsFill,
  RiPokerDiamondsFill,
  RiPokerSpadesFill,
} from "react-icons/ri";
import { FaHeart } from "react-icons/fa";
import { GiPokerHand } from "react-icons/gi";
import { GamePhase } from "@/types/GameTypes";
import "@fontsource/playfair-display/400.css"; // Import Playfair Display font

type PokerCardProps = {
  suit: string;
  rank: string;
  width?: string;
  height?: string;
  classNames?: string;
  gamePhase: GamePhase;
  textSize?: string;
};

const PokerCard: React.FC<PokerCardProps> = ({
  suit,
  rank,
  width = "w-[60px]",
  height = "h-[84px]",
  classNames = "",
  gamePhase,
  textSize = "md",
}) => {
  const s = suit?.toLowerCase();
  const r = rank?.toLowerCase();

  const isEmpty = !suit || !rank || s === "empty" || r === "empty";
  const isFaceDown =
    s === "unavailable" || r === "unavailable" || s === "null" || r === "null";

  if (isEmpty) return null;

  const renderSuitIcon = (size: string) => {
    switch (suit.toUpperCase()) {
      case "H":
        return <FaHeart className={`${size} text-red-600`} />;
      case "D":
        return <RiPokerDiamondsFill className={`${size} text-red-500`} />;
      case "C":
        return <RiPokerClubsFill className={`${size} text-black`} />;
      case "S":
        return <RiPokerSpadesFill className={`${size} text-black`} />;
      default:
        return null;
    }
  };

  const colorClass =
    suit.toUpperCase() === "H" || suit.toUpperCase() === "D"
      ? "text-red-600"
      : "text-black";

  return (
    <div
      className={`relative ${width} ${height} ${classNames} flex items-center justify-center rounded-lg border border-gray-500 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-400 shadow-md`}
      style={{
        aspectRatio: "2.5 / 3.5",
      }}
    >
      {isFaceDown ? (
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-800 text-4xl text-white">
          <GiPokerHand />
        </div>
      ) : (
        <div className="flex h-full w-full flex-col justify-between px-2 py-2">
          {/* 左上角：大号数字 + 小号花色 */}
          <div
            className={`absolute ${colorClass} top-0 text-3xl font-extrabold`}
          >
            {rank}
          </div>
          <div className="absolute top-1/2 -translate-y-[30%]">
            {renderSuitIcon("text-md")}
          </div>
          {/* 中间大花色图标 */}
          <div className="absolute bottom-0 right-1">
            {renderSuitIcon("text-3xl")}
          </div>
        </div>
      )}
    </div>
  );
};

export default PokerCard;
