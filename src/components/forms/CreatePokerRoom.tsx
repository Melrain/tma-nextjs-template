"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  initData,
  parseInitData,
  retrieveLaunchParams,
} from "@telegram-apps/sdk-react";
import { useTonAddress } from "@tonconnect/ui-react";
import { GameStatus } from "@/types/GameStatus";

const formSchema = z.object({
  blindSize: z.coerce.number().positive(),
  maxPlayers: z.coerce.number().positive().min(6).max(10),
});

const CreatePokerRoom = () => {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const _initData = parseInitData(initData.raw());

  const address = useTonAddress();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      blindSize: 1,
      maxPlayers: 6,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsCreating(true);
      const createRoomDto = {
        roomName: `${_initData.user?.firstName}'s room`,
        players: [],
        observers: [],
        dealerSeat: null,
        nextSeatToAct: null,
        currentMinBet: values.blindSize,
        playersActed: [],
        gameStatus: GameStatus.WAITING,
        host: address,
        communityCards: [],
        potSize: 0,
        bigBlind: values.blindSize,
        smallBlind: values.blindSize / 2,
        maxPlayers: values.maxPlayers,
        rounds: 0,
        actionTimer: 0,
        roundTimer: 0,
        isPrivate: false,
        password: null,
        handHistory: [],
        disconnectTimeout: 0,
        chatLogs: [],
      };

      const response = await axios.post(
        "http://localhost:8080/api/poker-room",
        createRoomDto
      );
      if (response.status !== 201) {
        setIsCreating(false);
        return console.error("create room failed");
      }
      setIsCreating(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col justify-center items-center w-full">
        <FormField
          control={form.control}
          name="blindSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blind Size</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="BlindSize" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 5, 10, 20, 50, 100].map((size: number) => (
                      <SelectItem
                        key={size}
                        value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>choose the blind size</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maxPlayers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Players</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="players" />
                  </SelectTrigger>
                  <SelectContent>
                    {[6, 9].map((size: number) => (
                      <SelectItem
                        key={size}
                        value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>players</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Room"}
        </Button>
      </form>
    </Form>
  );
};

export default CreatePokerRoom;
