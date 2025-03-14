"use client";

import React, { useEffect, useState } from "react";
import PokerCard from "./PokerCard";
import { useTonAddress } from "@tonconnect/ui-react";
import { Action } from "@/types/ActionStatus";
import { CardType } from "@/types/CardType";

interface Props {
  tonWalletAddress: string;
  holeCards: CardType[];
  actionStatus: string;
  showDown: boolean | null;
}

const HoleCards = ({ tonWalletAddress, holeCards, actionStatus }: Props) => {
  const walletAddress = useTonAddress();
  if (!actionStatus || actionStatus === Action.WAITING) {
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
        suit={holeCards[0].suit.toUpperCase()}
        rank={holeCards[0].rank.toLocaleUpperCase()}
        faceDown={
          tonWalletAddress === walletAddress ? holeCards[0].faceDown : true
        }
      />
      <PokerCard
        classNames={`${tonWalletAddress === walletAddress ? "" : "rotate-[10deg]"}`}
        width="w-[2.8rem]"
        height="h-[3.8rem]"
        suit={holeCards[1].suit.toLocaleUpperCase()}
        rank={holeCards[1].rank.toLocaleUpperCase()}
        faceDown={
          tonWalletAddress === walletAddress ? holeCards[0].faceDown : true
        }
      />
    </div>
  );
};

export default HoleCards;
