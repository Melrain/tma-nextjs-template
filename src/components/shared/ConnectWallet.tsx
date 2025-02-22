"use client";

import {
  TonConnectButton,
  useTonWallet,
  useTonAddress,
} from "@tonconnect/ui-react";
import React, { useEffect } from "react";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import axios from "axios";

const ConnectWallet = () => {
  const [username, setUsername] = React.useState("");
  const { initData } = retrieveLaunchParams();
  const walletAddress = useTonAddress();
  const wallet = useTonWallet();

  useEffect(() => {
    const init = async () => {
      try {
        if (!wallet) {
          return setUsername("请登录");
        }
        if (initData && initData.user && initData.user.username) {
          setUsername(initData.user.username);
        }
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, [initData, wallet, walletAddress]);

  useEffect(() => {
    if (walletAddress) {
      // add user to db
      axios.post("http://localhost:8080/api/user/login", {
        username: initData?.user?.username,
        walletAddress: walletAddress,
        avatar: initData?.user?.photoUrl,
      });
    }
  }, [initData?.user?.photoUrl, initData?.user?.username, walletAddress]);

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
