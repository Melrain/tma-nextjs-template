"use client";

import React, { useEffect, useState } from "react";
import { initData, parseInitData } from "@telegram-apps/sdk-react";
import { useTonAddress, useTonWallet } from "@tonconnect/ui-react";
import { initializeSocket, getSocket } from "../../lib/socketService"; // 导入封装的 socketService
import { SocketCode } from "@/types/SocketCode";
import Link from "next/link";
import ConnectWallet from "./ConnectWallet";
import { Slider } from "@/components/ui/slider";

import axios from "axios";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const AllPokerRooms = () => {
  const [allPokerRooms, setAllPokerRooms] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  const wallet = useTonWallet();
  const _initData = parseInitData(initData.raw());
  const userFriendlyAddress = useTonAddress();

  const router = useRouter();

  const joinRoom = async (roomId: string, tonWalletAddress: string) => {
    try {
      // const response = await axios.post(
      //   "http://localhost:8080/api/poker-room/join",
      //   {
      //     roomId,
      //     tonWalletAddress,
      //   }
      // );
      // console.log("response:", response.data);
      router.push(`/poker-rooms/${roomId}`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!wallet) {
      return;
    }
    // const userFriendlyAddress = toUserFriendlyAddress(wallet.account.address);
    const username = _initData.user?.firstName || "";
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
    socket.on(
      SocketCode.GET_ALL_ROOMS,
      (response: { data: []; message: string; status: number }) => {
        console.log("get all rooms:", response);
        setAllPokerRooms(response.data);
      },
    );

    socket.on(SocketCode.POKER_ROOMS_CHANGED, (payload) => {
      console.log("received event, checking payloads", payload);
      // setAllPokerRooms(payload);
      console.log("sending get all rooms request,");
      socket.emit(SocketCode.GET_ALL_ROOMS);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(SocketCode.GET_ALL_ROOMS);
      socket.off(SocketCode.POKER_ROOMS_CHANGED);
    };
  }, [wallet, userFriendlyAddress, _initData.user?.firstName]); // 确保依赖地址和 launch 参数更新时重新绑定

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
            <div key={room._id} className="flex flex-row">
              <div className="flex flex-row items-center justify-center space-x-4">
                <span>{room.roomName}</span>
                <span>
                  {room.bigBlind * 20}/{room.bigBlind * 100}
                </span>
                <span>
                  {room.players}/{room.maxPlayers}
                </span>
              </div>
              <Button
                onClick={() => {
                  joinRoom(room._id, userFriendlyAddress);
                }}
                variant="secondary"
                className="ml-2"
              >
                Enter
              </Button>
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default AllPokerRooms;
