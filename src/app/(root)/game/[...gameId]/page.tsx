"use client";

import React from "react";
import Link from "next/link";
import { useGameParams } from "@/hooks/useGameParams";
import { useGameSocket } from "@/hooks/useGameSocket";
import PlayerUI from "@/components/Game/PlayerUI";
import { IPlayer } from "@/types/GameTypes";
import ActionPanel from "@/components/Game/ActionPanel";

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
  const {
    isConnected,
    players,
    userData,
    availableActions,
    gameData,
    onLeaveGame,
    onResetGame,
  } = useGameSocket(gameId);

  if (!isConnected) {
    return <div>Connecting...</div>;
  }

  return (
    <div className="h-screen w-full bg-green-700">
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
              className="flex w-full items-center justify-center"
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

      <div className="absolute bottom-5 left-1/2 flex -translate-x-[50%] items-center justify-center">
        <ActionPanel
          gameId={gameId}
          currentPlayerId={gameData?.currentPlayerId || ""}
          currentMinBet={gameData?.currentMinBet || 0}
          gamePhase={gameData?.gamePhase || 0}
          playerTotalChips={players[0]?.totalChips || 0}
          playerCurrentBet={players[0]?.bet || 0}
          playerStatus={players[0]?.status || 0}
          availableActions={availableActions}
        />
      </div>

      {/* 公共 UI */}
      <div className="absolute left-1/2 top-1/3 flex -translate-x-[50%] translate-y-[0%] flex-col items-center justify-center">
        <div>minBet:{gameData?.currentMinBet}</div>
        <div>CurrentPlayer:{gameData?.currentPlayerId}</div>
        <div>gamePhase:{gamePhaseText(gameData?.gamePhase)}</div>
        <div>pot:{gameData?.pot}</div>
        <div className="">Public cards</div>
      </div>
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
