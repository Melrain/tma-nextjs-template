"use client";

import React from "react";
import PokerCard from "./PokerCard";

interface Props {
  tonWalletAddress: string;
  holeCards: string[];
  seatNumber: number;
}

const HoleCards = ({ tonWalletAddress, holeCards, seatNumber }: Props) => {
  return (
    <div
      className={`flex flex-row ${seatNumber === 0 ? "space-x-0" : "-space-x-3"}`}
    >
      <PokerCard
        classNames={`${seatNumber === 0 ? "" : "-rotate-[10deg]"}`}
        width="w-[2.8rem]"
        height="h-[3.8rem]"
        suit="H"
        rank="A"
        faceDown={false}
      />
      <PokerCard
        classNames={`${seatNumber === 0 ? "" : "rotate-[10deg]"}`}
        width="w-[2.8rem]"
        height="h-[3.8rem]"
        suit="H"
        rank="A"
        faceDown={false}
      />
    </div>
  );
};

export default HoleCards;
