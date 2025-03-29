"use client";

import React, { useState } from "react";
import PokerCard from "./PokerCard";
import HoleCards from "./HoleCards";
import { Button } from "../ui/button";
import { useTonAddress } from "@tonconnect/ui-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import { CardType } from "@/types/CardType";
import { Action } from "@/types/ActionStatus";

interface IPlayer {
  playerId: string;
  playerName: string;
  tonWalletAddress: string;
  avatar: string;
  chipsInGame: number;
  currentBet: number;
  holeCards: CardType[];
  actionStatus: string;
  canAction: boolean;
  isPlaying: boolean;
}

interface Props {
  players: IPlayer[];
  communicateCards: CardType[];
  roomId: string;
  minBuyIn: number;
  maxBuyIn: number;
  potSize: number;
  gameStatus: string;
  initDataRaw: string;
  avaliableActions: Action[];
  myHoleCards: CardType[];
  currentMinBet: number;
  onSitFn: (tonAddress: string, roomId: string, chips: number) => void;
  onLeaveFn: (tonAddress: string, roomId: string) => void;
  onCheckMyHandsFn: (
    initDataRaw: string,
    roomId: string,
    tonAddress: string,
  ) => void;
  canAction: boolean;
  onActionClick: (action: string, amount?: number) => void;
}

const RoomUI = ({
  avaliableActions,
  roomId,
  players,
  communicateCards,
  minBuyIn,
  maxBuyIn,
  potSize,
  gameStatus,
  myHoleCards,
  onLeaveFn,
  onSitFn,
  canAction,
  onActionClick,
  currentMinBet,
}: Props) => {
  const [buyInAmount, setBuyInAmount] = useState(maxBuyIn);
  const [faceDown, setFaceDown] = useState(true);
  const tonAddress = useTonAddress();

  if (!tonAddress) {
    return <div>you need to connect to ton wallet</div>;
  }

  // 定义每个玩家的位置（顺时针，最多6个）
  const positions = [
    "bottom-4 left-4 transform -translate-y-3/4 ",
    "bottom-1/2 left-4 transform translate-y-full",
    "top-1/4 left-4 transform -translate-y-full",
    "top-4 left-1/2 transform -translate-x-1/2",
    "top-1/4 right-4 transform -translate-y-full",
    "bottom-1/2 right-4 transform translate-y-full",
  ];

  return (
    <div className="relative h-screen w-full bg-green-700">
      {/* 座位信息*/}
      {positions.map((position, index) => {
        const player = players[index];
        return (
          <div
            key={players[index]?.tonWalletAddress ?? index}
            className={`absolute ${position} flex size-20 items-center justify-center rounded-full border-2 border-gray-800 bg-white shadow-md`}
          >
            <Image
              className="absolute -z-50 size-full rounded-full"
              width={100}
              height={100}
              src={player ? player.avatar : "https://www.gravatar.com/avatar/"}
              alt="avatar"
            />

            {player ? (
              <>
                <div
                  className={`absolute ${
                    index === 0 ? "-right-24 bottom-2" : "bottom-0"
                  } text-black`}
                >
                  <HoleCards
                    faceDown={false}
                    showDown={false}
                    tonWalletAddress={player.tonWalletAddress}
                    holeCards={myHoleCards}
                    actionStatus={player.actionStatus}
                  />
                </div>
                <div className="absolute -bottom-2 flex w-full flex-col items-center justify-center rounded-lg bg-black text-center shadow-white">
                  <span className="w-full rounded-full border-[1px] border-white text-xs">
                    {player.playerName}
                  </span>
                  <span className="text-xs">{player.chipsInGame} BB</span>
                </div>
              </>
            ) : (
              <Popover>
                {players[0]?.tonWalletAddress !== tonAddress && (
                  <PopoverTrigger asChild>
                    <span className="text-black">Sit</span>
                  </PopoverTrigger>
                )}
                <PopoverContent className="flex flex-col items-center justify-center space-y-6">
                  <div className="flex w-full flex-row items-center justify-between">
                    <Button
                      onClick={() => {
                        setBuyInAmount(minBuyIn);
                      }}
                    >
                      {minBuyIn}
                    </Button>
                    <span>{buyInAmount}</span>
                    <Button
                      onClick={() => {
                        setBuyInAmount(maxBuyIn);
                      }}
                    >
                      {maxBuyIn}
                    </Button>
                  </div>
                  <Slider
                    defaultValue={[maxBuyIn]}
                    value={[buyInAmount]}
                    min={minBuyIn}
                    max={maxBuyIn}
                    step={1}
                    onValueChange={(value) => setBuyInAmount(value[0])}
                  />
                  <Button
                    className="w-full bg-primary-300 text-white"
                    onClick={() => onSitFn(tonAddress, roomId, buyInAmount)}
                  >
                    Sit
                  </Button>
                </PopoverContent>
              </Popover>
            )}
          </div>
        );
      })}

      {/* 添加公共牌区域 */}
      <div className="h-22 absolute left-1/2 top-1/2 flex w-[73%] -translate-x-1/2 -translate-y-full transform flex-col items-center justify-center space-y-2 rounded-lg">
        <div className="flex flex-1 flex-row items-start justify-start space-x-2">
          {communicateCards.map((card, index) => (
            <PokerCard
              width="w-[3.8rem]"
              height="h-[5rem]"
              key={card.suit + index}
              suit={card.suit}
              rank={card.rank}
              faceDown={false}
            />
          ))}
        </div>
        {/* 底池部分 */}
        <p>PotSize:{potSize}</p>
        <p>CurrentMinBet:{currentMinBet}</p>
      </div>

      {/* 新增玩家行动UI区域 */}

      {canAction &&
      players[0]?.tonWalletAddress === tonAddress &&
      players[0]?.isPlaying ? (
        <div className="absolute bottom-0 left-0 flex w-full items-center justify-center py-6 text-white">
          {avaliableActions.map((action) => (
            <Button
              key={action}
              onClick={() => {
                if (action === Action.RAISE) {
                  onActionClick(action, currentMinBet * 2);
                } else {
                  onActionClick(action);
                }
              }}
            >
              {action}
            </Button>
          ))}
        </div>
      ) : (
        <div className="absolute bottom-0 left-0 flex w-full items-center justify-center py-6 text-white">
          waiting for your turn...
        </div>
      )}
      {players[0]?.tonWalletAddress === tonAddress && (
        <div className="absolute right-0 top-0 flex items-center justify-center">
          <Button
            disabled={!canAction}
            onClick={() => {
              onLeaveFn(tonAddress, roomId);
            }}
          >
            Leave Room
          </Button>
        </div>
      )}
      <div className="absolute left-0 top-0 flex items-center justify-center space-x-2">
        {gameStatus}
      </div>
      <div className="absolute bottom-0 left-0 flex items-center justify-center">
        {canAction ? "canAction" : "cannotAction"}
        {players[0]?.isPlaying ? "isPlaying" : "isNotPlaying"}
      </div>
    </div>
  );
};

export default RoomUI;
