"use client";

import React from "react";
import PokerCard from "./PokerCard";
import HoleCards from "./HoleCards";
interface Player {
  id: number;
  name: string;
  chips: number;
}

interface Props {
  players: Player[];
  communicateCards: string[];
}

const RoomUI = ({ players, communicateCards }: Props) => {
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
      {/* 渲染每个玩家 */}
      {players.map((player, index) => (
        <div
          key={player.id}
          className={`absolute ${positions[index]} flex size-20 items-center justify-center rounded-full border-2 border-gray-800 bg-white shadow-md`}
        >
          <div
            className={`absolute ${
              index === 0 ? "-right-24 bottom-2" : "bottom-0"
            } text-black`}
          >
            <HoleCards
              tonWalletAddress={""}
              holeCards={[]}
              seatNumber={index}
            />
          </div>
          <div className="absolute -bottom-2 flex w-full flex-col items-center justify-center rounded-lg bg-black text-center shadow-white">
            <span className="w-full rounded-full border-[1px] border-white text-xs">
              {player.name}
            </span>
            <span className="text-xs">{player.chips} BB</span>
          </div>
        </div>
      ))}

      {/* 添加公共牌区域 */}
      <div className="h-22 absolute left-1/2 top-1/2 flex w-[73%] -translate-x-1/2 -translate-y-full transform flex-col items-center justify-center space-y-2 rounded-lg">
        <div className="flex flex-1 flex-row items-start justify-start space-x-2">
          {communicateCards.map((card, index) => (
            <PokerCard
              width="w-[3.8rem]"
              height="h-[5rem]"
              key={index}
              suit={card[0]}
              rank={card.slice(1)}
              faceDown={false}
            />
          ))}
        </div>
        {/* 底池部分 */}
        <p>PotSize:1000</p>
      </div>

      {/* 新增玩家行动UI区域 */}
      <div className="absolute bottom-0 left-0 flex w-full items-center justify-center bg-gray-800 py-2 text-white">
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
    </div>
  );
};

export default RoomUI;
