'use client';

import React from 'react';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'motion/react';
import { usePreviewStage, InDocContentContext } from './preview-context';
import { FloatingDocIndex } from './FloatingDocIndex';
import { DocContact } from './DocContact';
import { DocInstallation } from './DocInstallation';

interface ComponentPageStageProps {
  title: string;
  description?: string;
  previewContent: React.ReactNode;
  docContent: React.ReactNode;
}

/**
 * Mathematically generates harmonic waveform spline paths modulated by a Hann window
 * so the wave tapers smoothly to 0 at the left and right edges with no harsh cutoffs.
 */
function generateWavePath(
  width = 1200,
  height = 140,
  amplitude = 32,
  frequency = 4,
  phase = 0,
  harmonics = 2
) {
  const midY = height / 2;
  const steps = 100;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    const x = progress * width;
    const window = Math.sin(Math.PI * progress) ** 1.8;
    const wave =
      Math.sin(progress * Math.PI * 2 * frequency + phase) +
      0.4 * Math.sin(progress * Math.PI * 2 * frequency * harmonics + phase * 1.5);
    const y = midY + amplitude * window * wave;
    if (i === 0) {
      d += `M ${x.toFixed(1)} ${y.toFixed(1)}`;
    } else {
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
  }
  return d;
}

const WAVE_1 = generateWavePath(1200, 140, 26, 3.2, 0, 2);
const WAVE_2 = generateWavePath(1200, 140, 17, 4.8, Math.PI / 2.5, 1.8);
const WAVE_3 = generateWavePath(1200, 140, 11, 2.4, Math.PI / 4, 2.2);

export function ComponentPageStage({
  title,
  description,
  previewContent,
  docContent,
}: ComponentPageStageProps) {
  const { isInfoOpen, cliCommand } = usePreviewStage();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [stageHeight, setStageHeight] = React.useState(800);
  const reduceMotion = useReducedMotion();

  // Track transition direction: 'up' (preview -> info) or 'down' (info -> preview)
  const [direction, setDirection] = React.useState<'up' | 'down'>('up');
  const [isWaveActive, setIsWaveActive] = React.useState(false);
  const [waveKey, setWaveKey] = React.useState(0);
  const isMountedRef = React.useRef(false);
  const prevInfoOpenRef = React.useRef(isInfoOpen);

  // Measure stage height for precision travel
  React.useEffect(() => {
    if (!containerRef.current) return;
    const updateHeight = () => {
      if (containerRef.current) {
        setStageHeight(containerRef.current.offsetHeight);
      }
    };
    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Trigger wave animation on switch
  React.useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      prevInfoOpenRef.current = isInfoOpen;
      return;
    }

    if (prevInfoOpenRef.current !== isInfoOpen) {
      const dir = isInfoOpen ? 'up' : 'down';
      setDirection(dir);
      setIsWaveActive(true);
      setWaveKey((k) => k + 1);
      prevInfoOpenRef.current = isInfoOpen;

      const timer = setTimeout(() => {
        setIsWaveActive(false);
      }, 1250);
      return () => clearTimeout(timer);
    }
  }, [isInfoOpen]);

  const stageVariants: Variants = {
    enter: (dir: 'up' | 'down') => ({
      clipPath: reduceMotion
        ? 'inset(0% 0% 0% 0%)'
        : dir === 'up'
        ? 'inset(100% 0% 0% 0%)'
        : 'inset(0% 0% 100% 0%)',
      opacity: 1,
      zIndex: 10,
    }),
    center: {
      clipPath: 'inset(0% 0% 0% 0%)',
      opacity: 1,
      zIndex: 10,
      transition: {
        duration: 1.15,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      opacity: 0,
      zIndex: 0,
      transition: {
        duration: 0.1,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      {/* Traveling Subtle Waveform Animation Overlay */}
      {isWaveActive && !reduceMotion && (
        <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
          <motion.div
            key={`waveform-${direction}-${waveKey}`}
            initial={{
              y: direction === 'up' ? stageHeight + 40 : -180,
              opacity: 0,
              filter: 'blur(6px)',
            }}
            animate={{
              y: direction === 'up' ? -180 : stageHeight + 40,
              opacity: [0, 0.9, 0.9, 0],
              filter: ['blur(4px)', 'blur(0px)', 'blur(0px)', 'blur(5px)'],
            }}
            transition={{
              duration: 1.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="pointer-events-none absolute inset-x-0 top-0 h-[150px] flex items-center justify-center will-change-transform"
          >
            {/* 1. Luminous ambient glow beam - soft & subtle */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-28 w-full bg-linear-to-r from-transparent via-[#3074fe]/18 via-cyan-400/14 to-transparent blur-3xl pointer-events-none" />

            {/* 2. Soft core beam flare */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-5 w-full bg-linear-to-r from-transparent via-cyan-400/22 via-blue-500/22 to-transparent blur-md pointer-events-none" />

            {/* 3. Luminous wave centerline filament */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] w-full bg-linear-to-r from-transparent via-cyan-400/60 via-blue-400/65 to-transparent blur-[0.5px] shadow-[0_0_10px_rgba(56,189,248,0.5)] pointer-events-none" />

            {/* 4. Directional luminous motion tail behind the wave for soft, smooth fade */}
            {direction === 'up' ? (
              <div className="absolute inset-x-0 top-1/2 h-32 w-full bg-linear-to-b from-[#3074fe]/16 via-[#3074fe]/4 to-transparent blur-2xl pointer-events-none" />
            ) : (
              <div className="absolute inset-x-0 bottom-1/2 h-32 w-full bg-linear-to-t from-[#3074fe]/16 via-[#3074fe]/4 to-transparent blur-2xl pointer-events-none" />
            )}

            {/* 5. Fluid Harmonic Waveform SVG */}
            <svg
              viewBox="0 0 1200 140"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full overflow-visible pointer-events-none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="wave-sweep-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3074fe" stopOpacity="0" />
                  <stop offset="12%" stopColor="#3074fe" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
                  <stop offset="88%" stopColor="#3074fe" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3074fe" stopOpacity="0" />
                </linearGradient>

                <linearGradient id="wave-sweep-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0" />
                  <stop offset="20%" stopColor="#818cf8" stopOpacity="0.45" />
                  <stop offset="50%" stopColor="#c084fc" stopOpacity="0.8" />
                  <stop offset="80%" stopColor="#818cf8" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                </linearGradient>

                <linearGradient id="wave-sweep-grad-3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
                  <stop offset="30%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="#a5f3fc" stopOpacity="0.65" />
                  <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                </linearGradient>

                <filter id="wave-soft-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Primary Harmonic Curve */}
              <path
                d={WAVE_1}
                fill="none"
                stroke="url(#wave-sweep-grad-1)"
                strokeWidth="2.0"
                strokeLinecap="round"
                filter="url(#wave-soft-glow)"
              />

              {/* Secondary Counter-Frequency Curve */}
              <path
                d={WAVE_2}
                fill="none"
                stroke="url(#wave-sweep-grad-2)"
                strokeWidth="1.4"
                strokeLinecap="round"
                opacity="0.8"
              />

              {/* High Harmonic Detail Curve */}
              <path
                d={WAVE_3}
                fill="none"
                stroke="url(#wave-sweep-grad-3)"
                strokeWidth="1.0"
                strokeLinecap="round"
                opacity="0.5"
              />
            </svg>
          </motion.div>
        </div>
      )}

      {/* Animated Transition between Preview and Full Documentation Text */}
      <AnimatePresence mode="popLayout" custom={direction}>
        {!isInfoOpen ? (
          /* State 1: Live Interactive Component Preview Stage */
          <motion.div
            key="preview-stage"
            custom={direction}
            variants={stageVariants}
            initial={isMountedRef.current ? 'enter' : false}
            animate="center"
            exit="exit"
            className="h-full w-full bg-background"
          >
            {previewContent}
          </motion.div>
        ) : (
          /* State 2: Full Component Documentation */
          <motion.div
            key="docs-stage"
            id="docs-scroll-container"
            custom={direction}
            variants={stageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="relative h-full w-full bg-background overflow-y-auto overflow-x-hidden flex justify-center py-6 px-4 sm:px-6 scrollbar-thin"
          >
            {/* Centered container with fixed max-width matching NewComponentPreview's normal bounds */}
            <div className="w-full max-w-[880px] xl:max-w-[940px] flex flex-col gap-9 pb-56">
              <article id="main-blog-content" className="flex flex-col gap-9 w-full">
                {/* 1. Component Name (Title) and Description */}
                <header className="border-b border-border/40 pb-5 flex flex-col gap-2">
                  <h1 className="font-medium text-2xl sm:text-3xl tracking-tight text-foreground">
                    {title}
                  </h1>
                  {description && (
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  )}
                </header>

                {/* 2. Installation */}
                <DocInstallation cliCommand={cliCommand} name={title} />

                {/* 3. How to Use & Props (rendered from DocUsageGuide & DocPropsTable) */}
                <InDocContentContext.Provider value={true}>
                  <div className="flex flex-col gap-9">
                    {docContent}
                  </div>
                </InDocContentContext.Provider>

                {/* 4. Contact & Community (at the very end) */}
                <DocContact />

                {/* Generous bottom clearance spacer so floating pill never covers Contact */}
                <div className="h-14 w-full shrink-0 pointer-events-none" aria-hidden="true" />
              </article>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Pill (Switches between Component Info button and Index Scroll TOC) */}
      <FloatingDocIndex />
    </div>
  );
}

export default ComponentPageStage;
