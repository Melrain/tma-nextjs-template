"use client";

import React from "react";
import axios from "axios";
import { Button } from "../ui/button";

import { useSignal, initData } from "@telegram-apps/sdk-react";

const CreatePokerRoom = () => {
  const initDataRaw = useSignal(initData.raw);

  const onSubmit = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api");
      alert(response);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Button
        onClick={() => {
          onSubmit();
        }}>
        send initData
      </Button>
      <p>{initDataRaw}</p>
    </div>
  );
};

export default CreatePokerRoom;
