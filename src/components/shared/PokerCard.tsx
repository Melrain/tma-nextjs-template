"use client";
import { FaHeart } from "react-icons/fa";
import { GiPokerHand } from "react-icons/gi";
import { RiPokerClubsFill, RiPokerSpadesFill } from "react-icons/ri";
import { RiPokerDiamondsFill } from "react-icons/ri";
import React from "react";

type DeckCardProps = {
  suit: string;
  rank: string;
  width?: string;
  height?: string;
  classNames?: string;
};

const DeckCard: React.FC<DeckCardProps> = ({
  suit,
  rank,
  width,
  height,
  classNames,
}) => {
  const faceDown = suit === "empty" || rank === "empty";

  const renderSuit = () => {
    switch (suit) {
      case "H":
        return <FaHeart className="text-red-500" />;
      case "D":
        return <RiPokerDiamondsFill className="text-red-500" />;
      case "C":
        return <RiPokerClubsFill className="text-black" />;
      case "S":
        return <RiPokerSpadesFill className="text-black" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`relative ${width} ${height} ${classNames} transform rounded-lg border-2 border-black shadow-lg transition-transform duration-300 ${
        faceDown ? "bg-blue-600 text-white" : "bg-white"
      } flex items-center justify-center`}
    >
      {faceDown ? (
        <div className="flex h-full w-full items-center justify-center">
          <GiPokerHand className="text-6xl" />
        </div>
      ) : (
        <div className="flex h-full w-full flex-col justify-between p-2 text-black">
          <div className="absolute left-0 top-0 flex text-lg font-bold">
            <span>{rank}</span>
          </div>
          <div className="flex h-full items-center justify-center text-xl">
            {renderSuit()}
          </div>
          <div className="absolute bottom-0 right-0 text-lg font-bold">
            <span>{rank}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeckCard;
