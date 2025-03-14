"use client";

import React, { useEffect, useState } from "react";
import { Web3Auth, decodeToken } from "@web3auth/single-factor-auth";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useTelegramMock } from "@/hooks/useTelegramMock";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { CommonPrivateKeyProvider } from "@web3auth/base-provider";

import axios from "axios";
import TonRPC from "./TonRPC";

const verifier = "w3a-telegram-demo";
const clientId =
  "BPdviJRbwIueM5DwTcRTnrKsXTr1mGY8Wl53AF0mmho_kVGDoZ2KqqAPDcvevteyNWj4mrk8207SrXwUpg_jtqo";

const Web3AuthComponent = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [web3authSfa, setWeb3authSfa] = useState<Web3Auth | null>(null);
  const [web3AuthInitialized, setWeb3AuthInitialized] = useState(false);
  const [userData, setUserData] = useState<any | null>(null);
  const [tonAccountAddress, setTonAccountAddress] = useState<string | null>(
    null,
  );
  const [signedMessage, setSignedMessage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { initDataRaw, initData, themeParams } = useLaunchParams() || {};

  useTelegramMock();

  useEffect(() => {
    const initializeWeb3Auth = async () => {
      try {
        console.log("Fetching TON Testnet RPC endpoint...");
        const testnetRpc = await getHttpEndpoint({
          network: "testnet",
          protocol: "json-rpc",
        });

        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.OTHER,
          chainId: "testnet",
          rpcTarget: testnetRpc,
          displayName: "TON Testnet",
          blockExplorerUrl: "https://testnet.tonscan.org",
          ticker: "TON",
          tickerName: "Toncoin",
        };

        const privateKeyProvider = new CommonPrivateKeyProvider({
          config: { chainConfig },
        });

        // Initialize Web3Auth
        const web3authInstance = new Web3Auth({
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
          usePnPKey: false,
          privateKeyProvider,
        });

        setWeb3authSfa(web3authInstance);

        console.log("Initializing Web3Auth...");
        await web3authInstance.init();
        console.log("Web3Auth initialized.");

        setWeb3AuthInitialized(true);
      } catch (error) {
        console.error("Error fetching TON Testnet RPC endpoint: ", error);
      }
    };

    initializeWeb3Auth();
  }, []);

  // connect to web3auth
  useEffect(() => {
    const connectWeb3Auth = async () => {
      if (web3authSfa && web3AuthInitialized && initDataRaw) {
        setIsLoggingIn(true);
        try {
          if (web3authSfa.status === "connected") {
            await web3authSfa.logout();
          }

          const idToken = await axios.post(
            "http://localhost:8080/api/auth/telegram",
            {
              initDataRaw: initDataRaw,
              isMocked: false,
              photoUrl: initData?.user?.photoUrl,
            },
          ); // Fetch ID token
          const { payload }: { payload: { sub: string } } = decodeToken(
            idToken.data,
          );

          await web3authSfa.connect({
            verifier,
            verifierId: payload.sub,
            idToken: idToken.data,
          });

          setUserData(payload);
          setIsLoggedIn(true);

          const tonRpc = new TonRPC(web3authSfa.provider!);
          const tonAddress = await tonRpc.getAccounts();
          setTonAccountAddress(tonAddress);

          const signedMsg = await tonRpc.signMessage("Hello, TON!");
          setSignedMessage(signedMsg);
        } catch (error) {
          console.error("Error during Web3Auth connection:", error);
        } finally {
          setIsLoggingIn(false);
        }
      }
    };

    if (web3AuthInitialized && initDataRaw) {
      connectWeb3Auth();
    }
  }, [initDataRaw, web3authSfa, web3AuthInitialized, initData?.user?.photoUrl]);

  const userInfoBox = (
    <div className="user-info-box">
      <img
        src={userData?.avatar_url}
        alt="User avatar"
        className="user-avatar"
      />
      <div className="user-info">
        <p>
          <strong>ID:</strong> {userData?.telegram_id}
        </p>
        <p>
          <strong>Username:</strong> {userData?.username}
        </p>
        <p>
          <strong>Name:</strong> {userData?.name}
        </p>
      </div>
    </div>
  );

  const tonAccountBox = (
    <div className="info-box">
      <p>
        <strong>TON Account:</strong> {tonAccountAddress}
      </p>
    </div>
  );

  const signedMessageBox = (
    <div className="info-box">
      <p>
        <strong>Signed Message:</strong> {signedMessage}
      </p>
    </div>
  );

  return (
    <div className="container">
      <h1 className="title">Web3Auth TON Telegram MiniApp</h1>
      {isLoggedIn ? (
        <>
          {userInfoBox}
          {tonAccountBox}
          {signedMessageBox}
        </>
      ) : (
        <div>loading...</div>
      )}
    </div>
  );
};

export default Web3AuthComponent;
