'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { SPONSORS_LIST, SponsorItem } from './sponsors-data';
import { DuoCuteStar } from './DuoIcons';

// Module Cube Icon for Core Tier (Streamline Sharp Module Cube matching SponsorPricing)
function CoreModuleCubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-4 h-4 shrink-0 opacity-80', className)}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 9.19462 1.76178 5.18836 12 1l10.2382 4.18836L12 9.19462Zm0.75 1.31728L23 6.50103V18.5l-10.25 4.1932V10.5119Zm-1.5 0L1 6.50103V18.5l10.25 4.1932V10.5119Z"
        className="fill-[#93c5fd] dark:fill-[#3074fe]/40"
        stroke="#3074fe"
        strokeWidth="0.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export interface DocSponsorsProps {
  sponsors?: SponsorItem[];
  className?: string;
  autoPlayInterval?: number;
}

export function DocSponsors({
  sponsors = SPONSORS_LIST,
  className,
  autoPlayInterval = 4200,
}: DocSponsorsProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Prepare slides: core sponsors + 1 claim spot slide
  const slides = React.useMemo(() => {
    const list: Array<
      | { type: 'sponsor'; data: SponsorItem }
      | { type: 'claim' }
    > = sponsors.map((s) => ({ type: 'sponsor', data: s }));

    // Always append a "Claim your spot" slide so users can also click to become a sponsor
    list.push({ type: 'claim' });
    return list;
  }, [sponsors]);

  // Auto-advance slides smoothly
  useEffect(() => {
    if (isHovered || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isHovered, slides.length, autoPlayInterval]);

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative shadow-pill-inset flex w-full flex-col justify-between overflow-hidden rounded-xl bg-neutral-200/50 p-3 select-none dark:bg-neutral-800/50 transition-all duration-300',
        className
      )}
    >
      {/* Realistic Fluid Wave Shimmer: Organic S-curve wave traveling across with trailing ripple */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit] transition-opacity duration-500',
          isHovered ? 'opacity-20' : 'opacity-15'
        )}
        aria-hidden="true"
      >
        <div className="animate-sponsor-shimmer absolute inset-y-0 h-full w-[280px]">
          <svg
            viewBox="0 0 280 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Light Mode Gradients */}
              <linearGradient id="wave-aura-light" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3074fe" stopOpacity="0" />
                <stop offset="25%" stopColor="#3074fe" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.65" />
                <stop offset="75%" stopColor="#3074fe" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#3074fe" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="wave-crest-light" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="35%" stopColor="#93c5fd" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="65%" stopColor="#93c5fd" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>

              {/* Dark Mode Gradients */}
              <linearGradient id="wave-aura-dark" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3074fe" stopOpacity="0" />
                <stop offset="25%" stopColor="#3074fe" stopOpacity="0.08" />
                <stop offset="42%" stopColor="#60a5fa" stopOpacity="0.18" />
                <stop offset="50%" stopColor="#dbeafe" stopOpacity="0.32" />
                <stop offset="58%" stopColor="#60a5fa" stopOpacity="0.18" />
                <stop offset="75%" stopColor="#3074fe" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#3074fe" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="wave-crest-dark" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
                <stop offset="30%" stopColor="#93c5fd" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#e0f2fe" stopOpacity="0.48" />
                <stop offset="70%" stopColor="#93c5fd" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
              </linearGradient>

              <filter id="wave-diffuse" x="-30%" y="-20%" width="160%" height="140%">
                <feGaussianBlur stdDeviation="7" />
              </filter>
              <filter id="crest-diffuse" x="-30%" y="-20%" width="160%" height="140%">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>

            {/* Light Mode Wave Elements */}
            <g className="dark:hidden">
              <path
                d="M 60,0 C 110,65 30,130 90,195 C 120,230 75,260 65,260 L 155,260 C 165,260 210,230 180,195 C 120,130 200,65 150,0 Z"
                fill="url(#wave-aura-light)"
                filter="url(#wave-diffuse)"
                opacity="0.45"
                transform="translate(-25, 0)"
              />
              <path
                d="M 75,0 C 130,65 45,130 110,195 C 145,230 95,260 85,260 L 175,260 C 185,260 235,230 200,195 C 135,130 220,65 165,0 Z"
                fill="url(#wave-aura-light)"
                filter="url(#wave-diffuse)"
              />
              <path
                d="M 120,0 C 175,65 90,130 155,195 C 190,230 140,260 130,260"
                stroke="url(#wave-crest-light)"
                strokeWidth="10"
                strokeLinecap="round"
                filter="url(#crest-diffuse)"
              />
            </g>

            {/* Dark Mode Wave Elements */}
            <g className="hidden dark:inline">
              <path
                d="M 60,0 C 110,65 30,130 90,195 C 120,230 75,260 65,260 L 155,260 C 165,260 210,230 180,195 C 120,130 200,65 150,0 Z"
                fill="url(#wave-aura-dark)"
                filter="url(#wave-diffuse)"
                opacity="0.5"
                transform="translate(-25, 0)"
              />
              <path
                d="M 75,0 C 130,65 45,130 110,195 C 145,230 95,260 85,260 L 175,260 C 185,260 235,230 200,195 C 135,130 220,65 165,0 Z"
                fill="url(#wave-aura-dark)"
                filter="url(#wave-diffuse)"
              />
              <path
                d="M 120,0 C 175,65 90,130 155,195 C 190,230 140,260 130,260"
                stroke="url(#wave-crest-dark)"
                strokeWidth="10"
                strokeLinecap="round"
                filter="url(#crest-diffuse)"
              />
            </g>
          </svg>
        </div>
      </div>

      {/* Top Glass Rim Highlight */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-linear-to-r from-transparent via-white/30 dark:via-white/10 to-transparent"
        aria-hidden="true"
      />

      {/* ─── Top Header: Clean "Sponsor" + Star Icon (No pagination dots) ─── */}
      <div className="relative z-10 flex shrink-0 items-center justify-between">
        <Link
          href="/sponsors#pricing"
          className="group/sp flex items-center gap-1.5 transition-colors"
        >
          <span className="text-foreground text-xs font-semibold tracking-tight sm:text-[13px] group-hover/sp:text-primary transition-colors">
            Sponsor
          </span>
          <DuoCuteStar className="h-4.5 w-4.5 shrink-0 transition-transform group-hover/sp:scale-110" aria-hidden="true" />
        </Link>
      </div>

      {/* ─── Center: Animated Slide Body ─── */}
      <div className="relative z-10 flex flex-1 w-full flex-col justify-center min-h-0 pt-1.5">
        <AnimatePresence mode="wait">
          {currentSlide.type === 'sponsor' ? (
            <motion.div
              key={`sponsor-${currentSlide.data.id}`}
              initial={{ opacity: 0, x: 10, filter: 'blur(3px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -10, filter: 'blur(3px)' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-between h-full"
            >
              <Link
                href={currentSlide.data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/card flex flex-col justify-between h-full cursor-pointer"
              >
                {/* Brand Logo & Name Header (No core text badge) */}
                <div className="flex items-center gap-2 min-w-0">
                  {currentSlide.data.logoUrl ? (
                    <img
                      src={currentSlide.data.logoUrl}
                      alt={currentSlide.data.name}
                      className="h-6 w-6 rounded-md object-cover ring-1 ring-border/50 shrink-0 shadow-xs"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] shrink-0">
                      {currentSlide.data.name.slice(0, 2)}
                    </div>
                  )}
                  <span className="text-xs font-semibold tracking-tight text-foreground truncate group-hover/card:text-primary transition-colors">
                    {currentSlide.data.name}
                  </span>
                </div>

                {/* Tagline / Description */}
                <p className="text-[11px] leading-[1.35] text-muted-foreground line-clamp-2 mt-1">
                  {currentSlide.data.description || currentSlide.data.tagline}
                </p>

                {/* Bottom Row: Core Cube Icon on bottom-left, @handle on right (No visit sponsor text) */}
                <div className="flex items-center justify-between text-[10px] text-muted-foreground/80 mt-1">
                  <div className="flex items-center gap-1" title="Core Sponsor">
                    <CoreModuleCubeIcon className="w-3.5 h-3.5" />
                  </div>
                  {currentSlide.data.xHandle && (
                    <span className="text-muted-foreground/60 truncate">
                      {currentSlide.data.xHandle}
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          ) : (
            /* Claim your spot in docs slide */
            <motion.div
              key="claim-spot-slide"
              initial={{ opacity: 0, filter: 'blur(3px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(3px)' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center text-center h-full"
            >
              <Link
                href="/sponsors#pricing"
                className="group/claim flex items-center justify-center w-full h-full cursor-pointer py-1"
              >
                <span className="text-sm font-medium text-muted-foreground group-hover/claim:text-foreground transition-colors">
                  Claim your spot in docs
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default DocSponsors;
