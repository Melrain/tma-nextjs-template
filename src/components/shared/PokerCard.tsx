"use client";

import React, { useEffect, useState } from "react";
import {
  RiPokerClubsFill,
  RiPokerDiamondsFill,
  RiPokerSpadesFill,
} from "react-icons/ri";
import { FaHeart } from "react-icons/fa";
import { GiPokerHand } from "react-icons/gi";

type PokerCardProps = {
  suit: string;
  rank: string;
  width?: string;
  height?: string;
  classNames?: string;
};

const PokerCard: React.FC<PokerCardProps> = ({
  suit,
  rank,
  width = "w-[60px]",
  height = "h-[84px]",
  classNames = "",
}) => {
  const s = suit?.toLowerCase();
  const r = rank?.toLowerCase();

  const isEmpty = !suit || !rank || s === "empty" || r === "empty";
  const isFaceDown =
    s === "unavailable" || r === "unavailable" || s === "null" || r === "null";

  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (isFaceDown) {
      setFlipped(false);
    } else {
      setTimeout(() => setFlipped(true), 150); // 延迟一点自然翻牌
    }
  }, [suit, rank, isFaceDown]);

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
      className={`relative ${width} ${height} ${classNames} perspective-800`}
      style={{ aspectRatio: "2.5 / 3.5" }}
    >
      <div
        className={`relative h-full w-full transition-transform duration-700 ease-in-out ${
          flipped ? "rotate-y-180 scale-105" : "scale-95"
        }`}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* 背面 */}
        <div
          className="absolute flex h-full w-full items-center justify-center rounded-lg bg-gray-800 text-4xl text-white backface-hidden"
          style={{
            transform: "rotateY(0deg)",
          }}
        >
          <GiPokerHand />
        </div>

        {/* 正面 */}
        {!isFaceDown && (
          <div
            className="absolute flex h-full w-full flex-col justify-between rounded-lg border border-gray-500 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-400 px-2 py-2 shadow-md backface-hidden"
            style={{
              transform: "rotateY(180deg)",
            }}
          >
            <div
              className={`absolute ${colorClass} left-1 top-0 text-3xl font-extrabold`}
            >
              {rank}
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
              {renderSuitIcon("text-md")}
            </div>
            <div className="absolute bottom-0 right-1">
              {renderSuitIcon("text-3xl")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PokerCard;
