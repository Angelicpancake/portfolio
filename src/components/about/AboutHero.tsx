'use client';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

interface Props {
  src: string;
  alt: string;
  caption: string;
}

/** Wide photo with a gentle scroll parallax/zoom and a caption that fades out. */
export default function AboutHero({ src, alt, caption }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.14]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '10%']);
  const captionOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  return (
    <motion.div
      ref={ref}
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white/5 md:aspect-video"
      initial={reduce ? false : { opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.img
        src={src}
        alt={alt}
        width={1920}
        height={1080}
        fetchPriority="high"
        className="size-full object-cover object-[55%_20%]"
        style={{ scale, y }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <motion.p style={{ opacity: captionOpacity }} className="micro absolute bottom-5 left-5 text-paper md:bottom-8 md:left-8">
        {caption}
      </motion.p>
    </motion.div>
  );
}
