'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from 'next-themes';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark, vs } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { cn } from '@/lib/utils';
import { usePreviewStage, useInDocContent } from './preview-context';
import { PixelDither } from './PixelDither';
import { StageCliButton } from './StageCliButton';
import { FloatingPreviewPill } from './FloatingPreviewPill';

// Duo-stroke SVG icons requested by user
function CopyDefaultIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        opacity="0.28"
        d="M16.9018 16.9018C17.1375 16.8669 17.3474 16.8195 17.545 16.7553C19.0672 16.2607 20.2607 15.0673 20.7552 13.5451C21 12.7919 21 11.8613 21 10C21 8.13872 21 7.20808 20.7552 6.45492C20.2607 4.93273 19.0672 3.73931 17.545 3.24472C16.7919 3 15.8612 3 14 3C12.1387 3 11.208 3 10.4549 3.24472C8.93268 3.73931 7.73926 4.93273 7.24468 6.45492C7.18045 6.65258 7.13308 6.86246 7.09814 7.09819"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 14C3 12.1387 3 11.2081 3.24472 10.4549C3.73931 8.93273 4.93273 7.73931 6.45492 7.24472C7.20808 7 8.13872 7 10 7C11.8613 7 12.7919 7 13.5451 7.24472C15.0673 7.73931 16.2607 8.93273 16.7553 10.4549C17 11.2081 17 12.1387 17 14C17 15.8613 17 16.7919 16.7553 17.5451C16.2607 19.0673 15.0673 20.2607 13.5451 20.7553C12.7919 21 11.8613 21 10 21C8.13872 21 7.20808 21 6.45492 20.7553C4.93273 20.2607 3.73931 19.0673 3.24472 17.5451C3 16.7919 3 15.8613 3 14Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyCopiedIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        opacity="0.28"
        d="M16.9018 16.9018C17.1375 16.8669 17.3474 16.8195 17.545 16.7553C19.0672 16.2607 20.2607 15.0673 20.7552 13.5451C21 12.7919 21 11.8613 21 10C21 8.13872 21 7.20808 20.7552 6.45492C20.2607 4.93273 19.0672 3.73931 17.545 3.24472C16.7919 3 15.8612 3 14 3C12.1387 3 11.208 3 10.4549 3.24472C8.93268 3.73931 7.73926 4.93273 7.24468 6.45492C7.18045 6.65258 7.13308 6.86246 7.09814 7.09819"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 14.2587L9.0362 16.2927C10.0155 14.5802 11.3709 13.1125 13 12M10 21C8.13872 21 7.20808 21 6.45492 20.7553C4.93273 20.2607 3.73931 19.0673 3.24472 17.5451C3 16.7919 3 15.8613 3 14C3 12.1387 3 11.2081 3.24472 10.4549C3.73931 8.93273 4.93273 7.73931 6.45492 7.24472C7.20808 7 8.13872 7 10 7C11.8613 7 12.7919 7 13.5451 7.24472C15.0673 7.73931 16.2607 8.93273 16.7553 10.4549C17 11.2081 17 12.1387 17 14C17 15.8613 17 16.7919 16.7553 17.5451C16.2607 19.0673 15.0673 20.2607 13.5451 20.7553C12.7919 21 11.8613 21 10 21C8.13872 21 7.20808 21 6.45492 20.7553C4.93273 20.2607 3.73931 19.0673 3.24472 17.5451C3 16.7919 3 15.8613 3 14Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossCancelSquareIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        opacity="0.28"
        d="M6.70384 20.5432C7.80647 20.9999 9.20429 20.9999 11.9999 20.9999C14.7956 20.9999 16.1934 20.9999 17.296 20.5432C18.7662 19.9342 19.9343 18.7661 20.5432 17.296C20.9999 16.1934 20.9999 14.7955 20.9999 11.9999C20.9999 9.20423 20.9999 7.8064 20.5432 6.70378C19.9343 5.23361 18.7662 4.06556 17.296 3.4566C16.1934 2.99988 14.7956 2.99988 11.9999 2.99988C9.20429 2.99988 7.80647 2.99988 6.70384 3.4566C5.23367 4.06556 4.06563 5.23361 3.45666 6.70378C2.99994 7.8064 2.99994 9.20423 2.99994 11.9999C2.99994 14.7955 2.99994 16.1934 3.45666 17.296C4.06563 18.7661 5.23367 19.9342 6.70384 20.5432Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 15L12 12M12 12L15 9M12 12L9 9M12 12L15 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Expand icon requested by user
function ExpandPreviewIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path
        opacity="0.28"
        d="M13 22c4.055-.008 6.178-.107 7.535-1.465C22 19.072 22 16.714 22 12s0-7.071-1.465-8.536C19.071 2 16.714 2 12 2S4.929 2 3.464 3.464C2.107 4.822 2.008 6.944 2 11"
      />
      <path d="m12 12l5-5m0 0h-3.75M17 7v3.75" />
      <path d="M2 18c0-1.886 0-2.828.586-3.414S4.114 14 6 14s2.828 0 3.414.586S10 16.114 10 18s0 2.828-.586 3.414S7.886 22 6 22s-2.828 0-3.414-.586S2 19.886 2 18Z" />
    </svg>
  );
}

// Shrink icon requested by user
function ShrinkPreviewIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path
        opacity="0.28"
        d="M13 22c4.055-.008 6.178-.107 7.535-1.465C22 19.072 22 16.714 22 12s0-7.071-1.465-8.536C19.071 2 16.714 2 12 2S4.929 2 3.464 3.464C2.107 4.822 2.008 6.944 2 11"
      />
      <path d="m17 7l-5 5m0 0h3.75M12 12V8.25" />
      <path d="M2 18c0-1.886 0-2.828.586-3.414S4.114 14 6 14s2.828 0 3.414.586S10 16.114 10 18s0 2.828-.586 3.414S7.886 22 6 22s-2.828 0-3.414-.586S2 19.886 2 18Z" />
    </svg>
  );
}

// Rotate Right Circle icon for replaying animations matching duo-stroke styling
function RotateRightCircleIcon({ className = 'h-4.5 w-4.5' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      className={className}
    >
      <g id="rotate-right-circle">
        {/* Duo-stroke outer track with 0.28 opacity */}
        <path
          opacity="0.28"
          d="M7 13.25c4 0 6.25 -2.25 6.25 -6.25S11 0.75 7 0.75 0.75 3 0.75 7 3 13.25 7 13.25Z"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Main circular arrow arc */}
        <path
          d="M9.70668 6.48917C9.4642 5.07565 8.23271 4 6.75 4c-1.65685 0 -3 1.34315 -3 3s1.34315 3 3 3c0.8885 0 1.68679 -0.38625 2.23611 -1"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Arrowhead */}
        <path
          d="M10.4 4.47433c0.1051 0.78477 -0.1247 1.45463 -0.68942 2.0096 -0.78476 0.10513 -1.45463 -0.12468 -2.00959 -0.68941"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

// Clean background colors from syntax highlighter themes so it blends seamlessly
const cleanTheme = (theme: any) => {
  const newTheme = { ...theme };
  Object.keys(newTheme).forEach((key) => {
    if (newTheme[key]?.background) delete newTheme[key].background;
    if (newTheme[key]?.backgroundColor) delete newTheme[key].backgroundColor;
  });
  return newTheme;
};

const vsClean = cleanTheme(vs);
const materialDarkClean = cleanTheme(materialDark);

/**
 * Animated harmonic audio waveform visualizer
 * Pulses symmetrically from the midline like modern AI voice / generative frequency equalizers
 */
function WaveformVisualizer({
  active = true,
  barsCount = 24,
  compact = false,
}: {
  active?: boolean;
  barsCount?: number;
  compact?: boolean;
}) {
  const baseHeights = [
    0.28, 0.55, 0.85, 0.42, 0.95, 0.65, 0.38, 0.82,
    1.0, 0.72, 0.48, 0.9, 0.62, 0.35, 0.78, 1.0,
    0.52, 0.88, 0.44, 0.68, 0.32, 0.58, 0.82, 0.38,
  ];

  const heights = Array.from({ length: barsCount }, (_, i) => baseHeights[i % baseHeights.length]);

  return (
    <div
      className={cn(
        'flex items-center justify-center origin-center',
        compact ? 'gap-[2px] h-3.5 px-0.5' : 'gap-[3px] h-10 px-3'
      )}
      aria-hidden="true"
    >
      {heights.map((targetScale, i) => {
        const delay = (i % 8) * 0.07;
        const duration = 1.15 + (i % 5) * 0.12;

        return (
          <motion.span
            key={i}
            className={cn(
              'rounded-full origin-center transform-gpu',
              compact
                ? 'w-[2px] bg-linear-to-t from-primary/70 to-primary'
                : 'w-[3px] bg-linear-to-t from-violet-500 via-primary to-cyan-400 shadow-[0_0_8px_rgba(var(--primary),0.35)]'
            )}
            initial={{ scaleY: 0.2 }}
            animate={
              active
                ? {
                    scaleY: [
                      0.2,
                      targetScale,
                      0.28,
                      targetScale * 0.88,
                      0.2,
                    ],
                    opacity: [0.45, 1, 0.55, 0.95, 0.45],
                  }
                : { scaleY: 0.2, opacity: 0.25 }
            }
            transition={{
              duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay,
            }}
            style={{
              height: compact ? '14px' : '36px',
            }}
          />
        );
      })}
    </div>
  );
}

export interface NewComponentPreviewProps {
  children?: React.ReactNode;
  component?: string;
  code?: string;
  cliCommand?: string;
  className?: string;
  expand?: boolean;
  expandable?: boolean;
  minimize?: boolean;
  canExpand?: boolean;
  allowExpand?: boolean;
  rotate?: boolean;
  replay?: boolean;
  reanimate?: boolean;
  [key: string]: any;
}

/**
 * Clean component preview stage with:
 * - Fluid waveform animation while active component slides softly away into blur.
 * - Structured response expansion into viewport with slightly slow, soft, snappy blur-fade.
 * - Hardware-accelerated transitions with zero jumping.
 * - Opt-in fullscreen expansion with snappy macOS-like spring physics and duo-stroke icons.
 */
export function NewComponentPreview({
  children,
  component,
  code = '',
  cliCommand,
  className,
  expand,
  expandable,
  minimize,
  canExpand: canExpandProp,
  allowExpand,
  rotate,
  replay,
  reanimate,
  ...props
}: NewComponentPreviewProps) {
  // Only expand when explicitly requested (e.g. liquid-wave)
  const canExpand = Boolean(
    expandable ||
    expand ||
    minimize ||
    canExpandProp ||
    allowExpand ||
    component === 'liquid-wave'
  );

  // Only rotate for VaporSmokeText, text animations, or when explicitly requested
  const canRotate = Boolean(
    rotate ||
    replay ||
    reanimate ||
    component === 'vapor-smokeText' ||
    component === 'vapor-smoke-text' ||
    component?.toLowerCase().includes('smoke') ||
    component?.toLowerCase().includes('vapor')
  );

  const [remountKey, setRemountKey] = useState(0);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [isReloading, setIsReloading] = useState(false);

  const handleRotate = () => {
    setRotationDegree((prev) => prev + 360);
    setIsReloading(true);
    setRemountKey((prev) => prev + 1);
    // Micro-delay completely unmounts children so entrance animations (like VaporSmokeText) replay cleanly from scratch
    setTimeout(() => {
      setIsReloading(false);
    }, 40);
  };

  const [isExpanded, setIsExpanded] = useState(false);

  const previewContext = usePreviewStage();
  const inDocContent = useInDocContent();
  const isCodeOpen = previewContext.isCodeOpen;
  const setIsCodeOpen = previewContext.setIsCodeOpen;

  // Staged transition: 'idle' -> 'waveform' (synthesizing) -> 'expanded' (structured response)
  const [phase, setPhase] = useState<'idle' | 'waveform' | 'expanded'>('idle');

  useEffect(() => {
    if (isCodeOpen) {
      setPhase('waveform');
      const timer = setTimeout(() => {
        setPhase('expanded');
      }, 420);
      return () => clearTimeout(timer);
    } else {
      setPhase('idle');
    }
  }, [isCodeOpen]);

  React.useEffect(() => {
    if (code) {
      previewContext.setCode(code);
    }
    if (cliCommand) {
      previewContext.setCliCommand(cliCommand);
    }
    if (component) {
      previewContext.setComponentName(component);
    }
  }, [code, cliCommand, component, previewContext]);

  const [copied, setCopied] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  const handleCopyCode = async () => {
    if (!code) return;
    try {
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Keyboard Escape listener and background scroll lock when full screen is active
  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  // Exit full screen when switching to code view
  useEffect(() => {
    if (isCodeOpen && isExpanded) {
      setIsExpanded(false);
    }
  }, [isCodeOpen, isExpanded]);

  // Suppress rendering inside Component Info documentation view
  if (inDocContent || previewContext.isInfoOpen) {
    return null;
  }

  return (
    <div
      data-slot="new-component-stage-wrapper"
      className="relative flex h-full w-full flex-col px-1 md:px-3 lg:px-4 pt-4 pb-16 md:pb-16 select-none"
    >
      {/* 1. Top Folder Tab Row: Preview, Code, CLI, Prompt in Folder Tab Geometry */}
      <div className="relative z-40 w-full shrink-0">
        <FloatingPreviewPill
          code={code}
          componentName={component}
          cliCommand={cliCommand}
          canRotate={canRotate}
          onRotate={handleRotate}
          rotationDegree={rotationDegree}
          canExpand={canExpand}
          onExpand={() => setIsExpanded(true)}
          className="relative top-0 left-0 w-full"
        />
      </div>

      {/* 2. MAIN OUTER BODY (fused seamlessly under the folder tab row) */}
      <div
        data-slot="new-component-preview"
        className={cn(
          'relative -mt-[1px] flex flex-1 min-h-0 w-full flex-col bg-neutral-200 dark:bg-neutral-800 rounded-tr-[24px] rounded-br-[24px] rounded-bl-[24px] rounded-tl-none md:p-3 p-1 z-10',
          className
        )}
      >
      
        {/* Inner Stage: framed preview card with light/dark background, rounded-2xl corners, and subtle border */}
        <div className="@container relative z-10 flex h-full w-full items-center justify-center overflow-hidden bg-neutral-100 dark:bg-neutral-900 shadow-xs shadow-black/10 dark:shadow-xs dark:shadow-white/5 ring-1 ring-black/5 dark:ring-1 dark:ring-white/5 rounded-2xl transition-colors">
        {/* Top Right Action Toolbar: Rotate / Replay only in preview stage if canRotate */}
        {!isCodeOpen && canRotate && (
          <div
            className={cn(
              'absolute z-30 flex items-center gap-1 transition-all duration-300',
              'bg-white/80 dark:bg-neutral-800/80 rounded-md backdrop-blur-md shadow-xs border border-neutral-200/80 dark:border-neutral-700/80 p-0.5',
              'top-2 right-2'
            )}
          >
            <button
              type="button"
              onClick={handleRotate}
              title="Replay animation"
              aria-label="Replay animation"
              className="flex h-6 w-6 cursor-pointer items-center justify-center p-0 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors active:scale-90"
            >
              <motion.div
                animate={{ rotate: rotationDegree }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center"
              >
                <RotateRightCircleIcon className="h-3.5 w-3.5" />
              </motion.div>
            </button>
          </div>
        )}

        {/* True Full Screen Modal Portal: Covers the entire window only when expanded */}
        {isExpanded && mounted && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[999999] h-screen w-screen bg-background dark:bg-neutral-950 flex flex-col overflow-hidden">
            {/* Top Right Floating Toolbar: Esc badge + Shrink button */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 flex items-center gap-1.5 bg-background/85 dark:bg-neutral-900/85 rounded-md backdrop-blur-md shadow-md border border-border/60 p-0.5">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 select-none px-2 py-0.5">
                esc
              </span>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                title="Exit full screen (Esc)"
                aria-label="Exit full screen"
                className="relative flex h-7 w-7 cursor-pointer items-center justify-center p-0 text-muted-foreground/80 transition-colors hover:text-foreground active:scale-90"
              >
                <ShrinkPreviewIcon className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* The component rendered in true full screen */}
            <div className="relative h-full w-full flex-1 overflow-hidden flex flex-col">
              {!isReloading && (
                <div key={remountKey} className="relative h-full w-full flex-1 overflow-hidden flex flex-col">
                  {React.isValidElement(children)
                    ? React.cloneElement(children as React.ReactElement<any>, {
                        key: `fullscreen-replay-${remountKey}`,
                      })
                    : children}
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
        {/* 1. Underlying Component View: soft blurry fade-in so it never flashes or jumps on page switch */}
        <motion.div
          key={`component-view-${remountKey}`}
          className="relative flex h-full w-full overflow-auto scrollbar-thin transform-gpu will-change-transform"
          style={{ justifyContent: 'safe center', alignItems: 'safe center' }}
          initial={{
            opacity: 0,
            filter: 'blur(16px)',
            scale: 0.985,
          }}
          animate={{
            opacity: isCodeOpen ? 0 : 1,
            y: isCodeOpen ? 36 : 0,
            scale: isCodeOpen ? 0.95 : 1,
            filter: isCodeOpen ? 'blur(22px)' : 'blur(0px)',
          }}
          transition={{
            duration: 0.52,
            ease: [0.16, 1, 0.3, 1], // snappy start, velvety deceleration
          }}
        >
          {!isReloading && !isExpanded && (
            <div key={remountKey} className="contents">
              {React.isValidElement(children)
                ? React.cloneElement(children as React.ReactElement<any>, {
                    key: `replay-${remountKey}`,
                  })
                : children}
            </div>
          )}
        </motion.div>

        {/* 2. Structured Code Response & Waveform Animation Expansion into the Viewport */}
        <AnimatePresence>
          {isCodeOpen && (
            <motion.div
              key="preview-code-overlay"
              initial={{ opacity: 0, filter: 'blur(22px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{
                opacity: 0,
                y: -24,
                scale: 0.98,
                filter: 'blur(20px)',
                transition: { duration: 0.52, ease: [0.16, 1, 0.3, 1] },
              }}
              transition={{
                duration: 0.62,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute inset-0 z-30 flex items-center justify-center overflow-hidden backdrop-blur-2xl bg-neutral-100/98 dark:bg-neutral-900/98 transform-gpu"
            >
              <AnimatePresence mode="wait">
                {phase === 'waveform' ? (
                  <motion.div
                    key="waveform-phase"
                    initial={{ opacity: 0, scale: 0.88, filter: 'blur(16px)', y: 15 }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
                    exit={{
                      opacity: 0,
                      scale: 1.05,
                      filter: 'blur(16px)',
                      transition: { duration: 0.36, ease: [0.16, 1, 0.3, 1] },
                    }}
                    transition={{ duration: 0.44, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => setPhase('expanded')}
                    className="relative flex flex-col items-center justify-center px-8 py-7 rounded-2xl border border-primary/25 bg-card/85 dark:bg-neutral-900/90 shadow-2xl backdrop-blur-xl max-w-sm sm:max-w-md mx-4 cursor-pointer select-none"
                  >
                    {/* Glowing ambient radial aura */}
                    <div className="absolute -inset-4 rounded-3xl bg-linear-to-r from-primary/20 via-violet-500/20 to-cyan-400/20 blur-2xl opacity-75 pointer-events-none" />

                    {/* Prominent Harmonic Waveform */}
                    <WaveformVisualizer active barsCount={24} />

                    {/* Harmonic Sine Wave Line */}
                    <svg className="w-48 h-6 overflow-visible opacity-35 mt-1" viewBox="0 0 200 40">
                      <motion.path
                        d="M0 20 Q 25 5, 50 20 T 100 20 T 150 20 T 200 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="text-primary"
                        animate={{
                          d: [
                            "M0 20 Q 25 5, 50 20 T 100 20 T 150 20 T 200 20",
                            "M0 20 Q 25 35, 50 20 T 100 20 T 150 20 T 200 20",
                            "M0 20 Q 25 5, 50 20 T 100 20 T 150 20 T 200 20",
                          ],
                        }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </svg>

                    {/* Status badge */}
                    <div className="mt-4 flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                      </span>
                      <span className="text-xs font-medium text-muted-foreground tracking-wide">
                        Structuring code response...
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="structured-response-phase"
                    initial={{ opacity: 0, y: 22, filter: 'blur(18px)', scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                    exit={{ opacity: 0, y: -16, filter: 'blur(16px)' }}
                    transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex h-full w-full flex-col overflow-hidden"
                  >
                    {/* Floating Action Buttons: purely copy icon & cross icon, zero background, zero shadow, zero border */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex items-center gap-1">
                      {/* Copy icon button with seamless animation */}
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        aria-label={copied ? 'Copied code' : 'Copy code'}
                        title={copied ? 'Copied!' : 'Copy Code'}
                        className="relative flex h-7 w-7 cursor-pointer items-center justify-center p-0 text-muted-foreground/80 transition-colors hover:text-foreground active:scale-90"
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {copied ? (
                            <motion.div
                              key="copied-icon"
                              initial={{ scale: 0.75, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.75, opacity: 0 }}
                              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                              className="flex items-center justify-center text-foreground"
                            >
                              <CopyCopiedIcon className="h-4.5 w-4.5" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="default-icon"
                              initial={{ scale: 0.75, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.75, opacity: 0 }}
                              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                              className="flex items-center justify-center"
                            >
                              <CopyDefaultIcon className="h-4.5 w-4.5" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>

                      {/* Cross cancel icon button */}
                      <button
                        type="button"
                        onClick={() => setIsCodeOpen(false)}
                        title="Close code view"
                        aria-label="Close code view"
                        className="flex h-7 w-7 cursor-pointer items-center justify-center p-0 text-muted-foreground/80 transition-colors hover:text-foreground active:scale-90"
                      >
                        <CrossCancelSquareIcon className="h-4.5 w-4.5" />
                      </button>
                    </div>

                    {/* Code Container with Bottom Fade Mask as User Scrolls */}
                    <div className="relative flex-1 overflow-hidden">
                      <div className="mask-fade-bottom h-full w-full overflow-auto p-4 sm:p-6 pr-16 sm:pr-20 pb-24 scrollbar-thin font-mono text-xs">
                        {code ? (
                          <SyntaxHighlighter
                            language="tsx"
                            style={isDark ? materialDarkClean : vsClean}
                            showLineNumbers
                            showInlineLineNumbers
                            wrapLines
                            lineProps={(lineNumber: number) => {
                              const i = lineNumber - 1;
                              const delay = Math.min(i * 0.012, 0.45) + Math.sin(i * 0.28) * 0.012;
                              return {
                                style: {
                                  display: 'flex',
                                  alignItems: 'baseline',
                                  minHeight: '1.68em',
                                  animation: 'codeWaveformLine 0.48s cubic-bezier(0.16, 1, 0.3, 1) both',
                                  animationDelay: `${Math.max(0, delay)}s`,
                                },
                                className: 'code-line-item',
                              };
                            }}
                            lineNumberStyle={{
                              minWidth: '2.5rem',
                              paddingRight: '1.25rem',
                              color: isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.25)',
                              fontSize: '0.75rem',
                              userSelect: 'none',
                              flexShrink: 0,
                              textAlign: 'right',
                            }}
                            customStyle={{
                              margin: 0,
                              padding: 0,
                              background: 'transparent',
                              fontSize: '0.8125rem',
                              lineHeight: '1.68',
                              fontFamily: 'var(--font-mono, monospace)',
                            }}
                          >
                            {code}
                          </SyntaxHighlighter>
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-muted-foreground/60">
                            No source code provided for this component preview.
                          </div>
                        )}
                      </div>

                      {/* Clean soft fade on bottom of the code area as they scroll code */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 sm:h-20 bg-linear-to-t from-neutral-100 dark:from-neutral-900 via-neutral-100/80 dark:via-neutral-900/80 to-transparent z-20 backdrop-blur-[1px]"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </div>
);
}

export default NewComponentPreview;
