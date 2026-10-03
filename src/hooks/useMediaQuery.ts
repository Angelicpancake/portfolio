'use client';
import { useEffect, useState } from 'react';

/** Returns undefined until mounted so callers can avoid hydration mismatches. */
export function useMediaQuery(query: string): boolean | undefined {
  const [matches, setMatches] = useState<boolean>();
  useEffect(() => {
    const m = window.matchMedia(query);
    const update = () => setMatches(m.matches);
    update();
    m.addEventListener('change', update);
    return () => m.removeEventListener('change', update);
  }, [query]);
  return matches;
}
