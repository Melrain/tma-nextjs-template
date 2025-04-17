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
