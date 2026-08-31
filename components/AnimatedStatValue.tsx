"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

// Ease-out quart: quick at the start, gently settling into the final count.
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

export default function AnimatedStatValue({ value }: { value: string }) {
  const [prefix, digits, suffix] = value.match(/^(\D*)(\d+)(\D*)$/)?.slice(1) ?? ["", "0", ""];
  const target = parseInt(digits, 10);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1100;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.round(target * easeOutQuart(progress)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}
