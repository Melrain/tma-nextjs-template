export interface IGame {
  gameId: string; // 游戏的唯一标识符
  gameName: string; // 游戏名称
  gamePhase: GamePhase; // 当前游戏的阶段 (Waiting, Preflop, Flop, Turn, River, Showdown, Ended)
  players: IPlayer[]; // 当前游戏的所有玩家
  waitingList: IPlayer[]; // 等待加入的玩家
  pot: number; // 奖池金额
  pots: {
    amount: number;
    eligiblePlayerIds: string[];
  }[]; // 奖池列表
  dealerId: string; // 当前庄家玩家的ID
  currentPlayerId: string; // 当前轮到操作的玩家ID
  communityCards: CommunityCards; // 公共牌（翻牌、转牌、河牌）
  actions: PlayerAction[]; // 记录所有玩家的操作
  bigBlind: number; // 大盲注金额
  currentMinBet: number; // 当前最小下注金额
  lastRaiserId?: string; // 最后加注玩家的ID
}

export interface IPlayer {
  playerId: string; // 玩家唯一标识符
  username: string; // 玩家用户名
  avatar: string; // 玩家头像
  status: PlayerStatus; // 玩家当前状态 (如：InGame, Folded)
  totalChips: number; // 玩家总筹码
  bet: number; // 玩家当前下注金额
  handCards: Card[]; // 玩家手牌（两张私人牌）
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
export type Card = {
  suit: "h" | "d" | "c" | "s" | "empty" | "unavailable"; // 花色 (红心, 方块, 梅花, 黑桃)
  rank:
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "J"
    | "Q"
    | "K"
    | "empty"
    | "unavailable"
    | "A";
};

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
  Call = 0,
  Raise = 1,
  Check = 2,
  Fold = 3,
  AllIn = 4,
  Bet = 5, // ✅ 新增 Bet 操作
  Check_Fold = 6,
  None = 7,
}

export enum CODE {
  GAMES = "GAMES",
  GAMES_UPDATED = "GAMES_UPDATED",
  REDIS_GAME_UPDATE = "REDIS_GAME_UPDATE",
  JOIN_GAME = "JOIN_GAME",
  REDIS_PRIVATE_DATA = "REDIS_PRIVATE_DATA",
  REDIS_HASH_GET_GAME = "REDIS_HASH_GET_GAME",
  REDIS_TOUCH = "REDIS_TOUCH",
  TIMER = "TIMER",
  PLAYER_ACTION = "PLAYER_ACTION",
  PLAYER_PRE_ACTION = "PLAYER_PRE_ACTION",
  AVAILABLE_ACTIONS = "AVAILABLE_ACTIONS",
}
