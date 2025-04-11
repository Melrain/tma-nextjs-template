"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  min: number;
  max: number;
  value: number[];
  onValueChange: (val: number[]) => void;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, min, max, value, onValueChange, ...props }, ref) => {
  const isAllIn = value[0] === max;

  return (
    <div className="flex h-64 flex-col items-center justify-between">
      {/* 顶部标签 */}
      <div
        className={cn(
          "rounded-md px-3 py-1 text-sm font-bold shadow-md",
          isAllIn
            ? "animate-pulse bg-red-600 text-white"
            : "bg-white/20 text-white",
        )}
      >
        {isAllIn ? "ALL IN" : value[0]}
      </div>

      {/* 垂直 Slider */}
      <SliderPrimitive.Root
        ref={ref}
        orientation="vertical"
        min={min}
        max={max}
        value={value}
        onValueChange={onValueChange}
        className={cn(
          "relative flex h-full w-8 touch-none select-none items-center",
          className,
        )}
        {...props}
      >
        {/* 铁轨渐变 Track */}
        <SliderPrimitive.Track
          className="relative h-full w-full overflow-hidden"
          style={{
            background:
              "linear-gradient(to top, #3de600 10%, #4391e6 50%, #00ff85 90%)",
            clipPath: "polygon(35% 100%, 65% 100%, 100% 0, 0% 0%)",
          }}
        >
          <SliderPrimitive.Range className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-red-500 shadow-sm" />
        </SliderPrimitive.Track>

        <SliderPrimitive.Thumb className="ring-primary relative z-10 block size-6 rounded-full bg-white ring-2 transition-transform duration-150 ease-in-out hover:scale-110 active:scale-125">
          {/* 跟随显示当前值 */}
          <div className="absolute left-[-3.5rem] top-1/2 -translate-y-1/2 rounded bg-black px-2 py-0.5 text-xs font-bold text-white shadow-md">
            {value[0]}
          </div>
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>

      {/* 底部值 */}
      <div className="text-xs text-white/80">{min}</div>
    </div>
  );
});

Slider.displayName = "Slider";
export { Slider };
