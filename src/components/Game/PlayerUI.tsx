"use client";

import React from "react";
import Image from "next/image";
import { CardType } from "@/types/CardType";

interface PlayerUIProps {
  positionCss: string;
  index: number;
  hands: CardType[];
}
const PlayerUI = ({ positionCss, index, hands }: PlayerUIProps) => {
  return (
    <div
      key={index}
      className={`absolute ${positionCss} flex size-20 items-center justify-center rounded-full border-2 border-gray-800 bg-white shadow-md`}
    >
      <Image
        className="absolute -z-50 size-full rounded-full"
        width={100}
        height={100}
        src={"https://www.gravatar.com/avatar/"}
        alt="avatar"
      />
      <div
        className={`absolute ${
          index === 0 ? "-right-24 bottom-2" : "bottom-0"
        } text-black`}
      >
        {/* hands */}
        <div
          className={`absolute ${index === 0 ? "-right-24 bottom-2" : "bottom-0"}`}
        >
          {}
        </div>
      </div>
      <div className="absolute -bottom-2 flex w-full flex-col items-center justify-center rounded-lg bg-black text-center shadow-white">
        <span className="w-full rounded-full border-[1px] border-white text-xs">
          melrain
        </span>
        <span className="text-xs">100 BB</span>
      </div>
    </div>
  );
};

export default PlayerUI;
