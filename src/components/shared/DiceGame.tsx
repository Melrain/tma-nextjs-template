/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect } from "react";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { DollarSign, Medal } from "lucide-react";
import { GrPowerCycle } from "react-icons/gr";
import { Separator } from "../ui/separator";
import { Slider } from "../ui/slider";
import { VscTriangleUp } from "react-icons/vsc";

import {
  AnimatePresence,
  motion,
  MotionStyle,
  useIsPresent,
} from "framer-motion";
import { FaFaceLaughWink, FaFaceSadTear } from "react-icons/fa6";
import diceGif from "@/assets/diceAnimation.gif";
import Image from "next/image";

import { FaArrowDown, FaArrowUp } from "react-icons/fa";

interface Props {
  bettor: string;
  bettorBalance: number;
  creator: string;
  diceId: string;
  deposite: {
    amount: number;
    currency: string;
  };
  largestWin: number;
  largestWinUser: string;
  largestWinUserMultiplier: number;
}

const formSchema = z.object({
  diceId: z.string(),

  creator: z.string(),
  bettor: z.string(),
  bettingField: z.object({
    currency: z.string(),
    betAmount: z.coerce.number().min(0),
  }),
  playerConfig: z.object({
    type: z.string(),
    number: z.coerce.number().min(0).max(100),
    multiplier: z.coerce.number(),
    winChance: z.coerce.number(),
  }),
});

const DiceForm = ({
  bettor = "123",
  bettorBalance = 10000,
  creator = "123",
  diceId = "123",
  deposite = {
    amount: 10000,
    currency: "usd",
  },
  largestWin = 10000,
  largestWinUser = "123",
  largestWinUserMultiplier = 100,
}: Props) => {
  const [sliderType, setSliderType] = React.useState<"greater" | "less">(
    "greater"
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [numberIndecator, setNumberIndecator] = React.useState(0);
  const [winOrLose, setWinOrLose] = React.useState("");
  const [profit, setProfit] = React.useState(0);
  const [currentResults, setCurrentResults] = React.useState([
    {
      gameResult: "",
      randomNumber: 0,
    },
  ]);
  const [isIndicatorVisible, setIsIndicatorVisible] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [currentDeposite, setCurrentDeposite] = React.useState(deposite.amount);
  const [updatedDeposite, setUpdatedDeposite] = React.useState(deposite.amount);
  const [isDepositeIncreased, setIsDepositeIncreased] = React.useState(false);
  const [depositeColor, setDepositeColor] = React.useState("white");
  const [depositeArrow, setDepositeArrow] = React.useState("");

  // const typewriteSound = new Howl({
  //   src: ["/assets/sounds/typerwriter_ding.wav"],
  // });

  // const rolldiceSound = new Howl({
  //   src: ["/assets/sounds/rolldice.mp3"],
  // });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diceId,
      creator,
      bettor,
      bettingField: {
        currency: deposite.currency,
        betAmount: 0,
      },
      playerConfig: {
        type: "greater",
        number: 50,
        multiplier: 1.0102,
        winChance: 49.5,
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      // rolldiceSound.play();

      if (profit > deposite.amount) {
        alert("剩余奖金不足,请降低投注额或减少倍数");
        return;
      }

      if (bettorBalance < form.getValues("bettingField").betAmount) {
        alert("余额不足");
        return;
      }

      // append result to currentResults

      setShow(true);

      // const result = await drawDice(values);
    } catch (error) {
      console.error("发生错误:" + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // numberIndecator effect
  useEffect(() => {
    setIsIndicatorVisible(true);
    const timerId = setTimeout(() => {
      setIsIndicatorVisible(false);
    }, 2000);

    return () => {
      clearTimeout(timerId);
    };
  }, [numberIndecator]);

  // 监控表格
  useEffect(() => {
    if (form.getValues("playerConfig").type === "greater") {
      const winChance = 100 - form.getValues("playerConfig").number;
      form.setValue("playerConfig.winChance", winChance);
    } else {
      const winChance = form.getValues("playerConfig").number;
      form.setValue("playerConfig.winChance", winChance);
    }

    const multiplier = +(99 / form.getValues("playerConfig").winChance).toFixed(
      4
    );

    const calculatedProfit =
      form.getValues("playerConfig").multiplier *
        form.getValues("bettingField").betAmount -
      form.getValues("bettingField").betAmount;

    setProfit(calculatedProfit);

    const winChance = 99 / form.getValues("playerConfig").multiplier;
    form.setValue("playerConfig.winChance", winChance);

    form.setValue("playerConfig.multiplier", multiplier);
  }, [
    form.watch("playerConfig").number,
    form.watch("playerConfig").multiplier,
    form.watch("playerConfig").type,
    form.watch("bettingField").betAmount,
  ]);

  // 监控奖池变化

  // 比较新旧奖池变化
  useEffect(() => {
    let timerId: any;
    if (currentDeposite < updatedDeposite) {
      setCurrentDeposite(updatedDeposite);
      setIsDepositeIncreased(true);
      setDepositeColor("green");
      setDepositeArrow("up");
      timerId = setTimeout(() => {
        setDepositeColor("white");
        setDepositeArrow("");
      }, 1000);
    } else {
      if (currentDeposite > updatedDeposite) {
        setCurrentDeposite(updatedDeposite);
        setIsDepositeIncreased(false);
        setDepositeColor("red");
        setDepositeArrow("down");
        timerId = setTimeout(() => {
          setDepositeColor("white");
          setDepositeArrow("");
        }, 1000);
      }
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [updatedDeposite]);

  useEffect(() => {
    console.log(currentDeposite, deposite.amount, isDepositeIncreased);
  }, [currentDeposite, deposite.amount, isDepositeIncreased]);

  return (
    <div className="flex flex-col justify-center">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex  w-full select-none  flex-row justify-between max-lg:flex-col-reverse">
            {/* 左侧 */}
            <section className="flex w-full flex-col rounded-b rounded-t-none bg-[#213744] p-4 px-2 max-lg:flex-col-reverse md:px-2 lg:max-w-xs lg:rounded-l-md lg:rounded-t-none lg:rounded-br-none">
              {/* USD TDC */}
              <FormField
                name="bettingField"
                render={({ field }) => (
                  <Tabs
                    className="px-3"
                    defaultValue="manual">
                    <TabsList className="flex h-auto w-full flex-row justify-between rounded-full bg-mycolor-100 ">
                      <TabsTrigger
                        disabled={deposite.currency !== "usd"}
                        value={"manual"}
                        className={`my-1 flex ${
                          deposite.currency === "usd" ? "bg-slate-700 " : ""
                        } rounded-2xl  text-white`}>
                        USD投注
                      </TabsTrigger>
                      <TabsTrigger
                        disabled={deposite.currency !== "tdc"}
                        value={"auto"}
                        className={`my-1 flex ${
                          deposite.currency === "tdc" ? "bg-slate-700 " : ""
                        } rounded-2xl  text-white`}>
                        TDC投注
                      </TabsTrigger>
                    </TabsList>
                    <div className="flex w-full flex-col p-1">
                      <div className="flex flex-row justify-between">
                        <p className="text-sm text-slate-300">投注额</p>
                        <p className="text-sm text-slate-300">
                          余额:
                          {deposite.currency === "usd"
                            ? `USD${bettorBalance.toFixed(2)}`
                            : `TDC${bettorBalance.toFixed(2)}`}
                        </p>
                      </div>

                      <div className="flex w-full flex-row rounded-md bg-[#2f4553] p-0.5 shadow-md">
                        <Input
                          name="betAmount"
                          min={0}
                          className="w-full rounded-md border-none bg-mycolor-100 text-[16px] text-white hover:border-4 focus:outline-none "
                          type="number"
                          placeholder="0.0"
                          step={0.1}
                          value={
                            form.getValues("bettingField").betAmount === 0
                              ? ""
                              : form.getValues("bettingField").betAmount
                          }
                          onChange={(e) => {
                            if (+e.target.value > bettorBalance) {
                              alert("余额不足");
                              form.setValue("bettingField.betAmount", 0);
                              e.target.value = ""; // Assign an empty string instead of null
                              setProfit(0);
                              return;
                            }
                            form.setValue(
                              "bettingField.betAmount",
                              +e.target.value
                            );
                          }}
                        />
                        <DollarSign className="relative right-12 top-2 text-yellow-500" />
                        <div className="flex flex-row items-center px-2">
                          <p
                            className=" text-xs font-bold text-slate-300 hover:cursor-pointer"
                            onClick={() => {
                              form.setValue(
                                "bettingField.betAmount",
                                +bettorBalance.toFixed(0) - 1
                              );
                            }}>
                            MAX
                          </p>
                          <Separator
                            orientation="vertical"
                            className="m-2 size-0.5 h-3/5 bg-mycolor-200"
                          />
                          <p
                            className="text-sm font-bold text-slate-300 hover:cursor-pointer"
                            onClick={() => {
                              if (
                                form.getValues("bettingField").betAmount * 2 >
                                bettorBalance
                              ) {
                                form.setValue(
                                  "bettingField.betAmount",
                                  +bettorBalance.toFixed(0) - 1
                                );
                              } else {
                                form.setValue(
                                  "bettingField.betAmount",
                                  form.getValues("bettingField").betAmount * 2
                                );
                              }
                            }}>
                            2x
                          </p>
                        </div>
                      </div>
                    </div>
                    <TabsContent value={"manual"}>
                      <div className="p-0.5">
                        <div className="flex flex-row justify-between">
                          <p className="text-sm text-slate-300">获胜利润</p>
                        </div>
                        <div className="flex w-full flex-row rounded-md bg-[#304454]">
                          <Input
                            type="text"
                            readOnly
                            className="border-none bg-[#304454] font-bold text-white focus:outline-none"
                            placeholder="0.00"
                            value={profit.toFixed(2)}
                          />
                          <DollarSign className="relative right-10 top-2 text-yellow-500" />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent
                      value={"auto"}
                      className="text-white">
                      建设中......
                    </TabsContent>
                  </Tabs>
                )}
              />

              <div className="p-3 px-3.5">
                <Button
                  disabled={isSubmitting || profit > deposite.amount}
                  type="submit"
                  className={` w-full bg-[#3de600] py-6`}>
                  <p className="text-lg">
                    {isSubmitting ? (
                      <div className="flex flex-row gap-2">
                        <Image
                          unoptimized
                          src={diceGif.src}
                          width={30}
                          height={30}
                          alt="fire gif"
                        />
                      </div>
                    ) : (
                      "投注"
                    )}
                  </p>
                </Button>
              </div>
            </section>
            {/* 右侧 */}
            <FormField
              name="numberRangeFromPlayer.greater"
              render={({ field }) => (
                <section className=" relative flex w-full flex-col items-center justify-center rounded-t-none bg-[#0f212f] p-1 pt-20  lg:rounded-r lg:rounded-t-none">
                  {/* Bet History List */}

                  <div className="absolute right-1 top-2 flex  w-1/2 flex-row-reverse gap-1  text-white">
                    <AnimatePresence>
                      {currentResults.map(
                        (result, index) =>
                          index >= currentResults.length - 5 &&
                          index !== 0 && (
                            <Item key={index}>
                              <div
                                className={`${
                                  result.gameResult === "win"
                                    ? "bg-[#3de600] text-black"
                                    : "bg-mycolor-200 text-white"
                                } rounded-full px-3 py-1 font-bold`}>
                                <p className="text-sm">{result.randomNumber}</p>
                              </div>
                            </Item>
                          )
                      )}
                    </AnimatePresence>
                  </div>

                  <div className=" flex h-[40px] w-full border-separate border-spacing-52 flex-col items-center justify-center rounded-full border-[15px] border-[#2e4553]  p-4">
                    <FormItem className="relative w-full">
                      <FormControl>
                        <div className="relative w-full">
                          <div className="absolute -top-16  flex w-full flex-row items-center justify-between bg-[#0e212e]">
                            <div className="relative flex flex-col items-center text-center">
                              <p className="mt-2 items-end font-bold text-white">
                                0
                              </p>
                              <VscTriangleUp
                                className="absolute -bottom-3 text-[#2e4553]"
                                size={18}
                              />
                            </div>
                            <div className="relative flex flex-col items-center text-center">
                              <p className="mt-2 items-end font-bold text-white">
                                25
                              </p>
                              <VscTriangleUp
                                className="absolute -bottom-3 text-[#2e4553]"
                                size={18}
                              />
                            </div>
                            <div className="relative flex flex-col items-center text-center">
                              <p className="mt-2 items-end font-bold text-white">
                                50
                              </p>
                              <VscTriangleUp
                                className="absolute -bottom-3 text-[#2e4553]"
                                size={18}
                              />
                            </div>
                            <div className="relative flex flex-col items-center text-center">
                              <p className="mt-2 items-end font-bold text-white">
                                75
                              </p>
                              <VscTriangleUp
                                className="absolute -bottom-3 font-bold text-[#2e4553]"
                                size={18}
                              />
                            </div>
                            <div className="relative flex flex-col items-center text-center">
                              <p className="mt-2 items-end font-bold text-white">
                                100
                              </p>
                              <VscTriangleUp
                                className="absolute -bottom-3 font-bold text-[#2e4553]"
                                size={18}
                              />
                            </div>
                          </div>
                          <div className="relative w-full">
                            {/* numberIndicator */}

                            {show ? (
                              <div
                                className="absolute  -top-8 z-50 flex size-20  items-center justify-center  "
                                style={{
                                  left: `calc(${numberIndecator}% - 38px)`,
                                  transition: "all 0.5s",
                                  opacity: isIndicatorVisible ? 1 : 0,
                                  zIndex: 9999,
                                }}>
                                {winOrLose === "win" ? (
                                  <div className="flex flex-col items-center justify-center">
                                    <p className="font-bold text-green-500">
                                      {numberIndecator}
                                    </p>
                                    <FaFaceLaughWink
                                      size={40}
                                      className="text-green-500"
                                    />
                                  </div>
                                ) : null}
                                {winOrLose === "lose" ? (
                                  <div className="flex flex-col items-center justify-center">
                                    <p className="font-bold text-red-500">
                                      {numberIndecator}
                                    </p>
                                    <FaFaceSadTear
                                      size={40}
                                      className="text-red-500"
                                    />
                                  </div>
                                ) : null}
                              </div>
                            ) : null}

                            <Slider
                              className="z-50"
                              id={sliderType}
                              defaultValue={[50]}
                              max={98}
                              min={2}
                              onValueChange={(newValue) => {
                                field.onChange(newValue[0]);
                                form.setValue(
                                  "playerConfig.number",
                                  newValue[0]
                                );
                              }}
                            />
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  </div>

                  <div className="relative mt-10  flex w-full flex-row justify-between gap-2 rounded-md bg-[#223743] p-4 shadow-lg">
                    {/* 奖池信息 */}
                    <div className="absolute -left-1 -top-12  flex w-full flex-row justify-between px-2 font-bold"></div>
                    <div className="flex flex-col">
                      <div className="flex flex-row items-center justify-between px-2">
                        <p className="text-sm text-slate-400">倍数</p>

                        <span className="text-sm font-bold text-slate-400 ">
                          X
                        </span>
                      </div>
                      <div className="flex w-full flex-row rounded-md bg-[#2f4553] p-0.5 shadow-md">
                        <Input
                          readOnly
                          className="border-none bg-mycolor-100 font-bold text-white shadow-lg focus:outline-none"
                          value={form.getValues("playerConfig").multiplier}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex flex-row items-center justify-between px-2">
                        <p className="text-sm text-slate-400">
                          {sliderType === "greater" ? "掷大于" : "掷小于"}
                        </p>
                        <span className="text-sm font-bold text-slate-400 ">
                          <GrPowerCycle
                            className="hover:cursor-pointer"
                            onClick={() => {
                              setSliderType(
                                sliderType === "greater" ? "less" : "greater"
                              );
                              form.setValue(
                                "playerConfig.type",
                                sliderType === "greater" ? "less" : "greater"
                              );
                            }}
                          />
                        </span>
                      </div>
                      <div className="flex w-full flex-row rounded-md bg-[#2f4553] p-0.5 shadow-md">
                        <Input
                          readOnly
                          className="border-none bg-mycolor-100 font-bold text-white shadow-lg focus:outline-none"
                          value={form
                            .getValues("playerConfig")
                            .number.toFixed(2)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex flex-row items-center justify-between px-2">
                        <p className="text-sm text-slate-400">获胜机率</p>

                        <span className="text-sm font-bold text-slate-400 ">
                          X
                        </span>
                      </div>
                      <div className="flex w-full flex-row rounded-md bg-[#2f4553] p-0.5 shadow-md">
                        <Input
                          readOnly
                          type="number"
                          className="border-none bg-mycolor-100 font-bold text-white shadow-lg focus:outline-none"
                          value={form
                            .getValues("playerConfig")
                            .winChance.toFixed(2)}
                        />
                      </div>
                    </div>
                  </div>
                </section>
              )}
            />
          </div>
        </form>
        <div className="mt-1 flex w-full max-w-5xl flex-row justify-between rounded-sm  bg-mycolor-100 p-4 shadow-md max-lg:max-w-md">
          <div className="flex flex-col">
            <div className="flex flex-row gap-1 text-xs text-white">
              奖池剩余:
              {deposite.currency === "usd" ? "$ " : "TDC "}
              <span style={{ color: depositeColor }}>
                {updatedDeposite.toFixed(1)}
              </span>
              {depositeArrow === "up" ? (
                <FaArrowUp
                  className="text-green-500"
                  size={15}
                />
              ) : depositeArrow === "down" ? (
                <FaArrowDown
                  className="text-red-500"
                  size={15}
                />
              ) : null}
            </div>
            <p className="text-xs text-slate-500">Owned by : {creator}</p>
          </div>
          <div className="flex flex-row gap-1">
            <Medal
              size={30}
              className="text-yellow-500"
            />
            <div className="flex  flex-col text-xs">
              <div className="gap-1 text-yellow-300">
                最大奖为:
                {deposite.currency === "usd" ? "$ " : "TDC "}
                <span className="font-bold text-green-500">
                  {largestWin.toFixed(0)}
                </span>
                <span>({largestWinUserMultiplier?.toFixed(1)}倍)</span>
              </div>
              <p className="text-xs text-slate-500">获奖者:{largestWinUser}</p>
            </div>
          </div>
        </div>
      </FormProvider>
    </div>
  );
};

const Item = ({ children }: any) => {
  const isPresent = useIsPresent();
  const animations = {
    style: {
      position: isPresent ? "static" : "absolute",
    } as MotionStyle, // Add the type assertion here
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 900, damping: 40 },
  };
  return (
    <motion.h1
      {...animations}
      layout>
      {children}
    </motion.h1>
  );
};

export default DiceForm;
