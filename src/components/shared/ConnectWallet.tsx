"use client";

import {
  TonConnectButton,
  useTonWallet,
  useTonAddress,
} from "@tonconnect/ui-react";
import React, { useEffect } from "react";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

const ConnectWallet = () => {
  const [username, setUsername] = React.useState("");
  const { initData } = retrieveLaunchParams();
  const walletAddress = useTonAddress();
  const wallet = useTonWallet();
  useEffect(() => {
    if (!wallet) {
      return setUsername("请登录");
    }
    if (initData && initData.user && initData.user.username) {
      setUsername(initData.user.username);
    }
  }, [initData, wallet, walletAddress]);

  return (
    <div className="flex flex-col text-white space-y-6 justify-center items-center">
      <p>{username}</p>
      <div>
        <TonConnectButton />
      </div>
    </div>
  );
};

export default ConnectWallet;
