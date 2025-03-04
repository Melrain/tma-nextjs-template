interface IPlayer {
  playerId: string;
  playerName: string;
  tonWalletAddress: string;
  avatar: string;
  chipsInGame: number;
  currentBet: number;
  hand: string[];
  action: string;
}

export const players: IPlayer[] = [
  {
    playerId: "1",
    playerName: "Alice",
    chipsInGame: 1000,
    tonWalletAddress: "",
    avatar: "",
    currentBet: 0,
    hand: [],
    action: "",
  },
  {
    playerId: "2",
    playerName: "Bob",
    chipsInGame: 800,
    tonWalletAddress: "",
    avatar: "",
    currentBet: 0,
    hand: [],
    action: "",
  },
  {
    playerId: "3",
    playerName: "Charlie",
    chipsInGame: 1200,
    tonWalletAddress: "",
    avatar: "",
    currentBet: 0,
    hand: [],
    action: "",
  },
  {
    playerId: "4",
    playerName: "Diana",
    chipsInGame: 500,
    tonWalletAddress: "",
    avatar: "",
    currentBet: 0,
    hand: [],
    action: "",
  },
  {
    playerId: "5",
    playerName: "Eve",
    chipsInGame: 700,
    tonWalletAddress: "",
    avatar: "",
    currentBet: 0,
    hand: [],
    action: "",
  },
  {
    playerId: "6",
    playerName: "Frank",
    chipsInGame: 600,
    tonWalletAddress: "",
    avatar: "",
    currentBet: 0,
    hand: [],
    action: "",
  },
];
