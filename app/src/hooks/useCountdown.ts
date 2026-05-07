import { useState, useEffect, useRef } from 'react';

interface CountdownValues {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  totalMs: number;
}

function getTimeParts(targetMs: number): CountdownValues {
  const now = Date.now();
  const diff = Math.max(0, targetMs - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
    totalMs: diff,
  };
}

export function useCountdown(targetDate: Date): CountdownValues {
  const targetMs = useRef(targetDate.getTime()).current;
  const [values, setValues] = useState<CountdownValues>(() => getTimeParts(targetMs));

  useEffect(() => {
    const interval = setInterval(() => {
      setValues(getTimeParts(targetMs));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetMs]);

  return values;
}
