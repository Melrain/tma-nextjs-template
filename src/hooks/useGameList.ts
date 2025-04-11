"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSocket } from "@/components/Game/SocketContext";
import { CODE } from "@/types/GameTypes";

export function useGameList() {
  const [games, setGames] = useState([]);
  const socket = useSocket();

  const fetchGames = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/game/all");
      if (res.data?.data) {
        setGames(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching games:", err);
    }
  };

  useEffect(() => {
    fetchGames();

    socket.on(CODE.REDIS_TOUCH, fetchGames);

    return () => {
      socket.off(CODE.REDIS_TOUCH, fetchGames);
    };
  }, [socket]);

  return {
    games,
    fetchGames,
  };
}
