"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSocket } from "@/components/Game/SocketContext";
import { CODE } from "@/types/GameTypes";
import Link from "next/link";
import { initData, parseInitData } from "@telegram-apps/sdk-react";
import { getSeatPosition, reorderPlayerList } from "@/utils/fn";
import Image from "next/image";
import HoleCards from "@/components/shared/HoleCards";
import PlayerUI from "@/components/Game/PlayerUI";

type GameParams = {
  gameId: string;
};

const Page = () => {
  const { gameId } = useParams() as GameParams;
  const [isConnected, setIsConnected] = useState(false);
  const userData = parseInitData(initData.raw());

  const socket = useSocket();

  const positions = [
    "bottom-4 left-4 transform -translate-y-3/4 ",
    "bottom-1/2 left-4 transform translate-y-full",
    "top-1/4 left-4 transform -translate-y-full",
    "top-4 left-1/2 transform -translate-x-1/2",
    "top-1/4 right-4 transform -translate-y-full",
    "bottom-1/2 right-4 transform translate-y-full",
  ];

  useEffect(() => {
    setIsConnected(socket.connected);

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.emit(CODE.REDIS_HASH_GET_GAME, {
      gameId,
      userId: userData.user?.id,
    });

    socket.on(CODE.REDIS_PRIVATE_DATA + gameId + userData.user?.id, (data) => {
      console.log("privateData:", data);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off(CODE.REDIS_PRIVATE_DATA + gameId + userData.user?.id);
    };
  }, [gameId, socket, userData.user?.id]);

  if (!isConnected) {
    return <div>Connecting...</div>;
  }

  return (
    <div className="relative h-screen w-full bg-green-700">
      <Link href={"/"} className="absolute right-2 top-0">
        Home
      </Link>
      <div>
        {positions.map((position, index) => (
          <div key={position}>
            <PlayerUI
              positionCss={position}
              index={index}
              handCards={[
                {
                  rank: "2",
                  suit: "s",
                },
                {
                  rank: "A",
                  suit: "h",
                },
              ]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
