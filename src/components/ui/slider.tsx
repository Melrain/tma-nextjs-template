"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}>
    <SliderPrimitive.Track
      className={`relative h-2 w-full grow overflow-hidden rounded-full ${
        props.id === "greater" ? "bg-[#3de600]" : "bg-[#ea103b]"
      }  `}>
      <SliderPrimitive.Range
        className={`bg-primary absolute h-full ${
          props.id === "greater" ? "bg-[#ea103b]" : "bg-[#3de600]"
        } `}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="border-primary ring-offset-background block  size-10 rounded-md border-none  bg-[#4391e6]  transition-colors focus:border-none focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
      <div className="flex items-center justify-center">
        <p className="mt-2 text-slate-600">|||</p>
      </div>
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
