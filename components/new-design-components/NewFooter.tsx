'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Link } from 'next-view-transitions';
import { PixelDitherText } from './PixelDitherText';
import { PixelDither, DitherVariant, DitherShape } from './PixelDither';
import { DuoGithub, DuoXCom } from './DuoIcons';
import GradualBlur from './GradualBlur';

export interface NewFooterProps {
  /**
   * Edge style for the pixel dither top border:
   * - 'organic': Natural, jagged Bayer stipple terrain.
   * - 'straight': Clean linear gradient with straight solid pixel rows.
   * Default: 'straight'
   */
  ditherVariant?: DitherVariant;

  /**
   * Shape of the dither pixels:
   * - 'square': Classic retro pixel squares/boxes.
   * - 'circle': Smooth round halftone dots.
   * Default: 'square'
   */
  ditherShape?: DitherShape;

  /**
   * Box / Dot size in pixels (e.g. 2, 3, 4).
   * Default: 3
   */
  pixelSize?: number;

  /**
   * Primary color for the pixel dither display text and top border.
   * Defaults to primary blue (#2563EB).
   */
  ditherColor?: string;

  /**
   * Optional secondary color / shimmer highlight.
   */
  secondaryColor?: string;

  /**
   * Optional splash droplet highlight color.
   */
  highlightColor?: string;

  /**
   * Text opacity (0 to 1).
   */
  opacity?: number;

  /**
   * Turn the click ripple particle effect ON or OFF.
   * Default: true
   */
  rippleEffect?: boolean;

  /**
   * Whether mouse hover & interactions are active.
   * Default: true
   */
  interactive?: boolean;

  /**
   * Whether to include the bottom gradual blur overlay.
   * Default: true
   */
  showGradualBlur?: boolean;
}

export function NewFooter({
  ditherVariant = 'straight',
  ditherShape = 'square',
  pixelSize = 3,
  ditherColor = '#2563EB',
  secondaryColor = '#60A5FA',
  highlightColor = '#000',
  opacity = 1,
  rippleEffect = true,
  interactive = true,
  showGradualBlur = true,
}: NewFooterProps = {}) {
  const [triggerRipple, setTriggerRipple] = useState<{ x: number; y: number; id?: number } | null>(
    null
  );

  const footerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const handleFooterClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!interactive || !rippleEffect) return;
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) return;
    if (!stageRef.current) return;
    const stageRect = stageRef.current.getBoundingClientRect();
    setTriggerRipple({
      x: e.clientX - stageRect.left,
      y: e.clientY - stageRect.top,
      id: Math.random(),
    });
  };

  return (
    <footer ref={footerRef} className="relative z-[200] w-full bg-transparent select-none">
      {/* ─── 1. Pixel Dither Top Transition: Sits OUTSIDE on the page background ─── */}
      <div className="pointer-events-none relative -mb-px w-full overflow-hidden select-none opacity-25 dark:opacity-20">
        <PixelDither
          variant={ditherVariant}
          shape={ditherShape}
          side="bottom"
          borderSize={100}
          pixelSize={2}
          color={ditherColor || '#2563EB'}
          secondaryColor={secondaryColor}
          density={1}
          animated={true}
          speed={0.85}
          interactive={true}
          clickAnimation={true}
          rippleSpread={0}
          className="h-50 w-full sm:h-60"
        />
      </div>

      {/* ─── 2. Main Footer Body (Container for Content & Big Text) ───────── */}
      <div
        ref={stageRef}
        onClick={handleFooterClick}
        className="relative w-full cursor-pointer overflow-hidden bg-transparent text-foreground transition-colors select-none"
      >
        {/* ─── Upper Content & Navigation ──────────────────────────────────── */}
        <div className="pointer-events-auto relative z-10 mx-auto max-w-[1500px] px-6 pt-10 pb-40 sm:px-10 sm:pt-12 sm:pb-44 md:pb-52 lg:px-12 lg:pb-60">
          {/* Top Section: Brand + Mission & Horizontal Navlinks */}
          <div className="flex flex-col justify-between gap-8 pb-10 lg:flex-row lg:items-start lg:gap-16">
            {/* Brand Column */}
            <div className="max-w-md space-y-4">
              <Link
                href="/"
                className="group inline-flex items-center gap-1 select-none"
                aria-label="ShitUI Home"
              >
                <Image
                  className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-105 shadow-sm shadow-black/10 ring-1 ring-border p-1 bg-neutral-100 rounded-lg"
                  src="/logo/shitlogo1.svg"
                  alt="ShitUI Logo"
                  width={32}
                  height={32}
                />
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-bold tracking-tight text-foreground">ShitUI</span>
                  <span className="rounded-md border border-border/60 self-start bg-secondary px-2 py-0.5 font-mono text-[8px] font-semibold tracking-wider text-muted-foreground uppercase shadow-pill-inset">
                    v2.0
                  </span>
                </div>
              </Link>

              <p className="max-w-md text-sm leading-relaxed font-normal text-muted-foreground">
                The component library for developers who care about details. Beautiful by default,
                interactive by nature, and effortlessly customizable.
              </p>
            </div>

            {/* Right Side: Navlinks - clean 2-column grid on mobile (3 balanced rows), row on desktop */}
            <nav className="grid grid-cols-2 gap-x-8 gap-y-3.5 pt-2 text-sm text-muted-foreground sm:flex sm:flex-wrap sm:items-center sm:gap-8 sm:pt-1">
              <Link
                href="/docs/introduction"
                className="transition-colors hover:text-foreground"
              >
                Documentation
              </Link>
              <Link
                href="/docs/installation/cli"
                className="transition-colors hover:text-foreground"
              >
                CLI Installation
              </Link>
              <Link
                href="/changelog"
                className="transition-colors hover:text-foreground"
              >
                Changelog
              </Link>
              <Link
                href="/pricing"
                className="transition-colors hover:text-foreground"
              >
                Pricing
              </Link>
              <Link
                href="/terms"
                className="transition-colors hover:text-foreground"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="transition-colors hover:text-foreground"
              >
                Privacy
              </Link>
            </nav>
          </div>

          {/* ─── Bottom Bar: Clean, balanced layout on both mobile & desktop ──────── */}
          <div className="flex flex-col-reverse gap-4 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:pt-4">
            {/* Left: Copyright */}
            <div>
              © {new Date().getFullYear()} ShitUI. Crafted with care by{' '}
              <Link
                href="https://x.com/heyyswap"
                target="_blank"
                rel="noreferrer"
                className="text-foreground hover:underline"
              >
                Swapnil Kalambe
              </Link>.
            </div>

            {/* Right: Social Links */}
            <div className="flex items-center gap-6">
              <Link
                href="https://github.com/Codewithswappy/ShitUI"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <DuoGithub className="h-4 w-4" />
                <span>GitHub</span>
              </Link>
              <Link
                href="https://x.com/shituihq"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <DuoXCom className="h-4 w-4" />
                <span>Twitter / X</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ─── Big Bottom SHITUI Text (Directly in Footer Container) ───────── */}
        <PixelDitherText
          text="SHITUI"
          pixelSize={pixelSize}
          shape={ditherShape}
          // Light mode colors (clear, punchy, high-contrast pixels):
          color="#93c5fd"
          secondaryColor="#3074FE"
          highlightColor="#60a5fa"
          opacity={0.88}
          // Dark mode colors:
          darkColor="white"
          darkSecondaryColor="#3074FE"
          darkHighlightColor="#7dd3fc"
          darkOpacity={1}
          density={1}
          interactive={interactive}
          rippleEffect={rippleEffect}
          align="bottom"
          fullWidth={true}
          scale={0.75}
          springStretch={true}
          triggerRipple={triggerRipple}
          sparkle={true}
          className="pointer-events-auto absolute inset-0 z-0 h-full w-full"
        />

        {/* Seamless floor extension so rubber-band overscroll pull never shows empty gap beneath footer */}
        <div className="pointer-events-none absolute inset-x-0 -bottom-96 h-96 bg-background" />
      </div>

      {/* ─── 3. Fixed Bottom Gradual Blur Overlay (Scoped directly inside footer) ─── */}
      {showGradualBlur && (
        <GradualBlur
          target="page"
          position="bottom"
          responsive={true}
          mobileHeight="5rem"
          tabletHeight="6rem"
          desktopHeight="7rem"
          height="7rem"
          strength={2}
          divCount={5}
          curve="bezier"
          exponential={false}
          opacity={0.85}
          zIndex={20}
        />
      )}
    </footer>
  );
}

export default NewFooter;
