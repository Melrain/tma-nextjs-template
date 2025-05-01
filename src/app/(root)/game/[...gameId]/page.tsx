"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useGameParams } from "@/hooks/useGameParams";
import { useGameSocket } from "@/hooks/useGameSocket";
import PlayerUI from "@/components/Game/PlayerUI";
import { GamePhase, IPlayer, PlayerStatus } from "@/types/GameTypes";
import ActionPanel from "@/components/Game/ActionPanel";
import PublicCards from "@/components/Game/PublicCards";
import { useFlyingChips } from "@/hooks/useFlyingChips";
import FlyingChip from "@/components/Game/FlyingChip";
import SettlementModal from "@/components/Game/SettlementModal";
import { AnimatePresence, motion } from "framer-motion";

const positions = [
  "bottom-4 left-4 transform -translate-y-3/4 ",
  "bottom-1/2 left-4 transform translate-y-full",
  "top-1/4 left-4 transform -translate-y-full",
  "top-4 left-1/2 transform -translate-x-1/2",
  "top-1/4 right-4 transform -translate-y-full",
  "bottom-1/2 right-4 transform translate-y-full",
];

const Page = () => {
  const params = useGameParams();
  const gameId = params[0];
  const { chips, launchChips } = useFlyingChips();
  const playerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const potRef = useRef<HTMLDivElement>(null);
  const {
    isConnected,
    players,
    userData,
    availableActions,
    gameData,
    onLeaveGame,
    onResetGame,
    currentMaxBet,
    currentHighestChips,
  } = useGameSocket(gameId);

  const selfPlayer = players.find((p) => p.playerId === userData?.user?.id);

  if (!isConnected) {
    return <div>Connecting...</div>;
  }

  return (
    <div className="fixed inset-0 w-full max-w-[100vw] overflow-hidden bg-gradient-to-b from-gray-950 via-purple-950 to-black text-white">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(255,215,0,0.15)_0%,_transparent_70%)]" />
      {/* 用户信息 & 返回按钮 */}

      <button
        onClick={() => {
          onLeaveGame();
        }}
      >
        Leave Game
      </button>
      <button
        className="ml-20"
        onClick={() => {
          onResetGame();
        }}
      >
        reset game
      </button>
      <Link href={"/"} className="absolute right-2 top-0">
        Home
      </Link>

      {/* 玩家 UI */}
      <div>
        {positions.map((position, index) => {
          const player: IPlayer = players[index];
          if (!player) return null;
          return (
            <div
              key={position}
              className="flex w-full max-w-[100vw] items-center justify-center overflow-x-hidden"
              ref={(el) => {
                playerRefs.current[index] = el;
              }}
            >
              <PlayerUI
                gameId={gameId}
                positionCss={position}
                index={index}
                handCards={player.handCards}
                username={player.username}
                avatar={player.avatar}
                totalChips={player.totalChips}
                bigBlind={gameData?.bigBlind || 1}
                currentAction={player.currentAction}
                isDealer={player.playerId === gameData?.dealerId}
                playerId={player.playerId}
                currentPlayerId={gameData?.currentPlayerId || ""}
                playerChips={player.totalChips}
                currentMinBet={gameData?.currentMinBet || 0}
                gamePhase={gameData?.gamePhase || 0}
                playerCurrentBet={player.bet}
                playerStatus={player.status}
              />
            </div>
          );
        })}
      </div>
      {/* ActionPanel */}
      <AnimatePresence>
        {selfPlayer && (
          <motion.div
            key="action-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-5 flex min-w-full items-center justify-center"
          >
            <ActionPanel
              gameId={gameId}
              currentPlayerId={gameData?.currentPlayerId || ""}
              gamePhase={gameData?.gamePhase || 0}
              playerStatus={selfPlayer.status}
              playerTotalChips={selfPlayer.totalChips}
              availableActions={availableActions}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 公共 UI */}
      <div className="absolute left-1/2 top-1/3 flex -translate-x-[50%] translate-y-[0%] flex-col items-center justify-center">
        {/* 🂠 公共牌展示 */}
        <div className="z-50 -mt-4">
          {gameData?.gamePhase !== GamePhase.Waiting && (
            <PublicCards
              publicCards={
                gameData?.communityCards || {
                  flop: [],
                  turn: null,
                  river: null,
                }
              }
              gamePhase={gameData?.gamePhase || 0}
            />
          )}
        </div>
        <div className="space-y-1 text-center text-sm text-white">
          <div ref={potRef}>💰 Pot: {gameData?.mainPot.amount}</div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
        {/* 你的 FlyingChip 渲染 */}
      </div>

      {/* Result Modal */}

      {/* <SettlementModal gameId={gameId} /> */}
    </div>
  );
};

export default Page;

const gamePhaseText = (gamePhase: number | undefined) => {
  switch (gamePhase) {
    case 0:
      return "Waiting";
    case 1:
      return "Preflop";
    case 2:
      return "Flop";
    case 3:
      return "Turn";
    case 4:
      return "River";
    case 5:
      return "Showdown";
    case 6:
      return "Ended";
    default:
      return "Unknown Phase";
  }
};
