"use client";

import { motion } from "framer-motion";

interface FlyingChipProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const FlyingChip = ({ startX, startY, endX, endY }: FlyingChipProps) => {
  return (
    <motion.div
      className="absolute z-50"
      initial={{ top: startY, left: startX, opacity: 1 }}
      animate={{ top: endY, left: endX, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <div className="text-xl">🪙</div>
    </motion.div>
  );
};

export default FlyingChip;
