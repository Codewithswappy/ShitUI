'use client';

import React from 'react';
import { Link } from 'next-view-transitions';
import { motion } from 'motion/react';
import { DuoPuzzlePiece, DuoSparkle } from './DuoIcons';

interface HeroCardProps {
  onSurpriseMe?: () => void;
  componentCount?: number;
}

export function HeroCard({ onSurpriseMe, componentCount = 30 }: HeroCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8 w-full pt-4 pb-2 transition-all"
    >
      <div className="flex w-full flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Heading and Sub Heading */}
        <div className="flex max-w-2xl flex-col space-y-2 text-left">
          <h1 className="text-xl font-medium tracking-tight text-foreground leading-snug md:text-2xl">
            Somehow, this shit looks good. <br />
            Made with Details. Named poorly.
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            A collection of polished, reusable components for developers who care about how their interfaces look.
          </p>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {/* Get Started pill button */}
          <Link
            href="/docs/introduction"
            className="inline-flex items-center justify-center gap-1 rounded-full border border-border/70 bg-accent px-4 py-2 text-xs font-semibold text-foreground shadow-pill-inset transition-all hover:bg-accent/80 active:scale-98 md:px-5 md:py-2.5 md:text-sm"
          >
            <span>Get Started</span>
          </Link>

          {/* View Components solid primary button */}
          <Link
            href="/docs/components/animated-tab"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-pill-glow transition-all hover:opacity-95 active:scale-98 md:px-6 md:py-2.5 md:text-sm"
          >
           
            <DuoPuzzlePiece className='h-4 w-4 text-white'/>
            <span>Components</span>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
