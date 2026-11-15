'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  ComponentCredit,
  getComponentDetails,
} from './component-credits-data';
import { DuoXCom } from './DuoIcons';
import { cn } from '@/lib/utils';

// Bookmark SVG icon
function BookmarkIcon({
  className = 'h-3.5 w-3.5',
  isFilled = false,
}: {
  className?: string;
  isFilled?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={isFilled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={isFilled ? '1' : '1.8'}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function DocRightPanel({ credit }: { credit?: ComponentCredit }) {
  const pathname = usePathname();
  const details = getComponentDetails(pathname);
  const currentCredit = credit || details.credit;
  const [imgError, setImgError] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const cleanHandle = currentCredit.xHandle.replace('@', '');
  const twitterUrl = currentCredit.xUrl || `https://x.com/${cleanHandle}`;
  const avatarUrl =
    currentCredit.avatarUrl || `https://unavatar.io/twitter/${cleanHandle}`;

  // Reset image error on route change
  useEffect(() => {
    setImgError(false);
  }, [pathname, cleanHandle]);

  // Sync bookmark state with localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`rareui_bookmark_${details.title}`);
      setIsBookmarked(saved === 'true');
    } catch {
      // ignore
    }
  }, [details.title]);

  const toggleBookmark = () => {
    setIsBookmarked((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(`rareui_bookmark_${details.title}`, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Prefilled tweet sharing URL
  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `https://shitui.in${pathname}`;
  const tweetText = `Check out ${details.title} on ShitUI — ${details.description}`;
  const shareOnXUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetText
  )}&url=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="relative flex flex-col gap-3.5 w-full h-full min-h-0 overflow-y-auto scrollbar-none select-none pl-1 pr-1.5 py-0.5">
      {/* 1. Header: Component Title + Bookmark and Share on X Actions */}
      <div className="flex flex-col gap-1.5 shrink-0 pt-0.5">
        <div className="flex items-center justify-between gap-2 shrink-0">
          <h2 className="text-sm sm:text-base font-semibold tracking-tight text-foreground truncate">
            {details.title}
          </h2>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Bookmark Button */}
            <button
              type="button"
              onClick={toggleBookmark}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark this component'}
              aria-label="Bookmark"
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-lg border transition-all duration-200 cursor-pointer active:scale-90',
                isBookmarked
                  ? 'border-primary/50 bg-primary/15 text-primary'
                  : 'border-border/60 bg-neutral-100/60 dark:bg-neutral-900/40 text-muted-foreground hover:text-foreground hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 hover:border-border'
              )}
            >
              <BookmarkIcon isFilled={isBookmarked} className="h-3.5 w-3.5" />
            </button>

            {/* Share on X Button with Icon and Text */}
            <a
              href={shareOnXUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on X"
              aria-label="Share on X"
              className="flex h-7 items-center gap-1.5 px-2.5 rounded-lg border border-border/60 bg-neutral-100/60 dark:bg-neutral-900/40 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 hover:border-border transition-all duration-200 active:scale-90 shadow-xs"
            >
              <DuoXCom className="h-2.5 w-2.5" />
              <span>Share on X</span>
            </a>
          </div>
        </div>

        {/* 2. One-line description */}
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {details.description}
        </p>
      </div>

      {/* 2. Tags */}
      {details.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          {details.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-neutral-200/60 dark:bg-neutral-800/60 text-muted-foreground border border-border/40 hover:text-foreground hover:border-border transition-colors select-none"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 3. Credits (Avatar with safe padding to prevent clipping) */}
      <div className="flex flex-col gap-1.5 shrink-0">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
          Credits
        </span>
        <div className="flex items-center gap-2 pl-0.5">
          <div className="p-0.5 shrink-0">
            {!imgError ? (
              <img
                src={avatarUrl}
                alt={currentCredit.name}
                onError={() => setImgError(true)}
                className="h-7 w-7 rounded-md object-cover ring-1 ring-border/60 dark:ring-white/20 shadow-xs"
                loading="lazy"
              />
            ) : (
              <div className="h-7 w-7 rounded-md border border-border/70 bg-primary/10 text-primary font-semibold text-[10px] flex items-center justify-center uppercase shadow-xs">
                {currentCredit.name.slice(0, 2)}
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-foreground font-medium text-[11px] truncate leading-tight">
              {currentCredit.name}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground truncate leading-normal pt-0.5">
              <span className="truncate">{currentCredit.profession}</span>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white dark:text-black flex items-center justify-center gap-1 bg-primary dark:bg-white shadow-pill-glow dark:shadow-pill-white px-1.5 py-0.5 rounded-sm shrink-0 hover:opacity-90 transition-opacity text-[9.5px]"
              >
                <DuoXCom className="h-2 w-2" />
                {currentCredit.xHandle}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Being Mindful Of (Paragraph only, no heading, no divider) */}
      <div className="flex flex-col shrink-0">
        <p className="text-[10.5px] text-muted-foreground leading-relaxed">
          Many of the components here are inspired by great work I’ve found across the web. I’m not the original creator — I’ve rebuilt these to learn, experiment, and sometimes add my own ideas. Credit goes to the original creators wherever possible. If I’ve missed you, please let me know.
        </p>
      </div>

      {/* 5. Contact (No divider) */}
      <div className="flex flex-col gap-1 shrink-0">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
          Contact
        </span>
        <p className="text-[10.5px] text-muted-foreground leading-snug">
          Questions, ideas, or feedback? Let’s talk.{' '}
          <a
            href="https://x.com/heyyswap"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline underline-offset-2 transition-colors font-medium inline-block"
          >
            @heyyswap
          </a>
        </p>
      </div>

      {/* 6. Updated Date (at bottom, no divider) */}
      <div className="flex items-center text-[10.5px] text-muted-foreground/60 shrink-0 pb-1">
        <span>Updated {details.lastUpdated}</span>
      </div>
    </div>
  );
}

export default DocRightPanel;
