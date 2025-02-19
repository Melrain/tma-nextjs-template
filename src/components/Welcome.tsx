"use client";

import { TonConnectButton, useTonWallet } from "@tonconnect/ui-react";
import React from "react";
import Link from "next/link";
import { DicesIcon } from "lucide-react";
import { GiPokerHand } from "react-icons/gi";
import ConnectWallet from "./shared/ConnectWallet";
import { Button } from "./ui/button";

const Welcome = () => {
  const wallet = useTonWallet();

  return (
    <div className="flex flex-col justify-center space-y-6 items-center h-screen">
      <h1>Welcome!</h1>
      <div>
        <ConnectWallet />
      </div>
      <div className="flex flex-col space-y-6 justify-center items-center">
        <Button
          disabled={!wallet}
          className="flex justify-center p-2 shadow-sm shadow-white rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500  items-center flex-row space-x-2">
          <DicesIcon />
          <span>Go to Dice</span>
        </Button>
        <Button
          disabled={!wallet}
          className="flex justify-center p-2 shadow-sm shadow-white rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500  items-center flex-row space-x-2">
          <GiPokerHand />
          <span>Go to Poker</span>
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
