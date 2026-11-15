'use client';

import React from 'react';
import { SPONSOR_LINK, getSponsorUrl, PRICING_TIERS, type PricingTier } from './sponsors-data';
export { PRICING_TIERS, type PricingTier };
import { IconCheck } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

// ============================================================================
// CUSTOM VECTOR ICONS (Light Brand Color Fill + Crisp Brand Blue Stroke)
// All 3 icons share the exact same palette, stroke style, and scale with NO background/shadow
// ============================================================================

// 1. Feather Icon (Streamline Plump Feather)
export function FeatherIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-9 h-9 sm:w-10 sm:h-10 shrink-0 opacity-60', className)}
    >
      {/* Light Brand Color Fill Body */}
      <path
        d="M28.68 36.48c-7.364 4.322 -14.976 4.651 -23.18 4.02L7 36.001c0 -11.868 6.265 -22.273 15.668 -28.088a0.978 0.978 0 0 1 1.308 0.27L26 11c0.348 -1.858 2 -5.75 2 -5.75A32.918 32.918 0 0 1 40.001 3c1.072 0 2.132 0.051 3.178 0.151a1.852 1.852 0 0 1 1.67 1.67c0.1 1.046 0.151 2.106 0.151 3.178 0 9.282 -3.832 17.668 -10 23.665 0 0 -6.697 1.336 -10 1.336l3.598 1.789c0.69 0.343 0.746 1.301 0.081 1.691Z"
        className="fill-[#93c5fd] dark:fill-[#3074fe]/40"
      />
      {/* Brand Blue Stroke Outline */}
      <path
        d="M11.999 41a32.849 32.849 0 0 0 16.68 -4.52c0.665 -0.39 0.61 -1.348 -0.081 -1.691L25 33c3.303 0 10 -1.337 10 -1.337 7.147 -6.948 10.78 -16.97 9.848 -26.842a1.85 1.85 0 0 0 -1.67 -1.67A33.202 33.202 0 0 0 28 5.25S26.348 9.142 26 11l-2.024 -2.817a0.981 0.981 0 0 0 -1.309 -0.271C13.264 13.687 7 23.36 7 36.5"
        stroke="#3074fe"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Central Quill Stem */}
      <path
        d="M3 45c5 -14.5 21 -27 34 -34"
        stroke="#3074fe"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 2. Module Cube Icon (Core Tier - Streamline Sharp Module Cube)
export function CoreModuleCubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-9 h-9 sm:w-10 sm:h-10 shrink-0 opacity-60', className)}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 9.19462 1.76178 5.18836 12 1l10.2382 4.18836L12 9.19462Zm0.75 1.31728L23 6.50103V18.5l-10.25 4.1932V10.5119Zm-1.5 0L1 6.50103V18.5l10.25 4.1932V10.5119Z"
        className="fill-[#93c5fd] dark:fill-[#3074fe]/40"
        stroke="#3074fe"
        strokeWidth="0.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 3. Crown Icon (Max Tier)
export function CrownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-9 h-9 sm:w-10 sm:h-10 shrink-0 opacity-60', className)}
    >
      {/* 4-Point Sparkle Diamond Star */}
      <path
        d="M 24 3.5 Q 24 7.5 28 7.5 Q 24 7.5 24 11.5 Q 24 7.5 20 7.5 Q 24 7.5 24 3.5 Z"
        className="fill-[#93c5fd] dark:fill-[#3074fe]/40"
        stroke="#3074fe"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Royal Crown Body with Fill & Stroke */}
      <path
        d="M 6.5 17.5 C 7.5 25.5 12 37 24 37 C 36 37 40.5 25.5 41.5 17.5 C 41.8 16 40 15.2 38.8 16.5 C 35.5 20.5 32.2 21.8 29.2 19.5 C 27 17.8 26 13.5 24 13.5 C 22 13.5 21 17.8 18.8 19.5 C 15.8 21.8 12.5 20.5 9.2 16.5 C 8 15.2 6.2 16 6.5 17.5 Z"
        className="fill-[#93c5fd] dark:fill-[#3074fe]/40"
        stroke="#3074fe"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Crown Base Bar with Fill & Stroke */}
      <rect
        x="8.5"
        y="41"
        width="31"
        height="3.5"
        rx="1.75"
        className="fill-[#93c5fd] dark:fill-[#3074fe]/40"
        stroke="#3074fe"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PricingCard({
  tier,
  className,
}: {
  tier: PricingTier;
  className?: string;
}) {
  return (
    <div
      id={`pricing-${tier.id}`}
      className={cn(
        'group relative flex flex-col justify-between rounded-[24px] p-5 sm:p-5.5 select-none min-h-[420px] scroll-mt-24',
        // Exact sponsor card styling & soft tactile inset glow:
        'bg-neutral-100 dark:bg-neutral-800',
        'shadow-[inset_0_1px_2px_rgba(255,255,255,0.75),inset_0_0_18px_rgba(255,255,255,0.35)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.16),inset_0_0_22px_rgba(255,255,255,0.05)]',
        'border border-black/5 dark:border-white/5',
        'transition-all duration-300 hover:scale-[1.015]',
        tier.featured && 'ring-1 ring-blue-500/40 dark:ring-blue-400/40',
        className
      )}
    >
      {/* Tilted Sticker on the Top-Left Corner for Most Popular */}
      {tier.featured && (
        <div className="absolute -top-3 -left-2.5 sm:-left-3.5 -rotate-6 z-20 pointer-events-none select-none">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-none bg-[#3074fe] text-white text-[10px] font-semibold font-mono tracking-wider uppercase shadow-pill-glow">
            Most Popular
          </span>
        </div>
      )}

      {/* Top Area: Header with Title & Tagline on Left, Clean Icon (NO background/shadow) on Right */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 pr-1">
            <h3 className="text-base sm:text-lg font-medium text-foreground tracking-tight leading-snug">
              {tier.name}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
              {tier.tagline}
            </p>
          </div>

          {/* Clean Icon directly on card: Zero background box, zero shadow */}
          <div className="shrink-0 pt-0.5 select-none">
            {tier.id === 'lite' && <FeatherIcon />}
            {tier.id === 'core' && <CoreModuleCubeIcon />}
            {tier.id === 'max' && <CrownIcon />}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1 my-3 pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
          <span className="text-3xl font-medium tracking-tight text-foreground leading-none">
            ${tier.price}
          </span>
          <span className="text-xs text-muted-foreground font-mono">
            /month
          </span>
        </div>

        {/* Feature Checklist */}
        <ul className="space-y-2 mb-6">
          {tier.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
              <IconCheck
                className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"
                stroke={2.5}
              />
              <span className="text-neutral-700 dark:text-neutral-200">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom CTA Button: Black for Lite & Max, Brand Blue with shadow-pill-glow for Core */}
      <a
        href={getSponsorUrl(SPONSOR_LINK)}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'inline-flex items-center justify-center w-full py-2.5 px-4 rounded-lg text-xs sm:text-[13px] font-semibold tracking-wide text-center transition-all duration-200 active:scale-98',
          tier.buttonVariant === 'primary'
            ? 'bg-primary text-primary-foreground shadow-pill-glow hover:opacity-95'
            : 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-pill-glow'
        )}
      >
        {tier.ctaText}
      </a>
    </div>
  );
}

export function SponsorPricing() {
  return (
    <section id="pricing" className="w-full mt-16 sm:mt-24 mb-12 scroll-mt-20">
      {/* Section Header */}
      <div className="mb-8 text-center max-w-xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground leading-snug">
          Sponsorship Tiers
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
          Put your brand in front of thousands of active front-end builders and support independent open-source craft.
        </p>
      </div>

      {/* Centered, Restrained Container for Less Width & More Height (Proper Portrait Cards) */}
      <div className="mx-auto max-w-[880px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRICING_TIERS.map((tier) => (
            <PricingCard key={tier.id} tier={tier} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default SponsorPricing;
