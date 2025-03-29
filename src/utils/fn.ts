export function reorderPlayerList(playerList: any[], localPlayerId: string) {
  // 找到本地玩家的索引
  const localIndex = playerList.findIndex(
    (player: { playerId: string }) => player.playerId === localPlayerId,
  );
  if (localIndex === -1) return playerList; // 未找到则直接返回

  const total = playerList.length;
  const reordered = [];

  // 从本地玩家的索引开始“递减”（向前取值），包装到数组末尾
  for (let i = 0; i < total; i++) {
    const index = (localIndex - i + total) % total;
    reordered.push(playerList[index]);
  }
  return reordered;
}

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
