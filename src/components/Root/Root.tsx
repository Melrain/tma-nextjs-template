"use client";

import { type PropsWithChildren, useEffect, useState } from "react";
import {
  initData,
  miniApp,
  useLaunchParams,
  useSignal,
} from "@telegram-apps/sdk-react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { AppRoot } from "@telegram-apps/telegram-ui";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ErrorPage } from "@/components/ErrorPage";
import { useTelegramMock } from "@/hooks/useTelegramMock";
import { useDidMount } from "@/hooks/useDidMount";
import { useClientOnce } from "@/hooks/useClientOnce";
import { setLocale } from "@/core/i18n/locale";
import { init } from "@/core/init";

import {
  isChangingFullscreen,
  requestFullscreen,
  viewport,
} from "@telegram-apps/sdk";

import "./styles.css";
import { useRouter } from "next/navigation";
import Link from "next/link";

function RootInner({ children }: PropsWithChildren) {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTelegramMock();
  }

  const lp = useLaunchParams();
  const debug = isDev || lp.startParam === "debug";

  useClientOnce(() => {
    init(debug);
  });

  const isDark = useSignal(miniApp.isDark);
  const initDataUser = useSignal(initData.user);
  const [showFullscreenButton, setShowFullscreenButton] = useState(false);

  // 设置语言
  useEffect(() => {
    if (initDataUser) {
      setLocale(initDataUser.languageCode);
    }
  }, [initDataUser]);

  // 尝试自动请求全屏
  useEffect(() => {
    const tryFullScreen = async () => {
      if (viewport.mount.isAvailable() && !viewport.isMounting()) {
        await viewport.mount();
        viewport.requestFullscreen;
        viewport.expand();
      }
    };

    tryFullScreen();
  }, []);

  // 手动触发全屏
  const handleManualFullscreen = async () => {
    if (requestFullscreen.isAvailable() && !isChangingFullscreen()) {
      try {
        await requestFullscreen();
        setShowFullscreenButton(false); // 隐藏按钮
      } catch (err) {
        console.warn("[⚠️ 手动全屏失败]", err);
      }
    }
  };

  const manifestUrl =
    "https://rose-just-skunk-656.mypinata.cloud/ipfs/bafkreia5ycr47j5ffcyvyyxxlkiqj4nxaraejlzhfyr2tnrevv542aqdvq";

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <AppRoot
        appearance={isDark ? "dark" : "light"}
        platform={["macos", "ios"].includes(lp.platform) ? "ios" : "base"}
      >
        {/* 全屏按钮（如果自动失败） */}
        {showFullscreenButton && (
          <button
            onClick={handleManualFullscreen}
            className="fixed right-4 top-4 z-50 rounded bg-black px-4 py-2 text-white shadow"
          >
            点击进入全屏
          </button>
        )}
        {children}
      </AppRoot>
    </TonConnectUIProvider>
  );
}

export function Root(props: PropsWithChildren) {
  const didMount = useDidMount();

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>
      <RootInner {...props} />
    </ErrorBoundary>
  ) : (
    <div className="flex h-screen flex-col items-center justify-center space-y-6 text-white">
      <div>Loading...</div>
      <Link href={"/"}>home</Link>
    </div>
  );
}
