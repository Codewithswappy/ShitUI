'use client';

import React from 'react';
import { motion, type Variants } from 'motion/react';

interface RareLogoProps extends React.ComponentPropsWithoutRef<typeof motion.svg> {
  className?: string;
  size?: number;

  /** Enable clean path drawing and motion path animations (Default: true) */
  animated?: boolean;
  /** Re-animate path and playful mascot blink on hover (Default: true) */
  animateOnHover?: boolean;

  /** Color of the top apex swirl stroke (Default: '#3074fe') */
  topColor?: string;
  /** Opacity of the top swirl stroke (Default: 0.9) */
  topOpacity?: number;
  /** Fill color of the top swirl (Default: 'none') */
  topFill?: string;
  /** Opacity of the top swirl fill (Default: 0.2) */
  topFillOpacity?: number;
  /** Stroke width of top swirl (Default: 1.5) */
  topStrokeWidth?: number;

  /** Color of the middle swirl coil stroke (Default: '#3074fe') */
  middleColor?: string;
  /** Opacity of the middle swirl stroke (Default: 0.9) */
  middleOpacity?: number;
  /** Fill color of the middle swirl coil (Default: 'none') */
  middleFill?: string;
  /** Opacity of the middle swirl fill (Default: 0.2) */
  middleFillOpacity?: number;
  /** Stroke width of middle swirl (Default: 1.5) */
  middleStrokeWidth?: number;

  /** Color of the bottom cushion base outline (Default: 'currentColor') */
  bottomColor?: string;
  /** Opacity of the bottom cushion base outline (Default: 0.4) */
  bottomOpacity?: number;
  /** Fill color of the bottom cushion (Default: 'none') */
  bottomFill?: string;
  /** Opacity of the bottom cushion fill (Default: 0.15) */
  bottomFillOpacity?: number;
  /** Stroke width of bottom cushion (Default: 2) */
  bottomStrokeWidth?: number;

  /** Color of the two vertical pill eyes (Default: 'currentColor') */
  eyeColor?: string;
  /** Opacity of the two vertical pill eyes (Default: 1) */
  eyeOpacity?: number;
  /** Stroke width of the eyes (Default: 2) */
  eyeStrokeWidth?: number;
}

export function RareLogo({
  className = 'h-6 w-6 text-primary',
  size,
  animated = true,
  animateOnHover = true,
  topColor = '#3074fe',
  topOpacity = 0.9,
  topFill = 'none',
  topFillOpacity = 0.2,
  topStrokeWidth = 1.5,
  middleColor = '#3074fe',
  middleOpacity = 0.9,
  middleFill = 'none',
  middleFillOpacity = 0.2,
  middleStrokeWidth = 1.5,
  bottomColor = 'currentColor',
  bottomOpacity = 0.4,
  bottomFill = 'none',
  bottomFillOpacity = 0.15,
  bottomStrokeWidth = 2,
  eyeColor = 'currentColor',
  eyeOpacity = 1,
  eyeStrokeWidth = 2,
  ...props
}: RareLogoProps) {
  const hasTopFill = topFill && topFill !== 'none';
  const hasMiddleFill = middleFill && middleFill !== 'none';
  const hasBottomFill = bottomFill && bottomFill !== 'none';

  // Smooth easing curve
  const easeOutCubic: [number, number, number, number] = [0.22, 1, 0.36, 1];

  // Motion variants for progressive path drawing
  const topSwirlVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: topOpacity,
      transition: {
        pathLength: { duration: 0.85, ease: easeOutCubic, delay: 0.05 },
        opacity: { duration: 0.2, delay: 0.05 },
      },
    },
    hover: {
      rotate: [0, -3.5, 3, -1.5, 0],
      transition: { duration: 0.65, ease: 'easeInOut' },
    },
  };

  const middleSwirlVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: middleOpacity,
      transition: {
        pathLength: { duration: 0.75, ease: easeOutCubic, delay: 0.25 },
        opacity: { duration: 0.2, delay: 0.25 },
      },
    },
    hover: {
      y: [0, -0.4, 0],
      transition: { duration: 0.45, ease: 'easeInOut' },
    },
  };

  const bottomCushionVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: bottomOpacity,
      transition: {
        pathLength: { duration: 0.85, ease: easeOutCubic, delay: 0.4 },
        opacity: { duration: 0.2, delay: 0.4 },
      },
    },
    hover: {
      scale: [1, 1.025, 1],
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
  };

  const eyesVariants: Variants = {
    hidden: { scaleY: 0, opacity: 0 },
    visible: {
      scaleY: 1,
      opacity: eyeOpacity,
      transition: {
        type: 'spring',
        stiffness: 420,
        damping: 22,
        delay: 0.65,
      },
    },
    hover: {
      scaleY: [1, 0.08, 1],
      transition: { duration: 0.28, times: [0, 0.5, 1], ease: 'easeInOut' },
    },
  };

  const fillVariants: Variants = {
    hidden: { opacity: 0 },
    visible: (customOpacity: number) => ({
      opacity: customOpacity,
      transition: { duration: 0.6, ease: 'easeOut', delay: 0.5 },
    }),
  };

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size || 24}
      height={size || 24}
      fill="none"
      className={className}
      aria-label="RareUI Logo"
      initial={animated ? 'hidden' : false}
      animate={animated ? 'visible' : undefined}
      whileHover={animated && animateOnHover ? 'hover' : undefined}
      style={{ overflow: 'visible' }}
      {...props}
    >
      {/* ======================================================== */}
      {/* OPTIONAL FILL LAYERS (Rendered behind strokes)           */}
      {/* ======================================================== */}
      {hasBottomFill && (
        <motion.path
          d="M 6.29 12.85 C 3.75 14.12, 2.9 16.02, 2.9 17.5 C 2.9 19.41, 5.02 20.89, 12 20.89 C 18.98 20.89, 21.1 19.41, 21.1 17.5 C 21.1 16.02, 20.25 14.12, 17.93 12.85 Z"
          fill={bottomFill}
          custom={bottomFillOpacity}
          variants={animated ? fillVariants : undefined}
          style={!animated ? { opacity: bottomFillOpacity } : undefined}
        />
      )}

      {hasMiddleFill && (
        <motion.path
          d="M 6.5 11.58 C 5.86 12, 5.86 12.42, 6.29 12.85 C 8.83 13.9, 15.39 13.9, 17.93 12.85 C 18.35 12, 17.71 10.52, 16.66 9.46 C 16.02 8.83, 15.49 8.51, 15.22 8.4 Z"
          fill={middleFill}
          custom={middleFillOpacity}
          variants={animated ? fillVariants : undefined}
          style={!animated ? { opacity: middleFillOpacity } : undefined}
        />
      )}

      {/* ======================================================== */}
      {/* 1. TOP SWIRL (Apex and loop curl)                        */}
      {/* ======================================================== */}
      <motion.path
        d="M 12 3.11 C 11.89 4.38, 12 5.44, 11.37 6.5 C 10.52 7.98, 9.04 8.83, 7.77 9.67 C 6.92 10.31, 6.5 10.94, 6.5 11.58 C 6.5 12.42, 8.19 12.42, 10.94 11.58 C 13.27 10.84, 15.17 9.88, 15.28 7.77 C 15.39 5.65, 14.12 3.32, 12 3.11 Z"
        fill={hasTopFill ? topFill : 'none'}
        fillOpacity={hasTopFill ? topFillOpacity : undefined}
        stroke={topColor}
        strokeWidth={topStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transformOrigin: '12px 11px' }}
        variants={animated ? topSwirlVariants : undefined}
      />

      {/* ======================================================== */}
      {/* 2. MIDDLE SWIRL (Middle tier coil and dividing crease)   */}
      {/* ======================================================== */}
      <motion.path
        d="M 6.5 11.58 C 5.86 12, 5.86 12.42, 6.29 12.85 C 8.83 13.9, 15.39 13.9, 17.93 12.85 C 18.35 12, 17.71 10.52, 16.66 9.46 C 16.02 8.83, 15.49 8.51, 15.22 8.4"
        stroke={middleColor}
        strokeWidth={middleStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={animated ? middleSwirlVariants : undefined}
      />

      {/* ======================================================== */}
      {/* 3. BELOW (Bottom cushion face and rounded cheeks)        */}
      {/* ======================================================== */}
      <motion.path
        d="M 6.29 12.85 C 3.75 14.12, 2.9 16.02, 2.9 17.5 C 2.9 19.41, 5.02 20.89, 12 20.89 C 18.98 20.89, 21.1 19.41, 21.1 17.5 C 21.1 16.02, 20.25 14.12, 17.93 12.85"
        stroke={bottomColor}
        strokeWidth={bottomStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transformOrigin: '12px 17px' }}
        variants={animated ? bottomCushionVariants : undefined}
      />

      {/* ======================================================== */}
      {/* 4. EYES (Vertical pill capsules with playful blink)      */}
      {/* ======================================================== */}
      <motion.g
        style={{ transformOrigin: '12px 16.35px' }}
        variants={animated ? eyesVariants : undefined}
      >
        <line
          x1="10.5"
          y1="15.8"
          x2="10.5"
          y2="16.9"
          stroke={eyeColor}
          strokeWidth={eyeStrokeWidth}
          strokeLinecap="round"
        />
        <line
          x1="13.5"
          y1="15.8"
          x2="13.5"
          y2="16.9"
          stroke={eyeColor}
          strokeWidth={eyeStrokeWidth}
          strokeLinecap="round"
        />
      </motion.g>
    </motion.svg>
  );
}

export default RareLogo;
