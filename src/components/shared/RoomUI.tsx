"use client";

import React, { useState } from "react";
import PokerCard from "./PokerCard";
import HoleCards from "./HoleCards";
import { Button } from "../ui/button";
import { Socket } from "socket.io-client";
import axios from "axios";
import { useTonAddress } from "@tonconnect/ui-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import { CardType } from "@/types/CardType";

interface IPlayer {
  playerId: string;
  playerName: string;
  tonWalletAddress: string;
  avatar: string;
  chipsInGame: number;
  currentBet: number;
  holeCards: CardType[];
  actionStatus: string;
}

interface Props {
  players: IPlayer[];
  communicateCards: CardType[];
  roomId: string;
  minBuyIn: number;
  maxBuyIn: number;
  potSize: number;
  gameStatus: string;
}

const RoomUI = ({
  roomId,
  players,
  communicateCards,
  minBuyIn,
  maxBuyIn,
  potSize,
  gameStatus,
}: Props) => {
  const [buyInAmount, setBuyInAmount] = useState(maxBuyIn);

  const tonAddress = useTonAddress();

  if (!tonAddress) {
    return <div>you need to connect to ton wallet</div>;
  }

  const onSit = async () => {
    try {
      console.log("sitting");
      const response = await axios.post(
        "http://localhost:8080/api/poker-room/sit",
        {
          tonAddress,
          roomId,
          chips: buyInAmount,
        },
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const onLeaveRoom = async () => {
    try {
      await axios.post("http://localhost:8080/api/poker-room/leave", {
        tonAddress,
        roomId,
      });
    } catch (error) {
      console.error(error);
    }
  };

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
                    showDown={false}
                    tonWalletAddress={player.tonWalletAddress}
                    holeCards={player.holeCards}
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
                  <PopoverTrigger>
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
                    onClick={() => onSit()}
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
      </div>

      {/* 新增玩家行动UI区域 */}

      {players[0]?.tonWalletAddress === tonAddress &&
      players[0]?.actionStatus !== "waiting" ? (
        <div className="absolute bottom-0 left-0 flex w-full items-center justify-center py-6 text-white">
          <div className="flex space-x-4">
            <button className="rounded bg-red-600 px-4 py-2 hover:bg-red-500">
              弃牌
            </button>
            <button className="rounded bg-green-600 px-4 py-2 hover:bg-green-500">
              过牌
            </button>
            <button className="rounded bg-yellow-600 px-4 py-2 hover:bg-yellow-500">
              跟注
            </button>
            <button className="rounded bg-blue-600 px-4 py-2 hover:bg-blue-500">
              加注
            </button>
          </div>
        </div>
      ) : (
        <div className="absolute bottom-0 left-0 flex w-full items-center justify-center py-6 text-white">
          waiting for your turn...
        </div>
      )}
      {players[0]?.tonWalletAddress === tonAddress && (
        <div className="absolute right-0 top-0 flex items-center justify-center">
          <Button
            onClick={() => {
              onLeaveRoom();
            }}
          >
            Leave Room
          </Button>
        </div>
      )}
      <div className="absolute left-0 top-0 flex items-center justify-center">
        {gameStatus}
      </div>
    </div>
  );
};

export default RoomUI;
