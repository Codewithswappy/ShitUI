'use client';

import React from 'react';
import { motion } from 'motion/react';
import { TopNavigation } from '@/components/new-design-components/TopNavigation';
import { NewFooter } from '@/components/new-design-components/NewFooter';
import {
  FEEDBACK_WALL,
  PremiumTweetCard,
} from '@/components/new-design-components/Testimonials';
import { DuoXCom } from '@/components/new-design-components/DuoIcons';

export default function TestimonialsPage() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary">
      <TopNavigation />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Page Heading & Sub Heading - Small, Left-aligned like HeroCard */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex max-w-2xl flex-col space-y-1.5 text-left mb-8 sm:mb-12"
        >
          <h1 className="text-xl font-medium tracking-tight text-foreground leading-snug sm:text-2xl">
            Loved by Builders. <br />
            Unfiltered feedback from the community.
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Real feedback, tweets, and comments from developers, designers, and founders who build with ShitUI.
          </p>
        </motion.div>

        {/* Testimonials Masonry Grid using same cards */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6 space-y-4 sm:space-y-6"
        >
          {FEEDBACK_WALL.map((item) => (
            <div key={item.id} className="break-inside-avoid">
              <PremiumTweetCard item={item} />
            </div>
          ))}
        </motion.div>

        {/* Share feedback callout */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-14 sm:mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border/70 bg-neutral-100/70 dark:bg-neutral-900/60 p-5 sm:p-6 shadow-pill-inset"
        >
          <div className="flex flex-col text-left">
            <h3 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
              Built something with ShitUI?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Tag us on X or drop your feedback to get your tweet featured here.
            </p>
          </div>

          <a
            href="https://x.com/shituihq"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-pill-glow transition-all hover:opacity-95 active:scale-98 shrink-0"
          >
            <DuoXCom className="h-3.5 w-3.5 fill-current" />
            <span>Tweet @shituihq</span>
          </a>
        </motion.div>
      </main>

      <NewFooter />
    </div>
  );
}

