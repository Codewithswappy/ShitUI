'use client';

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePreviewStage } from './preview-context';
import { usePathname } from 'next/navigation';

// Duo-stroke Programming Solar icon requested by user
function ProgrammingIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        opacity="0.32"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2 12c0-4.71405 0-7.07107 1.46447-8.53553C4.92893 2 7.28595 2 12 2c4.714 0 7.0711 0 8.5355 1.46447C22 4.92893 22 7.28595 22 12c0 4.714 0 7.0711-1.4645 8.5355C19.0711 22 16.714 22 12 22c-4.71405 0-7.07107 0-8.53553-1.4645C2 19.0711 2 16.714 2 12Z"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M17 15h-5"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m7 10 0.2344 0.1953c1.28168 1.0681 1.92253 1.6021 1.92253 2.3047 0 0.7026-0.64085 1.2366-1.92253 2.3047L7 15"
      />
    </svg>
  );
}

// Duo-stroke cross cancel square icon requested by user
function CrossCancelSquareIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
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
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 15L12 12M12 12L15 9M12 12L9 9M12 12L15 15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Duo-stroke copy default icon requested by user
function CopyDefaultIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
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
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 14C3 12.1387 3 11.2081 3.24472 10.4549C3.73931 8.93273 4.93273 7.73931 6.45492 7.24472C7.20808 7 8.13872 7 10 7C11.8613 7 12.7919 7 13.5451 7.24472C15.0673 7.73931 16.2607 8.93273 16.7553 10.4549C17 11.2081 17 12.1387 17 14C17 15.8613 17 16.7919 16.7553 17.5451C16.2607 19.0673 15.0673 20.2607 13.5451 20.7553C12.7919 21 11.8613 21 10 21C8.13872 21 7.20808 21 6.45492 20.7553C4.93273 20.2607 3.73931 19.0673 3.24472 17.5451C3 16.7919 3 15.8613 3 14Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Duo-stroke copy checkmark icon requested by user
function CopyCopiedIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
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
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 14.2587L9.0362 16.2927C10.0155 14.5802 11.3709 13.1125 13 12M10 21C8.13872 21 7.20808 21 6.45492 20.7553C4.93273 20.2607 3.73931 19.0673 3.24472 17.5451C3 16.7919 3 15.8613 3 14C3 12.1387 3 11.2081 3.24472 10.4549C3.73931 8.93273 4.93273 7.73931 6.45492 7.24472C7.20808 7 8.13872 7 10 7C11.8613 7 12.7919 7 13.5451 7.24472C15.0673 7.73931 16.2607 8.93273 16.7553 10.4549C17 11.2081 17 12.1387 17 14C17 15.8613 17 16.7919 16.7553 17.5451C16.2607 19.0673 15.0673 20.2607 13.5451 20.7553C12.7919 21 11.8613 21 10 21C8.13872 21 7.20808 21 6.45492 20.7553C4.93273 20.2607 3.73931 19.0673 3.24472 17.5451C3 16.7919 3 15.8613 3 14Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Character-level Vanishing Text Effect (ethereal blur-fade stagger on appear & vanish on exit)
function VanishText({
  text,
  className,
  delayChildren = 0.06,
  staggerChildren = 0.007,
}: {
  text: string;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
}) {
  return (
    <motion.span
      className={cn('inline-flex items-center font-mono', className)}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        visible: {
          transition: {
            staggerChildren,
            delayChildren,
          },
        },
        exit: {
          transition: {
            staggerChildren: 0.004,
            staggerDirection: -1,
          },
        },
      }}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={`${text}-${index}-${char}`}
          variants={{
            hidden: {
              opacity: 0,
              filter: 'blur(8px)',
              y: 5,
              scale: 0.88,
            },
            visible: {
              opacity: 1,
              filter: 'blur(0px)',
              y: 0,
              scale: 1,
              transition: {
                duration: 0.22,
                ease: [0.16, 1, 0.3, 1],
              },
            },
            exit: {
              opacity: 0,
              filter: 'blur(8px)',
              y: -5,
              scale: 0.88,
              transition: {
                duration: 0.16,
                ease: 'easeOut',
              },
            },
          }}
          className="inline-block whitespace-pre select-text"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

export interface StageCliButtonProps {
  componentName?: string;
  cliCommand?: string;
  className?: string;
  mode?: 'all' | 'desktop-only' | 'mobile-only';
}

type PackageManager = 'pnpm' | 'npm' | 'bun' | 'yarn';

export function StageCliButton({
  componentName: propComponentName,
  cliCommand: propCliCommand,
  className,
  mode = 'all',
}: StageCliButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePm, setActivePm] = useState<PackageManager>('pnpm');
  const [isPmDropdownOpen, setIsPmDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pmDropdownRef = useRef<HTMLDivElement>(null);

  const context = usePreviewStage();
  const pathname = usePathname();

  const resolveSlug = (): string => {
    if (propComponentName) return propComponentName;
    if (context.componentName) return context.componentName;
    const rawCmd = propCliCommand || context.cliCommand;
    if (rawCmd) {
      const parsed = rawCmd
        .replace(/^https:\/\/shitui\.in\/r\//, '')
        .replace(/\.json$/, '')
        .replace(
          /^(npx|pnpm dlx|yarn dlx|bunx|bunx --bun)\s+(shadcn@latest|shadcn|rareui|shitui)\s+add\s+(@shitui\/)?/,
          ''
        )
        .replace(/^https?:\/\/[^\/]+\/r\//, '')
        .replace(/\.json$/, '')
        .trim();
      if (parsed) return parsed;
    }
    if (typeof window !== 'undefined' || pathname) {
      const parts = (pathname || window.location.pathname).split('/').filter(Boolean);
      const last = parts[parts.length - 1];
      if (last && last !== 'docs') return last;
    }
    return 'component';
  };

  const slug = resolveSlug()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

  const commands: Record<PackageManager, string> = {
    pnpm: `pnpm dlx shadcn@latest add @shitui/${slug}`,
    npm: `npx shadcn@latest add @shitui/${slug}`,
    bun: `bunx --bun shadcn@latest add @shitui/${slug}`,
    yarn: `yarn dlx shadcn@latest add @shitui/${slug}`,
  };

  const currentCommand = commands[activePm];

  // Close on outside click (supports both mouse and touch for mobile)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
        setIsPmDropdownOpen(false);
      }
    };
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isExpanded]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
        setIsPmDropdownOpen(false);
      }
    };
    if (isExpanded) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(currentCommand);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy CLI command:', err);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative z-50 flex items-center select-none', className)}
    >
      {/* ─── MOBILE VIEW (< sm / < 640px): Opens CLI vertically downwards ─── */}
      {mode !== 'desktop-only' && (
        <div className={cn('items-center', mode === 'all' ? 'flex sm:hidden' : 'flex')}>
          {/* Mobile Trigger Button: stays in place beside Code and Prompt */}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            title="Install via CLI"
            aria-label="Install via CLI"
            aria-expanded={isExpanded}
            className={cn(
              'group inline-flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-all duration-200 cursor-pointer active:scale-95 border select-none shadow-pill-inset',
              isExpanded
                ? 'border-foreground/30 bg-neutral-200 dark:bg-neutral-800 text-foreground shadow-xs'
                : 'border-border/70 bg-neutral-100 dark:bg-neutral-900/70 text-muted-foreground hover:text-foreground hover:border-border hover:bg-neutral-200/80 dark:hover:bg-neutral-800 shadow-pill-inset'
            )}
          >
            <ProgrammingIcon className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:scale-105" />
            <span className="text-[11px] font-medium tracking-tight">CLI</span>
            <ChevronDown
              className={cn(
                'h-3 w-3 opacity-60 transition-transform duration-200 group-hover:opacity-100',
                isExpanded && 'rotate-180 opacity-100 text-foreground'
              )}
            />
          </button>

          {/* Mobile Vertical Dropdown Card */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                key="mobile-cli-vertical-card"
                initial={{
                  opacity: 0,
                  filter: 'blur(10px)',
                  y: -8,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  filter: 'blur(0px)',
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  filter: 'blur(8px)',
                  y: -8,
                  scale: 0.96,
                  transition: { duration: 0.16, ease: 'easeOut' },
                }}
                transition={{
                  duration: 0.22,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ transformOrigin: 'top right' }}
                className="absolute top-full right-0 mt-2 z-50 w-[calc(100vw-24px)] max-w-[340px] flex flex-col gap-2 rounded-lg border border-border/70 bg-background p-2.5 shadow-pill-inset"
              >
                {/* Top Row: Package Manager Tabs + Close Button */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 bg-muted p-0.5 rounded-md border border-border/60">
                    {(['pnpm', 'npm', 'bun', 'yarn'] as const).map((pm) => (
                      <button
                        key={pm}
                        type="button"
                        onClick={() => setActivePm(pm)}
                        className={cn(
                          'px-2 py-0.5 text-[11px] font-mono font-medium rounded-sm transition-all cursor-pointer',
                          activePm === pm
                            ? 'bg-background text-foreground shadow-pill-inset border border-border font-semibold'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <VanishText
                          text={pm}
                          delayChildren={0.03}
                          staggerChildren={0.01}
                          className={cn(
                            'text-[11px]',
                            activePm === pm ? 'text-foreground font-semibold' : 'text-muted-foreground'
                          )}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Close Button with duo-stroke cross cancel square icon */}
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    title="Close"
                    aria-label="Close"
                    className="p-1 rounded-md text-muted-foreground/70 hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                  >
                    <CrossCancelSquareIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Bottom Row: Terminal Code Block with VanishText & Copy Button */}
                <div
                  onClick={handleCopy}
                  title="Click to copy command"
                  className="group/code relative flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-muted/40 dark:bg-neutral-950/60 px-2.5 py-2 cursor-pointer transition-all hover:border-border hover:bg-muted/60 active:scale-[0.99]"
                >
                  <div className="flex items-center gap-1.5 overflow-hidden font-mono min-w-0 flex-1">
                    <span className="text-muted-foreground/60 font-bold select-none text-xs shrink-0">$</span>
                    <div className="overflow-x-auto scrollbar-none py-0.5 min-w-0">
                      <AnimatePresence mode="wait">
                        <VanishText
                          key={currentCommand}
                          text={currentCommand}
                          className="text-[11px] min-[360px]:text-xs font-medium text-foreground tracking-tight select-all whitespace-nowrap"
                        />
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Copy / Copied Action */}
                  <div className="shrink-0 flex items-center pl-1">
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.span
                          key="copied-label-mobile"
                          initial={{ opacity: 0, filter: 'blur(4px)', scale: 0.8 }}
                          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                          exit={{ opacity: 0, filter: 'blur(4px)', scale: 0.8 }}
                          className="flex items-center gap-1 text-[10px] min-[360px]:text-[11px] font-semibold text-emerald-500 font-mono"
                        >
                          <CopyCopiedIcon className="h-3.5 w-3.5" />
                          <span>Copied</span>
                        </motion.span>
                      ) : (
                        <div className="p-1 text-muted-foreground/70 group-hover/code:text-foreground transition-colors">
                          <CopyDefaultIcon className="h-3.5 w-3.5 transition-transform group-hover/code:scale-110" />
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ─── DESKTOP VIEW (sm: / >= 640px): Open CLI with no background, only text and copy ─── */}
      {mode !== 'mobile-only' && (
        <div className={cn('items-center', mode === 'all' ? 'hidden sm:flex' : 'flex')}>
          <div className="flex h-7 items-center gap-2 font-mono text-xs select-none bg-transparent border-0 shadow-none">
            {/* Package Manager Dropdown (pure text trigger with VanishText) */}
            <div
              ref={pmDropdownRef}
              className="relative flex h-full items-center"
            >
              <button
                type="button"
                onClick={() => setIsPmDropdownOpen((prev) => !prev)}
                className="flex h-full items-center gap-1 font-mono text-[11px] font-semibold text-foreground/90 hover:text-foreground transition-colors cursor-pointer bg-transparent border-0 p-0"
              >
                <AnimatePresence mode="wait">
                  <VanishText
                    key={activePm}
                    text={activePm}
                    delayChildren={0.01}
                    staggerChildren={0.01}
                    className="text-[11px] font-semibold"
                  />
                </AnimatePresence>
                <ChevronDown
                  className={cn(
                    'h-3 w-3 opacity-60 transition-transform duration-200',
                    isPmDropdownOpen && 'rotate-180 opacity-100 text-foreground'
                  )}
                />
              </button>

              <AnimatePresence>
                {isPmDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, filter: 'blur(12px)', scale: 0.92, y: -4 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', scale: 1, y: 0 }}
                    exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.92, y: -4 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: 'top left' }}
                    className="absolute top-full -left-2 mt-2 z-50 min-w-[88px] overflow-hidden rounded-lg border border-border/80 bg-background/95 dark:bg-neutral-950/95 p-1 shadow-pill-inset backdrop-blur-xl"
                  >
                    {(['pnpm', 'npm', 'bun', 'yarn'] as const).map((pm, index) => (
                      <motion.button
                        key={pm}
                        type="button"
                        initial={{ opacity: 0, filter: 'blur(8px)', y: -3 }}
                        animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                        exit={{ opacity: 0, filter: 'blur(6px)', y: -2 }}
                        transition={{
                          duration: 0.18,
                          delay: index * 0.035,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        onClick={() => {
                          setActivePm(pm);
                          setIsPmDropdownOpen(false);
                        }}
                        className={cn(
                          'group/item flex w-full items-center justify-between rounded-md px-2 py-1 text-left font-mono text-[11px] transition-colors cursor-pointer border',
                          activePm === pm
                            ? 'bg-primary/10 text-primary font-semibold shadow-pill-inset border-primary/20'
                            : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground border-transparent'
                        )}
                      >
                        <VanishText
                          text={pm}
                          delayChildren={index * 0.03 + 0.02}
                          staggerChildren={0.01}
                          className={cn(
                            'text-[11px] font-mono',
                            activePm === pm
                              ? 'text-primary font-semibold'
                              : 'text-muted-foreground group-hover/item:text-foreground'
                          )}
                        />
                        <AnimatePresence>
                          {activePm === pm && (
                            <motion.span
                              initial={{ opacity: 0, filter: 'blur(4px)', scale: 0.7 }}
                              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                              exit={{ opacity: 0, filter: 'blur(4px)', scale: 0.7 }}
                              transition={{ duration: 0.15 }}
                            >
                              <Check className="h-3 w-3 text-primary shrink-0" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Separator */}
            <span className="text-muted-foreground/30 select-none">|</span>

            {/* The Command Text with Vanishing Text Effect */}
            <div
              onClick={handleCopy}
              title="Click to copy command"
              className="group/text flex items-center gap-1.5 cursor-pointer transition-opacity hover:opacity-85 select-none"
            >
              <span className="text-muted-foreground/60 select-none font-bold">$</span>

              {/* Vanishing Command Text */}
              <div className="overflow-hidden flex items-center">
                <AnimatePresence mode="wait">
                  <VanishText
                    key={currentCommand}
                    text={currentCommand}
                    className="text-[11px] sm:text-xs font-medium text-foreground tracking-tight select-all"
                  />
                </AnimatePresence>
              </div>

              {/* Copy / Copied Action */}
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="copied-label"
                    initial={{ opacity: 0, filter: 'blur(4px)', scale: 0.8 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                    exit={{ opacity: 0, filter: 'blur(4px)', scale: 0.8 }}
                    transition={{ duration: 0.16 }}
                    className="flex items-center gap-1 text-[10px] font-semibold text-emerald-500 font-mono shrink-0 ml-1"
                  >
                    <CopyCopiedIcon className="h-3.5 w-3.5" />
                    <span>Copied</span>
                  </motion.span>
                ) : (
                  <button
                    key="copy-btn"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy();
                    }}
                    className="p-0.5 text-muted-foreground/70 hover:text-foreground transition-colors shrink-0 cursor-pointer ml-0.5"
                    title="Copy command"
                  >
                    <CopyDefaultIcon className="h-3.5 w-3.5 transition-transform duration-150 group-hover/text:scale-110" />
                  </button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StageCliButton;
