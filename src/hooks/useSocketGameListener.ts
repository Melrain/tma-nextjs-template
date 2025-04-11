import { useEffect, useState } from "react";
import { useSocket } from "@/components/Game/SocketContext";
import { CODE } from "@/types/GameTypes";

interface UseSocketGameListenerOptions {
  gameId: string;
  userId: string | number;
  onGameData?: (data: any) => void;
  autoRequestData?: boolean;
  getDataEvent?: string; // 默认 CODE.REDIS_HASH_GET_GAME
  touchEvent?: string; // 默认 CODE.REDIS_TOUCH + gameId
  dataEvent?: string; // 默认 CODE.REDIS_PRIVATE_DATA + gameId + userId
}

export const useSocketGameListener = ({
  gameId,
  userId,
  onGameData,
  autoRequestData = true,
  getDataEvent = CODE.REDIS_HASH_GET_GAME,
  touchEvent = CODE.REDIS_TOUCH,
  dataEvent = CODE.REDIS_PRIVATE_DATA,
}: UseSocketGameListenerOptions) => {
  const socket = useSocket();
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    setIsConnected(socket.connected);

    const uid = String(userId || "");

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    const requestGameData = () => {
      socket.emit(getDataEvent, {
        gameId,
        userId: uid,
      });
    };

    const handleTouch = () => {
      requestGameData();
    };

    const handleGameData = (data: any) => {
      if (onGameData) {
        onGameData(data);
      }
    };

    // 注册事件监听
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on(touchEvent + gameId, handleTouch);
    socket.on(dataEvent + gameId + uid, handleGameData);

    // 首次获取数据
    if (autoRequestData) {
      requestGameData();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off(touchEvent + gameId, handleTouch);
      socket.off(dataEvent + gameId + uid, handleGameData);
    };
  }, [
    socket,
    gameId,
    userId,
    touchEvent,
    dataEvent,
    autoRequestData,
    getDataEvent,
    onGameData,
  ]);

  return { isConnected };
};
