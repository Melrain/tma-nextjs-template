"use client";

import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import React, { useEffect } from "react";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import axios from "axios";
import { useUserStore } from "@/store";

const ConnectWallet = () => {
  const [userBalance, setUserBalance] = React.useState(0);
  const { initData } = retrieveLaunchParams();
  const walletAddress = useTonAddress();

  const { username, setUsername } = useUserStore();

  useEffect(() => {
    const addUserToDb = async () => {
      try {
        if (walletAddress) {
          // add user to db
          const response = await axios.post(
            "http://localhost:8080/api/user/login",
            {
              username: initData?.user?.username,
              walletAddress: walletAddress,
              avatar:
                initData?.user?.photoUrl ||
                "https://rose-just-skunk-656.mypinata.cloud/ipfs/bafkreifvoiet4ojth3p2vemdz3dglw2mfuyivkps6pgi4axpg2g2tjl3wi",
            }
          );

          setUsername(response.data.username);
          setUserBalance(response.data.balance);
          console.log("response:", response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    addUserToDb();
  }, [
    initData?.user?.photoUrl,
    initData?.user?.username,
    setUsername,
    walletAddress,
  ]);

  return (
    <div className="flex bg-black-300 rounded-lg p-4 flex-col text-white space-y-6 justify-center items-center">
      <p>user card:</p>
      <p>name:{username}</p>
      <p>balance:{userBalance}</p>
      <div>
        <TonConnectButton />
      </div>
    </div>
  );
};

export default ConnectWallet;
