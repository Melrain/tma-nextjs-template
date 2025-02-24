"use client";

import React, { useEffect, useState } from "react";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useTonAddress, useTonWallet } from "@tonconnect/ui-react";
import { initializeSocket, getSocket } from "../../lib/socketService"; // 导入封装的 socketService
import { SocketCode } from "@/types/SocketCode";
import Link from "next/link";
import ConnectWallet from "./ConnectWallet";
import { Slider } from "@/components/ui/slider";

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
  const [buyInAmount, setBuyInAmount] = useState(0);

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
          buyInAmount,
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
    socket.on(SocketCode.GET_ALL_ROOMS, (rooms: any) => {
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
            bigBlind: number;
            players: [];
            maxPlayers: number;
          }) => (
            <div
              key={room._id}
              className="flex flex-row">
              <div className="flex flex-row space-x-4 justify-center items-start">
                <span>{room.roomName}</span>
                <span>
                  {room.bigBlind * 20}/{room.bigBlind * 100}
                </span>
                <span>
                  {room.players.length}/{room.maxPlayers}
                </span>
              </div>
              <Popover>
                <PopoverTrigger
                  onClick={() => {
                    setBuyInAmount(room.bigBlind * 20);
                  }}>
                  进入
                </PopoverTrigger>
                <PopoverContent className="border-1 bg-black-300 border-slate-500 flex flex-col ">
                  <div className="flex flex-row flex-1">
                    <span className="text-white">{room.bigBlind * 20}</span>
                    <Slider
                      onValueChange={(value) => {
                        setBuyInAmount(value[0]);
                      }}
                      className="flex-1 bg-black"
                      defaultValue={[room.bigBlind * 20]}
                      min={room.bigBlind * 20}
                      max={room.bigBlind * 100}
                      step={10}
                    />
                    <span className="text-white">{room.bigBlind * 100}</span>
                  </div>
                  <span className="text-white text-center flex-1">
                    {buyInAmount}
                  </span>
                  <Button variant={"outline"}>Confirm</Button>
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
