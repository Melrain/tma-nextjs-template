"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { initData, parseInitData } from "@telegram-apps/sdk-react";
import { useTonAddress } from "@tonconnect/ui-react";

export function useUser() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const tonWalletAddress = useTonAddress();
  const userData = parseInitData(initData.raw());

  useEffect(() => {
    const fetchUser = async () => {
      const { id, firstName, photoUrl } = userData.user || {};
      if (!id || !firstName) return;

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/user/login`,
          {
            userId: id,
            username: firstName,
            walletAddress: tonWalletAddress,
            avatar: photoUrl,
          },
        );
        if (res.data) setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [
    tonWalletAddress,
    userData?.user?.id,
    userData?.user?.firstName,
    userData.user,
  ]);

  return {
    user,
    userData,
  };
}
