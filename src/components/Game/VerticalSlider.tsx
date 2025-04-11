// components/Game/VerticalSlider.tsx
"use client";

import React, { useState } from "react";
import { Slider } from "@telegram-apps/telegram-ui";

interface VerticalSliderProps {
  max: number; // 玩家筹码
  min: number; // 最小加注额度
  onConfirm: (value: number) => void;
  onCancel: () => void;
}

const VerticalSlider: React.FC<VerticalSliderProps> = ({
  max,
  min,
  onConfirm,
  onCancel,
}) => {
  const [value, setValue] = useState(min);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseInt(e.target.value));
  };

  return (
    <div className="relative flex h-64 w-24 flex-col items-center justify-center space-y-2 rounded-xl bg-white p-4 shadow">
      <div className="text-sm font-bold text-gray-700">Total: {max}</div>

      <div className="text-sm text-gray-600">Raise: {value}</div>

      <button
        onClick={() => onConfirm(value)}
        className="mt-2 rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
      >
        确认
      </button>
      <button
        onClick={onCancel}
        className="mt-1 rounded bg-gray-300 px-3 py-1 text-sm text-black hover:bg-gray-400"
      >
        取消
      </button>
    </div>
  );
};

export default VerticalSlider;
