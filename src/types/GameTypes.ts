export interface IGame {
  gameId: string; // 游戏的唯一标识符
  gameName: string; // 游戏名称
  gamePhase: GamePhase; // 当前游戏的阶段 (Waiting, Preflop, Flop, Turn, River, Showdown, Ended)
  players: IPlayer[]; // 当前游戏的所有玩家
  waitingList: IPlayer[]; // 等待加入的玩家
  pot: number; // 奖池金额
  dealerId: string; // 当前庄家玩家的ID
  currentPlayerId: string; // 当前轮到操作的玩家ID
  communityCards: CommunityCards; // 公共牌（翻牌、转牌、河牌）
  actions: PlayerAction[]; // 记录所有玩家的操作
}

export interface IPlayer {
  playerId: string; // 玩家唯一标识符
  username: string; // 玩家用户名
  status: PlayerStatus; // 玩家当前状态 (如：InGame, Folded)
  totalChips: number; // 玩家总筹码
  bet: number; // 玩家当前下注金额
  hand: Card[]; // 玩家手牌（两张私人牌）
  currentAction: PlayerAction | null; // 玩家当前行动（下注、加注等）
  preAction: PreAction; // 玩家预先选择的动作（如Fold、Call等）
}

export interface CommunityCards {
  flop: Card[]; // 翻牌（三张公共牌）
  turn: Card | null; // 转牌（1张公共牌）
  river: Card | null; // 河牌（1张公共牌）
}

export enum GamePhase {
  Waiting, // 等待阶段
  Preflop, // 发牌阶段
  Flop, // 翻牌阶段
  Turn, // 转牌阶段
  River, // 河牌阶段
  Showdown, // 摊牌阶段
  Ended, // 游戏结束阶段
}

export interface Card {
  rank: string; // 牌的点数（2-10, J, Q, K, A）
  suit: string; // 牌的花色（Hearts, Diamonds, Clubs, Spades）
}

export enum PlayerStatus {
  Waiting, // 等待阶段
  InGame, // 在游戏中
  Folded, // 弃牌
}

export enum PreAction {
  None, // 无预动作
  Fold, // 弃牌
  Call, // 跟注
  Check, // 过牌
}

export interface IRoom {
  gameId: string; // 房间的唯一标识符
  logs: string[]; // 游戏历史记录
}

export interface PlayerAction {
  type: ActionType; // 玩家操作类型 (Call, Raise, Check, Fold等)
  amount: number; // 对应的下注金额（例如：Raise 的金额）
}

export enum ActionType {
  Call, // 跟注
  Raise, // 加注
  Check, // 过牌
  Fold, // 弃牌
  AllIn, // 全押
}

export enum CODE {
  GAMES = "GAMES",
  GAMES_UPDATED = "GAMES_UPDATED",
  REDIS_GAME_UPDATE = "REDIS_GAME_UPDATE",
  JOIN_GAME = "JOIN_GAME",
  REDIS_PRIVATE_DATA = "REDIS_PRIVATE_DATA",
  REDIS_HASH_GET_GAME = "REDIS_HASH_GET_GAME",
}
