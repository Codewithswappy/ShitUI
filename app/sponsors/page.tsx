'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  SPONSOR_LINK,
  getSponsorUrl,
} from '@/components/new-design-components/sponsors-data';
import { SponsorPricing } from '@/components/new-design-components/SponsorPricing';
import { TopNavigation } from '@/components/new-design-components/TopNavigation';
import { NewFooter } from '@/components/new-design-components/NewFooter';
import { IconArrowLeft, IconPlus } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

// ============================================================================
// 4 CUSTOM CLEAN CHARTS (Inspired by the reference image styles)
// Modeled precisely with vibrant colors that look stunning in light & dark mode
// ============================================================================

// 1. Dot Matrix Histogram (Image 1 Style - Brand Blue)
function DotMatrixChart({ color = '#3074fe' }: { color?: string }) {
  const columns = [3, 2, 2, 3, 4, 3, 2, 2, 3, 4, 3, 5, 6];
  const dotR = 2.4;
  const colGap = 8.5;
  const rowGap = 7.5;
  const startX = 6;
  const baselineY = 52;

  return (
    <svg
      viewBox="0 0 120 58"
      className="w-full h-full overflow-visible pointer-events-none select-none"
      preserveAspectRatio="none"
    >
      {columns.map((count, colIdx) => {
        const x = startX + colIdx * colGap;
        return Array.from({ length: count }).map((_, dotIdx) => {
          const y = baselineY - dotIdx * rowGap;
          const isTop = dotIdx === count - 1;
          const opacity = isTop ? 1 : 0.58 + (dotIdx / count) * 0.38;
          return (
            <circle
              key={`${colIdx}-${dotIdx}`}
              cx={x}
              cy={y}
              r={dotR}
              fill={color}
              fillOpacity={opacity}
            />
          );
        });
      })}
    </svg>
  );
}

// 2. Smooth Mountain Spline Wave Area (Image 5 Style - Mint/Emerald)
function SmoothMountainSplineChart({ color = '#10b981' }: { color?: string }) {
  const points = [
    [0, 46],
    [15, 34],
    [32, 40],
    [48, 18],
    [64, 32],
    [78, 22],
    [92, 34],
    [106, 16],
    [120, 28],
  ];

  let pathD = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev[0] + curr[0]) / 2;
    pathD += ` C ${midX} ${prev[1]}, ${midX} ${curr[1]}, ${curr[0]} ${curr[1]}`;
  }

  const fillD = `${pathD} L 120 56 L 0 56 Z`;

  return (
    <svg
      viewBox="0 0 120 58"
      className="w-full h-full overflow-visible pointer-events-none select-none"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="mountainSplineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.32} />
          <stop offset="100%" stopColor={color} stopOpacity={0.0} />
        </linearGradient>
      </defs>
      <path d={fillD} fill="url(#mountainSplineGrad)" />
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 3. Hatched Stepped Staircase Area (Image 4 Style - Violet)
function HatchedSteppedAreaChart({ color = '#8b5cf6' }: { color?: string }) {
  const steps = [
    { x2: 18, y: 44 },
    { x2: 36, y: 36 },
    { x2: 54, y: 28 },
    { x2: 72, y: 22 },
    { x2: 90, y: 16 },
    { x2: 106, y: 12 },
    { x2: 120, y: 6 },
  ];

  let stepPath = `M 0 ${steps[0].y}`;
  for (let i = 0; i < steps.length; i++) {
    stepPath += ` H ${steps[i].x2}`;
    if (i < steps.length - 1) {
      stepPath += ` V ${steps[i + 1].y}`;
    }
  }

  const stepFill = `${stepPath} L 120 56 L 0 56 Z`;

  const hatchLines = [6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108, 114].map((x) => {
    const step = steps.find((s) => x <= s.x2) || steps[steps.length - 1];
    return { x, yTop: step.y };
  });

  return (
    <svg
      viewBox="0 0 120 58"
      className="w-full h-full overflow-visible pointer-events-none select-none"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="steppedAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0.0} />
        </linearGradient>
      </defs>
      <path d={stepFill} fill="url(#steppedAreaGrad)" />
      {hatchLines.map((line, i) => (
        <line
          key={i}
          x1={line.x}
          y1={line.yTop + 1}
          x2={line.x}
          y2={54}
          stroke={color}
          strokeWidth={1}
          strokeOpacity={0.24}
        />
      ))}
      <path
        d={stepPath}
        fill="none"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 4. Thin Pin-Bars Candlestick Histogram (Image 3 Style - Amber/Gold)
function ThinPinBarsChart({ color = '#f59e0b' }: { color?: string }) {
  const bars = [16, 22, 18, 26, 32, 48, 56, 52, 44, 26, 30, 36, 42, 38, 44, 50];
  const maxH = 50;
  const startX = 4;
  const barW = 2.4;
  const gap = 5.2;

  return (
    <svg
      viewBox="0 0 120 58"
      className="w-full h-full overflow-visible pointer-events-none select-none"
      preserveAspectRatio="none"
    >
      {bars.map((val, i) => {
        const h = Math.max(6, (val / 56) * maxH);
        const x = startX + i * (barW + gap);
        const y = 56 - h;
        const isHighlight = val >= 44;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barW}
            height={h}
            rx={1.2}
            fill={color}
            fillOpacity={isHighlight ? 1 : 0.45}
          />
        );
      })}
    </svg>
  );
}

// ============================================================================
// DIAMOND SPONSOR CARD
// Identical 45° diamond shape, soft inset glow, and instant CSS hover fade text
// ============================================================================
interface DiamondCardProps {
  type: 'max' | 'core' | 'lite';
  size: number;
  borderRadius: string;
  claimText: string;
}

function DiamondSponsorCard({
  type,
  size,
  borderRadius,
  claimText,
}: DiamondCardProps) {
  const isMax = type === 'max';
  const isLite = type === 'lite';

  return (
    <a
      href={`#pricing-${type}`}
      style={{
        width: size,
        height: size,
        transform: 'rotate(45deg)',
        transformOrigin: 'center center',
      }}
      className={cn(
        'group relative flex shrink-0 items-center justify-center select-none cursor-pointer',
        // Exact same background & soft inset glow as landing section:
        'bg-neutral-100 dark:bg-neutral-800',
        'shadow-[inset_0_1px_2px_rgba(255,255,255,0.75),inset_0_0_18px_rgba(255,255,255,0.35)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.16),inset_0_0_22px_rgba(255,255,255,0.05)]',
        'hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),inset_0_0_22px_rgba(255,255,255,0.5)] dark:hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),inset_0_0_26px_rgba(255,255,255,0.08)]',
        'border border-black/5 dark:border-white/5',
        borderRadius,
        'transition-all duration-300 hover:scale-[1.04] active:scale-[0.98]',
        'hover:bg-neutral-200/80 dark:hover:bg-neutral-700/80'
      )}
    >
      {/* Counter-rotate content by -45deg so text and icon remain upright */}
      <div className="-rotate-45 flex flex-col items-center justify-center text-center p-3 pointer-events-none select-none">
        <IconPlus
          className={cn(
            'text-neutral-500 dark:text-neutral-200 transition-all duration-200 ease-out',
            'translate-y-2 group-hover:translate-y-0 group-hover:text-foreground',
            isMax
              ? 'h-6 w-6 sm:h-7 sm:w-7'
              : isLite
              ? 'h-4 w-4 sm:h-5 sm:w-5'
              : 'h-5 w-5 sm:h-6 sm:w-6'
          )}
          stroke={2.2}
        />

        <span
          className={cn(
            'whitespace-nowrap font-medium tracking-tight leading-none',
            'text-neutral-700 dark:text-neutral-200 transition-all duration-200 ease-out',
            'opacity-0 translate-y-2.5 group-hover:opacity-100 group-hover:translate-y-0',
            isMax
              ? 'text-xs sm:text-[13px] mt-1'
              : isLite
              ? 'text-[10px] sm:text-[11px] mt-0.5'
              : 'text-[11px] sm:text-xs mt-1'
          )}
        >
          {claimText}
        </span>
      </div>
    </a>
  );
}

export default function SponsorsPage() {
  const [liveStars, setLiveStars] = useState<number | null>(null);

  useEffect(() => {
    // Fetch live stars from GitHub API for real numbers
    fetch('https://api.github.com/repos/Codewithswappy/RareUI')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.stargazers_count === 'number') {
          setLiveStars(data.stargazers_count);
        }
      })
      .catch(() => {});
  }, []);

  const formattedStars = liveStars
    ? liveStars >= 1000
      ? `${(liveStars / 1000).toFixed(1)}K`
      : liveStars.toLocaleString()
    : '2.4K';

  return (
    <div className="relative min-h-screen w-full bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary">
      <TopNavigation />

      {/* Expanded Container Width for generous card proportions */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Heading & Sub Heading - Small, Left-aligned like HeroCard */}
        <div className="flex max-w-2xl flex-col space-y-1.5 text-left mb-8 sm:mb-10">
          <h1 className="text-xl font-medium tracking-tight text-foreground leading-snug sm:text-2xl">
            Support ShitUI. <br />
            Built for Builders. Backed by You.
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            A collection of living, interactive components crafted with obsessive care. Back the project, claim your spot, and put your product in front of thousands of developers every day.
          </p>
        </div>

        {/* =================================================================== */}
        {/* 4 CORE METRICS (Expanded Width, Proper Rectangles, Custom Clean Charts) */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-16">
          {/* Card 1: Monthly Visitors (Dot Matrix Histogram - Brand Blue) */}
          <div className="flex flex-col justify-between rounded-2xl p-4 sm:p-5 min-h-[148px] bg-neutral-100 dark:bg-neutral-800 border border-black/5 dark:border-white/5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.75),inset_0_0_18px_rgba(255,255,255,0.35)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.16),inset_0_0_22px_rgba(255,255,255,0.05)] transition-all duration-300 hover:scale-[1.015]">
            {/* Top row: Period on left, +number on RIGHT TOP */}
            <div className="flex items-center justify-between w-full text-[11px] text-muted-foreground font-mono">
              <span>Last 30 days</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                +231.6%
              </span>
            </div>

            {/* Main content: Number + Full visible label on left, Custom Chart on right */}
            <div className="flex items-end justify-between gap-3 mt-2.5">
              <div className="min-w-0 flex-1">
                <div className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground leading-none">
                  1.9K
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-1.5 leading-tight font-normal">
                  Monthly visitors (unique)
                </p>
              </div>

              {/* Chart on right: Dot Matrix (Brand Blue) */}
              <div className="w-28 sm:w-34 h-14 sm:h-16 shrink-0">
                <DotMatrixChart color="#3074fe" />
              </div>
            </div>
          </div>

          {/* Card 2: Monthly Pageviews (Smooth Mountain Spline - Mint/Emerald) */}
          <div className="flex flex-col justify-between rounded-2xl p-4 sm:p-5 min-h-[148px] bg-neutral-100 dark:bg-neutral-800 border border-black/5 dark:border-white/5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.75),inset_0_0_18px_rgba(255,255,255,0.35)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.16),inset_0_0_22px_rgba(255,255,255,0.05)] transition-all duration-300 hover:scale-[1.015]">
            {/* Top row: Period on left, +number on RIGHT TOP */}
            <div className="flex items-center justify-between w-full text-[11px] text-muted-foreground font-mono">
              <span>Last 30 days</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                +202.2%
              </span>
            </div>

            {/* Main content: Number + Full visible label on left, Custom Chart on right */}
            <div className="flex items-end justify-between gap-3 mt-2.5">
              <div className="min-w-0 flex-1">
                <div className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground leading-none">
                  12K
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-1.5 leading-tight font-normal">
                  Monthly pageviews
                </p>
              </div>

              {/* Chart on right: Smooth Mountain Spline (Emerald) */}
              <div className="w-28 sm:w-34 h-14 sm:h-16 shrink-0">
                <SmoothMountainSplineChart color="#10b981" />
              </div>
            </div>
          </div>

          {/* Card 3: All-time Pageviews (Hatched Stepped Staircase - Violet) */}
          <div className="flex flex-col justify-between rounded-2xl p-4 sm:p-5 min-h-[148px] bg-neutral-100 dark:bg-neutral-800 border border-black/5 dark:border-white/5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.75),inset_0_0_18px_rgba(255,255,255,0.35)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.16),inset_0_0_22px_rgba(255,255,255,0.05)] transition-all duration-300 hover:scale-[1.015]">
            {/* Top row: Period on left, +number on RIGHT TOP */}
            <div className="flex items-center justify-between w-full text-[11px] text-muted-foreground font-mono">
              <span>All-time reach</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                +2,493%
              </span>
            </div>

            {/* Main content: Number + Full visible label on left, Custom Chart on right */}
            <div className="flex items-end justify-between gap-3 mt-2.5">
              <div className="min-w-0 flex-1">
                <div className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground leading-none">
                  30K
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-1.5 leading-tight font-normal">
                  Total pageviews since launch
                </p>
              </div>

              {/* Chart on right: Hatched Stepped Staircase (Violet) */}
              <div className="w-28 sm:w-34 h-14 sm:h-16 shrink-0">
                <HatchedSteppedAreaChart color="#8b5cf6" />
              </div>
            </div>
          </div>

          {/* Card 4: GitHub Stars (Thin Pin-Bars Candlestick - Amber/Gold) */}
          <div className="flex flex-col justify-between rounded-2xl p-4 sm:p-5 min-h-[148px] bg-neutral-100 dark:bg-neutral-800 border border-black/5 dark:border-white/5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.75),inset_0_0_18px_rgba(255,255,255,0.35)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.16),inset_0_0_22px_rgba(255,255,255,0.05)] transition-all duration-300 hover:scale-[1.015]">
            {/* Top row: Period on left, +number on RIGHT TOP */}
            <div className="flex items-center justify-between w-full text-[11px] text-muted-foreground font-mono">
              <span>Community trust</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                +18 this month
              </span>
            </div>

            {/* Main content: Number + Full visible label on left, Custom Chart on right */}
            <div className="flex items-end justify-between gap-3 mt-2.5">
              <div className="min-w-0 flex-1">
                <div className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground leading-none">
                  {formattedStars}
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-1.5 leading-tight font-normal">
                  GitHub stargazers
                </p>
              </div>

              {/* Chart on right: Thin Pin-Bars Candlestick (Amber/Gold) */}
              <div className="w-28 sm:w-34 h-14 sm:h-16 shrink-0">
                <ThinPinBarsChart color="#f59e0b" />
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* SPONSOR TIERS (Just tier name on left small font-medium, no price)  */}
        {/* =================================================================== */}

        {/* TIER 1: MAX SPONSORS */}
        <section className="mb-14 sm:mb-18">
          <div className="mb-6 text-left">
            <h2 className="text-sm sm:text-base font-medium text-foreground tracking-tight">
              Max Sponsors
            </h2>
          </div>

          {/* Symmetrical Diamond Cards for Max */}
          <div className="relative flex w-full items-center justify-center py-6 sm:py-8 overflow-visible">
            <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14">
              <DiamondSponsorCard
                type="max"
                size={200}
                borderRadius="rounded-[32px]"
                claimText="claim your max spot"
              />
              <DiamondSponsorCard
                type="max"
                size={200}
                borderRadius="rounded-[32px]"
                claimText="claim your max spot"
              />
              <DiamondSponsorCard
                type="max"
                size={200}
                borderRadius="rounded-[32px]"
                claimText="claim your max spot"
              />
            </div>
          </div>
        </section>

        {/* TIER 2: CORE SPONSORS */}
        <section className="mb-14 sm:mb-18">
          <div className="mb-6 text-left">
            <h2 className="text-sm sm:text-base font-medium text-foreground tracking-tight">
              Core Sponsors
            </h2>
          </div>

          {/* Symmetrical Diamond Cards for Core */}
          <div className="relative flex w-full items-center justify-center py-6 sm:py-8 overflow-visible">
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-10">
              <DiamondSponsorCard
                type="core"
                size={155}
                borderRadius="rounded-[24px]"
                claimText="claim your core spot"
              />
              <DiamondSponsorCard
                type="core"
                size={155}
                borderRadius="rounded-[24px]"
                claimText="claim your core spot"
              />
              <DiamondSponsorCard
                type="core"
                size={155}
                borderRadius="rounded-[24px]"
                claimText="claim your core spot"
              />
              <DiamondSponsorCard
                type="core"
                size={155}
                borderRadius="rounded-[24px]"
                claimText="claim your core spot"
              />
            </div>
          </div>
        </section>

        {/* TIER 3: LITE SPONSORS */}
        <section className="mb-14 sm:mb-18">
          <div className="mb-6 text-left">
            <h2 className="text-sm sm:text-base font-medium text-foreground tracking-tight">
              Lite Sponsors
            </h2>
          </div>

          {/* Symmetrical Diamond Cards for Lite */}
          <div className="relative flex w-full items-center justify-center py-6 sm:py-8 overflow-visible">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
              <DiamondSponsorCard
                type="lite"
                size={125}
                borderRadius="rounded-[18px]"
                claimText="claim your lite spot"
              />
              <DiamondSponsorCard
                type="lite"
                size={125}
                borderRadius="rounded-[18px]"
                claimText="claim your lite spot"
              />
              <DiamondSponsorCard
                type="lite"
                size={125}
                borderRadius="rounded-[18px]"
                claimText="claim your lite spot"
              />
              <DiamondSponsorCard
                type="lite"
                size={125}
                borderRadius="rounded-[18px]"
                claimText="claim your lite spot"
              />
              <DiamondSponsorCard
                type="lite"
                size={125}
                borderRadius="rounded-[18px]"
                claimText="claim your lite spot"
              />
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* SPONSORSHIP PRICING CARDS (At the end, below all sponsor tiers)    */}
        {/* =================================================================== */}
        <SponsorPricing />
      </div>

      <NewFooter />
    </div>
  );
}
