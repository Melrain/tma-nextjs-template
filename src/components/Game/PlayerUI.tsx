"use client";

import React from "react";
import Image from "next/image";

import PokerCard from "../shared/PokerCard";
import { Card, GamePhase, PlayerAction, PlayerStatus } from "@/types/GameTypes";
import { CircularCountdown } from "../Game/CountDownUI";
import { initData, parseInitData } from "@telegram-apps/sdk-react";

interface PlayerUIProps {
  username: string;
  avatar: string;
  positionCss: string;
  index: number;
  handCards: Card[];
  totalChips: number;
  bigBlind: number;
  currentAction: PlayerAction | null;
  isDealer: boolean;
  playerId: string;
  currentPlayerId: string;
  gameId: string;
  currentMinBet: number;
  playerChips: number;
  gamePhase: GamePhase;
  playerCurrentBet: number;
  playerStatus: PlayerStatus;
}

const PlayerUI = ({
  positionCss,
  index,
  handCards,
  username,
  avatar,
  currentAction,
  totalChips,
  bigBlind,
  isDealer,
  playerId,
  currentPlayerId,
  gameId,
  currentMinBet,
  gamePhase,
  playerCurrentBet,
  playerStatus,
}: PlayerUIProps) => {
  const userData = parseInitData(initData.raw());
  const userId = String(userData.user?.id || "");

  return (
    <div
      key={index}
      className={`absolute ${positionCss} flex size-20 items-center justify-center rounded-full border-2 border-gray-800 bg-white shadow-md`}
    >
      <Image
        className="absolute -z-50 size-full rounded-full"
        width={100}
        height={100}
        src={avatar}
        alt={"avatar"}
      />

      {/* 倒计时圈 - 仅当前行动玩家显示 */}
      {playerId === currentPlayerId && (
        <div className="absolute -left-2 -top-2 z-10">
          <CircularCountdown
            gameId={gameId}
            playerId={playerId}
            currentPlayerId={currentPlayerId}
            total={30}
          />
        </div>
      )}

      <div
        className={`absolute ${
          index === 0 ? "-right-24 bottom-2" : "bottom-0"
        } text-black`}
      >
        <div
          className={`absolute flex translate-x-2 flex-row space-x-1 ${index === 0 ? "-right-10 bottom-1" : "-right-9 bottom-0"}`}
        >
          {handCards.length > 0 &&
            handCards.map((card, cardIndex) => (
              <div key={cardIndex}>
                <PokerCard
                  gamePhase={gamePhase}
                  suit={card.suit.toUpperCase()}
                  rank={card.rank.toUpperCase()}
                  width={`${index === 0 ? "w-[3.5rem]" : "w-[2.8rem]"}`}
                  height={`${index === 0 ? "h-[4.9rem]" : "h-[3.92rem]"}`}
                  classNames={`${
                    index === 0
                      ? ""
                      : `${cardIndex === 0 ? "-rotate-[10deg] translate-x-2" : "rotate-[10deg] -translate-x-2"}`
                  }`}
                />
              </div>
            ))}
        </div>
      </div>

      {/* dealer 标记 */}
      {isDealer && (
        <div
          className={`${dealerMarkPosition[index]} z-50 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs`}
        >
          <span className="text-white">D</span>
        </div>
      )}

      {/* 当前下注额 */}
      {playerCurrentBet > 0 && (
        <div className={`${betLabelPosition[index]} z-50`}>
          {playerCurrentBet}
        </div>
      )}
      {/* 动作标签 */}
      {currentAction && currentAction.type !== 5 && (
        <div
          className={`${actionLabelPosition[index]} flex flex-col items-center justify-center text-xs`}
        >
          <span>{actionLabel(currentAction.type)}</span>
          <span>{currentAction.amount > 0 && currentAction.amount}</span>
        </div>
      )}

      {/* 名字和筹码 */}
      <div className="absolute -bottom-2 flex w-full flex-col items-center justify-center rounded-lg bg-black text-center shadow-white">
        <span className="w-full rounded-full border-[1px] border-white text-xs">
          {username}
        </span>
        <span className="text-xs">{totalChips / bigBlind} BB</span>
      </div>
    </div>
  );
};

export default PlayerUI;

const actionLabelPosition = [
  "absolute top-5 -right-5",
  "absolute top-5 -right-5",
  "absolute top-5 -right-5",
  "absolute -bottom-5",
  "absolute top-5 -left-5",
  "absolute top-5 -left-5",
];

const dealerMarkPosition = [
  "absolute -top-5 -right-2",
  "absolute top-15 -right-10",
  "absolute top-15 -right-10",
  "absolute -bottom-15",
  "absolute top-15 -left-10",
  "absolute top-15 -left-10",
];

const betLabelPosition = [
  "absolute -top-5 -right-5",
  "absolute top-5 -right-5",
  "absolute top-5 -right-5",
  "absolute -bottom-5",
  "absolute top-5 -left-5",
  "absolute top-5 -left-5",
];

const actionLabel = (actionIndex: number) => {
  switch (actionIndex) {
    case 0:
      return "Call";
    case 1:
      return "Raise";
    case 2:
      return "Check";
    case 3:
      return "Fold";
    case 4:
      return "All In";
    case 5:
      return "null";
    default:
      return "";
  }
};
