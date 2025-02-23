"use client";

import React, { useEffect, useState } from "react";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useTonAddress, useTonWallet } from "@tonconnect/ui-react";
import { initializeSocket, getSocket } from "../../lib/socketService"; // 导入封装的 socketService
import { SocketCode } from "@/types/SocketCode";
import Link from "next/link";
import ConnectWallet from "./ConnectWallet";

import axios from "axios";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const AllPokerRooms = () => {
  const [allPokerRooms, setAllPokerRooms] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  const wallet = useTonWallet();

  const { initData } = useLaunchParams();

  const userFriendlyAddress = useTonAddress();

  const joinRoom = async (roomid: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/poker-room/join",
        {
          roomid,
          tonwallet: userFriendlyAddress,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!wallet) {
      return;
    }
    // const userFriendlyAddress = toUserFriendlyAddress(wallet.account.address);
    const username = initData?.user?.username || "";
    const roomid = ""; // 可以根据需求设置房间 ID

    // 初始化 socket，只会被调用一次
    const socket = initializeSocket({
      url: "http://localhost:8080/",
      tonwallet: userFriendlyAddress,
      username,
      roomid,
    });

    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
      // 发送请求获取所有房间信息
      socket.emit(SocketCode.GET_ALL_ROOMS);
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // 监听获取所有房间信息的响应
    socket.on(SocketCode.GET_ALL_ROOMS, (rooms) => {
      console.log("here rooms:", rooms[0].data);
      setAllPokerRooms(rooms[0].data);
    });

    socket.on(SocketCode.POKER_ROOMS_CHANGED, () => {
      console.log("pokerroomsChanged");
      socket.emit(SocketCode.GET_ALL_ROOMS);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(SocketCode.GET_ALL_ROOMS);
      socket.off("pokerroomsChanged");
    };
  }, [wallet, initData, userFriendlyAddress]); // 确保依赖地址和 launch 参数更新时重新绑定

  return (
    <div className="flex flex-col space-y-6">
      <ConnectWallet />
      <h1>{isConnected ? "Connected" : "Disconnected"}</h1>
      <div className="flex flex-col space-y-2">
        {allPokerRooms?.map(
          (room: {
            _id: string;
            roomName: string;
            minBuyIn: number;
            maxBuyIn: number;
            players: [];
            maxPlayers: number;
          }) => (
            <div
              key={room._id}
              className="flex flex-row">
              <Link
                href={`/poker-rooms/${room._id}`}
                className="flex flex-col justify-center items-start py-2">
                <span>{room.roomName}</span>
                <span>
                  {room.minBuyIn}/{room.maxBuyIn}
                </span>
                <span>
                  {room.players.length}/{room.maxPlayers}
                </span>
              </Link>
              <Popover>
                <PopoverTrigger>进入</PopoverTrigger>
                <PopoverContent className="bg-transparent border-slate-500 flex flex-col ">
                  <div></div>
                </PopoverContent>
              </Popover>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AllPokerRooms;
