"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate?: Date;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 36,
    seconds: 45,
  });

  useEffect(() => {
    const end = targetDate
      ? targetDate.getTime()
      : Date.now() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, end - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-2 text-center">
      <div className="flex flex-col items-center rounded-xl bg-[#F0A843] px-3 py-2 text-gray-950 shadow-xs min-w-14">
        <span className="text-lg font-black leading-none">{String(timeLeft.days).padStart(2, "0")}</span>
        <span className="mt-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-900">Days</span>
      </div>
      <span className="text-xl font-bold text-gray-400">:</span>
      <div className="flex flex-col items-center rounded-xl bg-[#F0A843] px-3 py-2 text-gray-950 shadow-xs min-w-14">
        <span className="text-lg font-black leading-none">{String(timeLeft.hours).padStart(2, "0")}</span>
        <span className="mt-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-900">Hours</span>
      </div>
      <span className="text-xl font-bold text-gray-400">:</span>
      <div className="flex flex-col items-center rounded-xl bg-[#F0A843] px-3 py-2 text-gray-950 shadow-xs min-w-14">
        <span className="text-lg font-black leading-none">{String(timeLeft.minutes).padStart(2, "0")}</span>
        <span className="mt-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-900">Mins</span>
      </div>
      <span className="text-xl font-bold text-gray-400">:</span>
      <div className="flex flex-col items-center rounded-xl bg-[#F0A843] px-3 py-2 text-gray-950 shadow-xs min-w-14">
        <span className="text-lg font-black leading-none">{String(timeLeft.seconds).padStart(2, "0")}</span>
        <span className="mt-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-900">Secs</span>
      </div>
    </div>
  );
}
