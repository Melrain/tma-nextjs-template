import { useParams } from "next/navigation";

type GameParams = {
  gameId: string;
};

export const useGameParams = () => {
  const { gameId } = useParams() as GameParams;
  return gameId;
};
