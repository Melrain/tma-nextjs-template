"use client";

import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import React, { useState } from "react";
import { DicesIcon } from "lucide-react";
import { GiPokerHand } from "react-icons/gi";
import ConnectWallet from "./shared/ConnectWallet";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const Welcome = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const wallet = useTonWallet();
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center space-y-6 items-center h-screen">
      <h1>Welcome!</h1>
      <div>
        <ConnectWallet />
      </div>
      <div className="flex flex-col space-y-6 justify-center items-center">
        <Button
          onClick={() => router.push("/poker-rooms")}
          disabled={!wallet}
          className="flex justify-center p-2 shadow-sm shadow-white rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500  items-center flex-row space-x-2">
          <GiPokerHand />
          <span>Go to Poker</span>
        </Button>
        <Button
          onClick={() => router.push("/create-poker-room")}
          disabled={!wallet}
          className="flex justify-center p-2 shadow-sm shadow-white rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500  items-center flex-row space-x-2">
          <GiPokerHand />
          <span>创建房间</span>
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
