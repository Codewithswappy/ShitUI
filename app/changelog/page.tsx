'use client';

import React from 'react';
import { motion } from 'motion/react';
import { BayerDithering } from '@/components/new-design-components/BayerDithering';
import changelogData from '@/data/changelog.json';

// ─── Types ─────────────────────────────────────────────────────────
interface ChangelogGroup {
  title: string;
  entries: string[];
}

interface ChangelogVersion {
  version: string;
  date: string;
  latest: boolean;
  highlights: string[];
  groups: ChangelogGroup[];
}

export default function ChangelogPage() {
  const versions: ChangelogVersion[] = changelogData.versions;

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      data-slot="new-component-preview"
      className="relative mx-auto flex w-full max-w-3xl items-center justify-center overflow-hidden pt-3 px-3 sm:pt-4 sm:px-4 pb-0"
    >
      {/* ─── Dynamic Bayer Dithering Ambient Background (like docs introduction) ─── */}
      <div
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none"
        aria-hidden="true"
      >
        <BayerDithering className="w-full h-full" />
      </div>

      {/* ─── Inner Framed Content Card Stage ─── */}
      <div className="relative z-10 flex w-full flex-col overflow-hidden rounded-b-none border-t border-x border-border/60 bg-neutral-50 dark:bg-neutral-950 p-5 sm:p-8 transition-colors">
        {/* ─── Page Header (Compact & Clean) ────────────────────────────── */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 border-b border-border/40 pb-5 space-y-1.5"
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <h1 className="text-lg sm:text-xl font-medium tracking-tight text-foreground leading-snug">
              Changelog
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground tracking-normal leading-relaxed">
            New components, design updates, and improvements shipped to RareUI.
          </p>
        </motion.header>

        {/* ─── Compact Timeline ───────────────────────────────────────── */}
        <div className="relative">
          {versions.map((version, vi) => (
            <motion.div
              key={version.version}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: vi * 0.04 }}
              className="relative grid grid-cols-[16px_1fr] gap-x-3.5 pb-8 last:pb-4 md:grid-cols-[110px_16px_1fr] md:gap-x-6 md:pb-10"
            >
              {/* ─── Left: Date (Desktop Only) ─── */}
              <div className="hidden pt-0.5 text-right md:block">
                <span className="font-mono text-xs font-normal tracking-wide text-muted-foreground">
                  {version.date}
                </span>
              </div>

              {/* ─── Center: Minimalist Timeline Node + Line ─── */}
              <div className="flex flex-col items-center">
                {version.latest ? (
                  <div className="relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border border-primary/40 bg-primary ring-2 ring-background shadow-pill-inset" />
                ) : (
                  <div className="relative z-10 mt-1.5 h-2 w-2 shrink-0 rounded-full border border-border bg-neutral-300 dark:bg-neutral-700 ring-2 ring-background" />
                )}
                <div className="mt-1.5 w-px flex-1 border-l border-dashed border-border/70" />
              </div>

              {/* ─── Right: Content ─── */}
              <div className="min-w-0">
                {/* Mobile Date */}
                <div className="mb-1.5 md:hidden">
                  <span className="font-mono text-xs font-normal tracking-wide text-muted-foreground">
                    {version.date}
                  </span>
                </div>

                {/* Version + Latest Badge (Compact, using shadow-pill-inset & primary color) */}
                <div className="mb-2 flex items-center gap-1.5">
                  {version.latest ? (
                    <>
                      <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] sm:text-[11px] font-medium tracking-tight text-primary shadow-pill-inset">
                        v{version.version}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 font-mono text-[9px] sm:text-[10px] font-medium tracking-wider text-primary-foreground uppercase shadow-pill-inset">
                        Latest
                      </span>
                    </>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-border/60 bg-neutral-200/70 dark:bg-neutral-800/70 px-2.5 py-0.5 font-mono text-[10px] sm:text-[11px] font-medium tracking-tight text-foreground shadow-pill-inset">
                      v{version.version}
                    </span>
                  )}
                </div>

                {/* Highlight Badges (Compact, shadow-pill-inset, primary accent dot) */}
                {version.highlights.length > 0 && (
                  <div className="mb-3.5 flex flex-wrap items-center gap-1.5">
                    {version.highlights.map((h, hi) => {
                      const firstWord = h.split(' ')[0];
                      const restWords = h.split(' ').slice(1).join(' ');
                      return (
                        <span
                          key={hi}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-neutral-200/60 dark:bg-neutral-800/60 px-2.5 py-0.5 font-mono text-[10px] sm:text-[11px] font-normal text-muted-foreground tracking-tight shadow-pill-inset"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          <span className="font-medium text-foreground">
                            {firstWord}
                          </span>
                          <span>{restWords}</span>
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Grouped Entries */}
                {version.groups.map((group, gi) => (
                  <div key={gi} className="mb-4 last:mb-0">
                    {/* Group Title (no bold, tracking-tight, leading-snug) */}
                    <h2 className="mb-1.5 text-xs sm:text-sm font-medium tracking-tight text-foreground leading-snug">
                      {group.title}
                    </h2>

                    {/* Bullet Points */}
                    <ul className="flex flex-col gap-1.5">
                      {group.entries.map((entry, ei) => (
                        <li key={ei} className="flex items-start gap-2">
                          {/* Bullet dot in primary tint */}
                          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary/70" />
                          <span className="text-xs sm:text-[13px] leading-relaxed tracking-normal text-muted-foreground font-normal">
                            {entry}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* ─── End Marker ─── */}
          <div className="relative grid grid-cols-[16px_1fr] gap-x-3.5 md:grid-cols-[110px_16px_1fr] md:gap-x-6 pt-2 pb-4">
            <div className="hidden md:block" />
            <div className="flex justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-border" />
            </div>
            <div>
              <span className="font-mono text-[10px] sm:text-[11px] font-normal tracking-wide text-muted-foreground/60">
                The beginning
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
