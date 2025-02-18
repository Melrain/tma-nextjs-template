"use client";

import { TonConnectButton } from "@tonconnect/ui-react";

import React from "react";
import AllPokerRooms from "./shared/AllPokerRooms";

const Welcome = () => {
  return (
    <div className="flex flex-col justify-center space-y-6 items-center h-screen">
      <TonConnectButton />
      <AllPokerRooms />
    </div>
  );
};

export default Welcome;
