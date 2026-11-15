'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { SPONSOR_LINK } from './sponsors-data';
import { IconPlus, IconHeart } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

// ============================================================================
// SPONSOR CARD TYPES & COORDINATES
// Perfectly aligned 45-degree rotated diamond formation matching user sketch:
// - Center: Max (240x240)
// - Left: Max (240x240)
// - Right: Max (240x240)
// - Top-Left: Core (170x170)
// - Top-Right: Core (170x170)
// - Bottom-Center: Core (170x170)
// Continuous parallel 45° seams with exact uniform 14px gap between all edges!
// Virtual Canvas: 760 x 740 (Center Max at 380, 280)
// ============================================================================

interface CardPosition {
  id: string;
  type: 'max' | 'core';
  x: number; // center X in 760x740 virtual canvas
  y: number; // center Y in 760x740 virtual canvas
  size: number; // width/height of the square before 45deg rotation
  borderRadius: string;
}

const CARDS_LAYOUT: CardPosition[] = [
  // 1. Center Max (Claim spot)
  {
    id: 'center-max',
    type: 'max',
    x: 380,
    y: 280,
    size: 240,
    borderRadius: 'rounded-[36px]',
  },
  // 2. Left Max (Claim spot)
  {
    id: 'left-max',
    type: 'max',
    x: 200,
    y: 460,
    size: 240,
    borderRadius: 'rounded-[36px]',
  },
  // 3. Right Max (Claim spot)
  {
    id: 'right-max',
    type: 'max',
    x: 560,
    y: 460,
    size: 240,
    borderRadius: 'rounded-[36px]',
  },
  // 4. Top-Left Core (Claim spot)
  {
    id: 'top-left-core',
    type: 'core',
    x: 200,
    y: 150,
    size: 170,
    borderRadius: 'rounded-[26px]',
  },
  // 5. Top-Right Core (Claim spot)
  {
    id: 'top-right-core',
    type: 'core',
    x: 560,
    y: 150,
    size: 170,
    borderRadius: 'rounded-[26px]',
  },
  // 6. Bottom Core (Claim spot)
  {
    id: 'bottom-core',
    type: 'core',
    x: 380,
    y: 590,
    size: 170,
    borderRadius: 'rounded-[26px]',
  },
];

export function SponsorsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Responsive dynamic scaling so the rotated diamond arrangement maintains
  // 100% exact geometry, parallel gaps, and angles on mobile, tablet, and desktop
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      // Virtual canvas width = 760px
      const calculatedScale = Math.min(1, Math.max(0.42, (width - 32) / 760));
      setScale(calculatedScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="relative z-10 w-full overflow-hidden py-16 sm:py-24 transition-colors duration-500">
      <div className="mx-auto w-full max-w-[1700px] px-4 sm:px-6 lg:px-8">
        {/* Header - Heading & Sub-heading Centered (Button moved to bottom of section) */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-xl font-medium tracking-tight text-foreground leading-snug sm:text-2xl md:text-3xl">
            Support ShitUI. <br />
            Built for Builders. Backed by You.
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base max-w-2xl">
            A collection of living, interactive components crafted with obsessive care. Back the project and claim your spot on the hive.
          </p>
        </div>

        {/* Diamond Rotated Sponsor Cards Stage with Magnetic Push Interaction */}
        <div
          ref={containerRef}
          onPointerLeave={() => setHoveredId(null)}
          className="relative flex w-full items-center justify-center overflow-visible py-4 sm:py-6"
        >
          {/* Scaled Canvas Container */}
          <div
            style={{
              width: 760 * scale,
              height: 740 * scale,
            }}
            className="relative mx-auto"
          >
            {/* Absolute 760x740 coordinate space */}
            <div
              style={{
                width: 760,
                height: 740,
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
              }}
              className="absolute top-0 left-1/2 -translate-x-1/2"
            >
              {CARDS_LAYOUT.map((pos) => {
                const isMax = pos.type === 'max';
                const isHovered = hoveredId === pos.id;

                // ============================================================
                // OPPOSITE MAGNETIC REPULSION EFFECT
                // When any card is hovered, all other cards are smoothly pushed
                // away from it along the radial direction vector.
                // ============================================================
                let pushX = 0;
                let pushY = 0;

                if (hoveredId && hoveredId !== pos.id) {
                  const hoveredCard = CARDS_LAYOUT.find((c) => c.id === hoveredId);
                  if (hoveredCard) {
                    const dx = pos.x - hoveredCard.x;
                    const dy = pos.y - hoveredCard.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist > 0) {
                      const repulsionDistance = 28; // Push distance in pixels
                      pushX = (dx / dist) * repulsionDistance;
                      pushY = (dy / dist) * repulsionDistance;
                    }
                  }
                }

                return (
                  <Link
                    key={pos.id}
                    href={`/sponsors#pricing-${pos.type}`}
                    onPointerEnter={() => setHoveredId(pos.id)}
                    onPointerLeave={() => setHoveredId(null)}
                    style={{
                      position: 'absolute',
                      left: pos.x - pos.size / 2,
                      top: pos.y - pos.size / 2,
                      width: pos.size,
                      height: pos.size,
                      transform: `translate3d(${pushX.toFixed(2)}px, ${pushY.toFixed(2)}px, 0) rotate(45deg) scale(${isHovered ? 1.05 : 1})`,
                      transformOrigin: 'center center',
                      transition: 'transform 0.44s cubic-bezier(0.2, 0.9, 0.3, 1.15)',
                      zIndex: isHovered ? 20 : 10,
                      willChange: 'transform',
                    }}
                    className={cn(
                      'group flex items-center justify-center select-none cursor-pointer',
                      'bg-neutral-100 dark:bg-neutral-900',
                      // Soft tactile inset glow (100% inside the card, zero outer shadow behind):
                      'shadow-[inset_0_1px_2px_rgba(255,255,255,0.75),inset_0_0_18px_rgba(255,255,255,0.35)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.16),inset_0_0_22px_rgba(255,255,255,0.05)]',
                      'hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),inset_0_0_22px_rgba(255,255,255,0.5)] dark:hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),inset_0_0_26px_rgba(255,255,255,0.08)]',
                      'ring-1 ring-black/5 dark:ring-1 dark:ring-white/5',
                      pos.borderRadius,
                      'hover:bg-neutral-200/40 dark:hover:bg-neutral-800/60 active:scale-[0.98]'
                    )}
                  >
                    {/* Counter-rotate content by -45deg so text and icon remain upright */}
                    <div className="-rotate-45 flex flex-col items-center justify-center text-center p-3 pointer-events-none">
                      {/* Plus Icon - Centered when unhovered, glides up smoothly on hover */}
                      <IconPlus
                        className={cn(
                          'text-neutral-300 dark:text-neutral-600 transition-all duration-200 ease-out',
                          'translate-y-2 group-hover:translate-y-0 ',
                          isMax ? 'h-6 w-6 sm:h-7 sm:w-7' : 'h-5 w-5 sm:h-6 sm:w-6'
                        )}
                        stroke={2.2}
                      />

                      {/* Claim Text - Appears on hover with smooth fade & slide animation */}
                      <span
                        className={cn(
                          'whitespace-nowrap font-medium tracking-tight leading-none',
                          'text-neutral-400 dark:text-neutral-600 transition-all duration-200 ease-out',
                          'opacity-0 translate-y-2.5 group-hover:opacity-100 group-hover:translate-y-0',
                          isMax
                            ? 'text-xs sm:text-[13px] mt-1'
                            : 'text-[11px] sm:text-xs mt-1'
                        )}
                      >
                        {isMax ? 'claim your max spot' : 'claim your core spot'}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Become a Sponsor Button - Centered Below Sponsor Cards at the End of the Section */}
        <div className="mt-8 sm:mt-12 flex items-center justify-center">
          <Link
            href="/sponsors#pricing"
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-primary px-6 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-pill-glow transition-all hover:opacity-95 active:scale-98"
          >
            <IconHeart className="h-4 w-4 fill-current" />
            <span>Become a Sponsor</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default SponsorsSection;
