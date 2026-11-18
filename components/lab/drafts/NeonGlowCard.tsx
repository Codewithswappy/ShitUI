'use client';

import * as React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

export interface NeonGlowCardProps extends HTMLMotionProps<'div'> {
  title?: string;
  description?: string;
  badge?: string;
}

export function NeonGlowCard({
  title = 'Kinetic Physics',
  description = 'Tactile spring interactions with real-time radial illumination.',
  badge = 'Experimental',
  className,
  ...props
}: NeonGlowCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(springY, [-150, 150], [10, -10]);
  const rotateY = useTransform(springX, [-150, 150], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'group relative w-full max-w-sm cursor-pointer overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-md transition-shadow duration-300 hover:shadow-xl dark:border-neutral-800/80 dark:bg-neutral-900/80 dark:hover:shadow-primary/5',
        className
      )}
      {...props}
    >
      {/* Radial Glow Cursor Follower */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at calc(50% + ${springX.get()}px) calc(50% + ${springY.get()}px), rgba(48, 116, 254, 0.15), transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            <Sparkles className="h-3 w-3" />
            {badge}
          </span>
          <span className="text-[11px] font-mono text-neutral-400">01 / DRAFT</span>
        </div>

        <div>
          <h4 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            {title}
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            {description}
          </p>
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
          <span className="text-[11px] font-mono text-neutral-400">TEST IN /LAB</span>
          <span className="text-xs font-semibold text-primary group-hover:underline">
            Inspect →
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default NeonGlowCard;
