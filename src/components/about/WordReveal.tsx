'use client';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [14, 0]);
  return (
    <motion.span className="mr-[0.28em] inline-block" style={{ opacity, y }}>
      {word}
    </motion.span>
  );
}

/** Headline whose words light up one by one as it scrolls into view (scroll-linked, reversible). */
export default function WordReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.92', 'end 0.55'] });
  const words = text.split(' ');

  if (reduce) return <h1 className={className}>{text}</h1>;

  return (
    <h1 ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => {
        const start = (i / words.length) * 0.75;
        return <Word key={i} word={w} progress={scrollYProgress} range={[start, start + 0.25]} />;
      })}
    </h1>
  );
}
