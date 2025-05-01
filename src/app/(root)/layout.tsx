/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { SocketProvider } from "@/components/Game/SocketContext";
import { initData, parseInitData } from "@telegram-apps/sdk-react";
import { useTonAddress } from "@tonconnect/ui-react";
import { viewport } from "@telegram-apps/sdk";
import { useRouter } from "next/navigation";
import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const _initData = parseInitData(initData.raw());
  const tonWalletAddress = useTonAddress();
  const params = {
    url: process.env.NEXT_PUBLIC_SOCKET_URL!,
    userId: _initData.user?.id || "0",
    username: _initData.user?.firstName || "user",
    initDataRaw: initData.raw(),
  };

  return (
    <SocketProvider
      url={params.url}
      userId={params.userId.toString()}
      initDataRaw={params.initDataRaw?.toString() || ""}
      username={params.username}
      tonWalletAddress={tonWalletAddress}
    >
      <main className="min-h-screen w-full max-w-[100vw] overflow-x-hidden">
        {children}
      </main>
    </SocketProvider>
  );
};

export default layout;
