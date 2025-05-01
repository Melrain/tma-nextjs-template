// app/game/layout.tsx
"use client";

import { useEffect } from "react";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // 设置 CSS 变量 --vh，用于解决 iOS 100vh 包含导航栏问题
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVH();
    window.addEventListener("resize", setVH);
    return () => window.removeEventListener("resize", setVH);
  }, []);

  return (
    <div
      className="fixed inset-0 w-full overflow-hidden bg-gradient-to-b from-gray-950 via-purple-950 text-white"
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
      {children}
    </div>
  );
}
