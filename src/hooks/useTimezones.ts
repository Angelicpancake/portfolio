'use client';
import { useEffect, useState } from 'react';

export const ZONES = [
  { label: 'LDN', tz: 'Europe/London' },
  { label: 'AKL', tz: 'Pacific/Auckland' },
  { label: 'NYC', tz: 'America/New_York' },
];

export function useTimezones() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return ZONES.map((z) => ({
    label: z.label,
    time: now
      ? new Intl.DateTimeFormat('en-GB', { timeZone: z.tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now)
      : '--:--:--',
  }));
}
