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

const HoleCards = ({
  tonWalletAddress,
  holeCards,
  actionStatus,
  showDown,
}: Props) => {
  const [faceDown, setFaceDown] = useState(true);
  const walletAddress = useTonAddress();
  if (!actionStatus || actionStatus === Action.WAITING) {
    return;
  }

  const onShowHoleCards = () => {
    setFaceDown(false);
  };

  return (
    <div
      className={`flex flex-row ${tonWalletAddress === walletAddress ? "space-x-0" : "-space-x-3"}`}
    >
      <PokerCard
        classNames={`${tonWalletAddress === walletAddress ? "" : "-rotate-[10deg]"}`}
        width="w-[2.8rem]"
        height="h-[3.8rem]"
        suit={holeCards[0]?.suit.toUpperCase()}
        rank={holeCards[0]?.rank.toUpperCase()}
        faceDown={faceDown}
      />
      <PokerCard
        classNames={`${tonWalletAddress === walletAddress ? "" : "rotate-[10deg]"}`}
        width="w-[2.8rem]"
        height="h-[3.8rem]"
        suit={holeCards[1]?.suit.toUpperCase()}
        rank={holeCards[1]?.rank.toUpperCase()}
        faceDown={faceDown}
      />
      {holeCards[0] &&
        faceDown &&
        holeCards[1] &&
        tonWalletAddress === walletAddress && (
          <button
            onClick={() => {
              onShowHoleCards();
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white p-1"
          >
            <p className="text-xs">查看</p>
          </button>
        )}
    </div>
  );
};

export default HoleCards;
