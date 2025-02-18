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
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useTonAddress } from "@tonconnect/ui-react";
import axios from "axios";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  blindSize: z.coerce.number().positive(),
  maxPlayers: z.coerce.number().positive().min(6).max(10),
});

const CreatePokerRoom = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { initData } = useLaunchParams();
  const user = initData?.user;
  const address = useTonAddress();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      blindSize: 1,
      maxPlayers: 6,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      if (user === undefined) {
        throw new Error("initData's user is undefined");
      }
      const createPokerRoomDto = {
        roomStatus: "waiting",
        roomName: `${user.username}'s room`,
        gameRounds: 0,
        host: address,
        blindSize: values.blindSize,
        maxSeats: values.maxPlayers,
        minBuyIn: values.blindSize * 20,
        maxBuyIn: values.blindSize * 100,
        waitingList: [],
        playerList: [],
        currentDeck: [],
      };
      const response = await axios.post(
        "http://localhost:8080/api/poker-room",
        {
          createPokerRoomDto: createPokerRoomDto,
        }
      );
      if (response.status === 201) {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
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
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Select>
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
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Select>
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
          disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create"}
        </Button>
      </form>
    </Form>
  );
};

export default CreatePokerRoom;
