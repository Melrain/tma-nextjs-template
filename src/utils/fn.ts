import { ActionType, IGame, IPlayer, PlayerStatus } from "@/types/GameTypes";

export const reorderPlayerList = (players: any[], localPlayerId: number) => {
  // 找到本地玩家的索引
  const localPlayerIndex = players.findIndex(
    (player) => player.playerId === localPlayerId,
  );

  if (localPlayerIndex === -1) return players; // 如果找不到本地玩家，返回原始列表

  // 将本地玩家移到第一个
  const reorderedPlayers = [
    ...players.slice(localPlayerIndex),
    ...players.slice(0, localPlayerIndex),
  ];

  // 调整玩家的位置，使得从本地玩家开始从 -1 的位置开始排列
  return reorderedPlayers.map((player, index) => ({
    ...player,
    position: index - localPlayerIndex, // 重新计算位置
  }));
};

export function getSeatPosition(index: number, total: number, radius: number) {
  // 假设从本地玩家（index 0）开始按顺时针排列
  // 这里以半圆排列为例，角度范围从 -90°（左侧）到 90°（右侧），本地玩家固定在下方（0°或180°）
  const angleRange = 180; // 半圆
  const angleDeg = -90 + (index / (total - 1)) * angleRange;
  const angleRad = (angleDeg * Math.PI) / 180;
  const x = radius * Math.cos(angleRad);
  const y = radius * Math.sin(angleRad);
  return { x, y };
}

// ✅ 后端：生成可用动作
export function getAvailableActions(
  player: { status: any; bet: number; totalChips: number },
  game: { players: any[] },
) {
  const actions: ActionType[] = [];

  if (player.status !== PlayerStatus.InGame) return actions;

  const currentMinBet = Math.max(
    ...game.players.map((p: { bet: any }) => p.bet),
  );
  const callAmount = currentMinBet - player.bet;

  // Fold 永远可以
  actions.push(ActionType.Fold);

  // Check 只有在下注额已经匹配的情况下可以（包括未加注）
  if (player.bet === currentMinBet) {
    actions.push(ActionType.Check);
  }

  // Call: 可以补齐当前最小下注额（非All-in）
  if (player.bet < currentMinBet && player.totalChips >= callAmount) {
    actions.push(ActionType.Call);
  }

  // Raise: 有足够筹码可以加注（至少加到 currentMinBet * 2）
  const minRaiseTo = currentMinBet * 2;
  if (player.totalChips + player.bet >= minRaiseTo) {
    actions.push(ActionType.Raise);
  }

  return actions;
}

// ✅ 后端校验 Raise 行动合法性
function isValidRaise(
  player: { totalChips: any; bet: any },
  actionAmount: number,
  game: { players: any[] },
) {
  const currentMinBet = Math.max(
    ...game.players.map((p: { bet: any }) => p.bet),
  );
  const minRaiseTo = currentMinBet * 2;
  const totalAvailable = player.totalChips + player.bet;

  // 必须满足：raise 到的金额 >= 最小 raise 到的金额 或者 All-in
  return (
    actionAmount === totalAvailable || // all-in
    actionAmount >= minRaiseTo // 正常 raise
  );
}

// ✅ 前端也统一逻辑
export function getAvailableActionsFrontend(
  currentMinBet: number,
  playerCurrentBet: number,
  playerTotalChips: number,
): ActionType[] {
  const actions: ActionType[] = [];
  const callAmount = currentMinBet - playerCurrentBet;
  const minRaiseTo = currentMinBet * 2;

  actions.push(ActionType.Fold);

  if (playerCurrentBet === currentMinBet) {
    actions.push(ActionType.Check);
  }

  if (playerCurrentBet < currentMinBet && playerTotalChips >= callAmount) {
    actions.push(ActionType.Call);
  }

  if (playerTotalChips + playerCurrentBet >= minRaiseTo) {
    actions.push(ActionType.Raise);
  }

  return actions;
}

export function getMaxLegalAllInAmount(player: IPlayer, game: IGame): number {
  const maxBet = Math.max(...game.players.map((p) => p.bet));
  const callAmount = Math.max(0, maxBet - player.bet);
  const otherPlayers = game.players.filter(
    (p) =>
      p.playerId !== player.playerId &&
      (p.status === PlayerStatus.InGame || p.status === PlayerStatus.AllIn),
  );

  const maxOtherStack = Math.max(...otherPlayers.map((p) => p.totalChips), 0);
  return Math.min(player.totalChips, callAmount + maxOtherStack);
}
