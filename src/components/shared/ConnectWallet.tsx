"use client";

import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import React, { useEffect } from "react";
import { initData, parseInitData } from "@telegram-apps/sdk-react";
import axios from "axios";

const ConnectWallet = () => {
  const [userBalance, setUserBalance] = React.useState(0);
  const walletAddress = useTonAddress();
  const _initData = parseInitData(initData.raw());
  // console.log("initData:", parseInitData(initData.raw()));

  useEffect(() => {
    const addUserToDb = async () => {
      try {
        if (walletAddress) {
          // add user to db
          const response = await axios.post(
            "http://localhost:8080/api/user/login",
            {
              username: _initData.user?.firstName || "user",
              walletAddress: walletAddress,
              avatar:
                _initData.user?.photoUrl || "https://www.gravatar.com/avatar/",
            },
          );

          setUserBalance(response.data.balance);
          console.log("response:", response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    addUserToDb();
  }, [_initData.user?.firstName, _initData.user?.photoUrl, walletAddress]);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 rounded-lg bg-black-300 p-4 text-white">
      <p>user card:</p>
      <p>name:{_initData.user?.firstName || "just user"}</p>
      <p>balance:{userBalance}</p>
      <div>
        <TonConnectButton />
      </div>
    </div>
  );
};

export default ConnectWallet;
