'use client';

import React, { useState, useEffect } from 'react';
import { Link } from 'next-view-transitions';
import { X, ArrowRight } from 'lucide-react';

export function RebrandBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if user hasn't explicitly dismissed it
    const dismissed = localStorage.getItem('shitui_rebrand_banner_dismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem('shitui_rebrand_banner_dismissed', 'true');
    } catch {
      // Ignore quota errors
    }
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Rebranding Announcement"
      className="relative z-[60] w-full border-b border-border/50 bg-neutral-100/90 py-1.5 sm:py-2 px-2.5 sm:px-6 text-xs text-foreground backdrop-blur-md transition-colors dark:bg-neutral-900/90 select-none"
    >
      <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-2 sm:gap-3">
        <div className="flex flex-1 items-center justify-center gap-1.5 sm:gap-2.5 text-center min-w-0">
          {/* Clean rebrand badge with inside glow matching categories pill */}
          <span className="inline-flex shrink-0 items-center rounded-sm bg-[#3f80ff] px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold tracking-wider text-white uppercase shadow-pill-glow">
            Rebrand
          </span>
          <span className="text-[11px] sm:text-xs font-medium text-muted-foreground leading-snug sm:leading-normal">
            <strong className="font-semibold text-foreground">RareUI</strong> has evolved into{' '}
            <strong className="font-semibold text-foreground">ShitUI</strong>
            <span className="hidden md:inline"> with official Shadcn CLI registry support</span>.
          </span>
          <Link
            href="/docs/rareui-is-now-shitui"
            className="inline-flex shrink-0 items-center gap-0.5 sm:gap-1 text-[11px] sm:text-xs font-semibold text-[#3f80ff] underline-offset-4 hover:underline whitespace-nowrap"
          >
            <span>Learn more</span>
            <ArrowRight className="h-3 w-3 transition-transform hover:translate-x-0.5" />
          </Link>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss banner"
          className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-neutral-200 hover:text-foreground dark:hover:bg-neutral-800"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </aside>
  );
}
