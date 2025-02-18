"use client";

import { useTonWallet } from "@tonconnect/ui-react";
import React, { useEffect, useState } from "react";

const ConnectButton = () => {
  const [isConnected, setIsConnected] = useState(false);
  const wallet = useTonWallet();

  useEffect(() => {
    if (wallet) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [wallet]);

  return (
    <div>
      <ConnectButton />
    </div>
  );
};

export default ConnectButton;
