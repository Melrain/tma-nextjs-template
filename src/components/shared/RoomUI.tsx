"use client";

import React from "react";

interface Player {
  id: number;
  name: string;
  chips: number;
}

interface Props {
  players: Player[];
}

const RoomUI = ({ players }: Props) => {
  // 定义每个玩家的位置（顺时针，最多6个）
  const positions = [
    "bottom-4 left-4 transform -translate-y-3/4 ",
    "bottom-1/2 left-4 transform translate-y-full",
    "top-1/3 left-4 transform -translate-y-full",
    "top-4 left-1/2 transform -translate-x-1/2",
    "top-1/3 right-4 transform -translate-y-full",
    "bottom-1/2 right-4 transform translate-y-full",
  ];

  return (
    <div className="relative w-full h-screen bg-green-700">
      {/* 渲染每个玩家 */}
      {players.map((player, index) => (
        <div
          key={player.id}
          className={`absolute ${positions[index]} flex items-center justify-center w-24 h-24 bg-white border-2 border-gray-800 rounded-full shadow-md`}>
          <div className="text-center">
            <div className="font-bold text-sm text-black">{player.name}</div>
            <div className="text-xs text-gray-600">{player.chips} chips</div>
          </div>
          <div
            className={`absolute  ${
              index === 0 ? "bottom-1/3 -right-20" : "bottom-0"
            } text-black`}>
            cards
          </div>
        </div>
      ))}

      {/* 添加公共牌区域 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full flex items-center justify-center w-3/5 h-24 bg-gray-200 border-2 border-gray-800 rounded-lg shadow-md">
        <div className="text-center text-lg font-bold text-black">
          公共牌区域
        </div>
      </div>

      {/* 新增玩家行动UI区域 */}
      <div className="absolute bottom-0 left-0 w-full bg-gray-800 text-white py-4 flex justify-center items-center">
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-red-600 rounded hover:bg-red-500">
            弃牌
          </button>
          <button className="px-4 py-2 bg-green-600 rounded hover:bg-green-500">
            过牌
          </button>
          <button className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-500">
            跟注
          </button>
          <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">
            加注
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomUI;
