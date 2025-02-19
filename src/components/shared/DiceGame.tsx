"use client";

import { useTonWallet } from "@tonconnect/ui-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const DiceGame = () => {
  const wallet = useTonWallet();
  const router = useRouter();

  useEffect(() => {
    if (!wallet) {
      router.push("/");
    }
  }, [wallet, router]);

  if (!wallet) {
    return <div>Redirecting...</div>;
  }

  return <div>DiceGame</div>;
};

export default DiceGame;
