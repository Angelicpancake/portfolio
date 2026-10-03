'use client';
import { motion, useReducedMotion } from 'framer-motion';

type Tag = 'div' | 'li' | 'p' | 'section';

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: Tag;
}

/** Fade + rise when scrolled into view (once). Renders static for reduced-motion users. */
export default function Reveal({ children, className, delay = 0, as = 'div' }: Props) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}

/** Hairline that draws itself left-to-right when scrolled into view. */
export function GrowLine({ delay = 0 }: { delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className="h-px origin-left bg-white/15"
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
