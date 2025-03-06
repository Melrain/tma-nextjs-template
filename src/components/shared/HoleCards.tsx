"use client";

import React from "react";
import PokerCard from "./PokerCard";
import { useTonAddress } from "@tonconnect/ui-react";

interface Props {
  tonWalletAddress: string;
  holeCards: string[];
  actionStatus: string;
}

const HoleCards = ({ tonWalletAddress, holeCards, actionStatus }: Props) => {
  const walletAddress = useTonAddress();
  if (!actionStatus || actionStatus === "waiting") {
    return;
  }
  return (
    <div
      className={`flex flex-row ${tonWalletAddress === walletAddress ? "space-x-0" : "-space-x-3"}`}
    >
      <PokerCard
        classNames={`${tonWalletAddress === walletAddress ? "" : "-rotate-[10deg]"}`}
        width="w-[2.8rem]"
        height="h-[3.8rem]"
        suit={holeCards[0].slice(0)}
        rank={holeCards[0].slice(1)}
        faceDown={false}
      />
      <PokerCard
        classNames={`${tonWalletAddress === walletAddress ? "" : "rotate-[10deg]"}`}
        width="w-[2.8rem]"
        height="h-[3.8rem]"
        suit={holeCards[1].slice(0)}
        rank={holeCards[1].slice(1)}
        faceDown={false}
      />
    </div>
  );
};

export default HoleCards;
