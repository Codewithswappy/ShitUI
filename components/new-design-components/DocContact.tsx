'use client';

import React from 'react';
import Link from 'next/link';
import { Github, Heart, MessageSquare, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DuoGithub, DuoXCom } from './DuoIcons';

export function DocContact() {
  return (
    <section className="flex flex-col gap-3 mb-12">
      <h2
        id="contact"
        className="font-medium text-lg sm:text-xl tracking-tight text-foreground scroll-m-20"
      >
        Contact & Community
      </h2>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/15 dark:bg-neutral-900/25 p-4 sm:p-5 shadow-pill-inset">
        <div className="flex flex-col gap-1 max-w-md">
          <span className="text-xs sm:text-sm font-medium text-foreground tracking-tight">
            Have questions or suggestions?
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Report bugs, request new component features, or connect with me on X.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="https://github.com/Codewithswappy/ShitUI/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-linear-to-b from-neutral-100/80 to-neutral-200/50  dark:border-neutral-800/60 dark:from-neutral-800/80 dark:to-neutral-900/50 px-3 py-1.5 text-xs font-medium text-foreground transition-all duration-150 hover:bg-muted/70 hover:border-border shadow-pill-inset active:scale-95"
          >
            <DuoGithub className="h-3.5 w-3.5" />
            <span>Issues</span>
            <ExternalLink className="h-2.5 w-2.5 text-muted-foreground/60" />
          </Link>

          {/* <Link
            href="https://github.com/sponsors/Codewithswappy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-pink-500/30 bg-pink-500/10 dark:bg-pink-500/15 px-3 py-1.5 text-xs font-medium text-pink-600 dark:text-pink-400 transition-all duration-150 hover:bg-pink-500/20 active:scale-95"
          >
            <Heart className="h-3.5 w-3.5 fill-current" />
            <span>Sponsor</span>
          </Link> */}

          <Link
            href="https://x.com/heyyswap"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-primary px-3 py-1.5 text-xs font-medium text-white shadow-pill-glow transition-all duration-150 active:scale-95"
          >
            <DuoXCom className="h-3.5 w-3.5" />
            <span>@heyyswap</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default DocContact;
