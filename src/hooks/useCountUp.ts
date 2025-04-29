"use client";

import { useEffect, useState } from "react";

export const useCountUp = (start: number, end: number, duration = 1000) => {
  const [value, setValue] = useState(start);

  useEffect(() => {
    if (start === end) return;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (end - start) * progress);
      setValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [start, end, duration]);

  return value;
};
