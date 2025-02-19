"use client";

import { TonConnectButton } from "@tonconnect/ui-react";
import React, { useEffect } from "react";
import { useTonWallet } from "@tonconnect/ui-react";

const ConnectWallet = () => {
  const walletAddress = useTonWallet();
  const wallet = useTonWallet();
  useEffect(() => {
    if (wallet && walletAddress) {
      console.log(walletAddress);
    }
  }, [wallet, walletAddress]);

  return (
    <div>
      <TonConnectButton />
    </div>
  );
};

export default ConnectWallet;
