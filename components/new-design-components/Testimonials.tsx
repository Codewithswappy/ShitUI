'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'next-view-transitions';
import { DuoXCom, DuoArrowRight } from './DuoIcons';
import { cn } from '@/lib/utils';

export interface Testimonial {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  content: string;
  verified?: boolean;
  variant?: 'vertical' | 'square' | 'horizontal';
}

export const FEEDBACK_WALL: Testimonial[] = [
  {
    id: 1,
    name: 'Pritam',
    handle: '@iPritamX',
    avatar: 'https://unavatar.io/twitter/iPritamX',
    content: 'Looks sharp! The craftsmanship is next level.',
    verified: true,
    variant: 'horizontal',
  },
  {
    id: 2,
    name: 'Leo Do',
    handle: '@leododev',
    avatar: 'https://unavatar.io/twitter/leododev',
    content: 'Nice animations. The micro-interactions and tactile physics feel super responsive.',
    verified: true,
    variant: 'square',
  },
  {
    id: 3,
    name: 'subhan',
    handle: '@subhanmalik911',
    avatar: 'https://unavatar.io/twitter/subhanmalik911',
    content:
      'Respect! How long you been grinding on this? Looks solid already. Definitely using this in my projects.',
    verified: false,
    variant: 'vertical',
  },
  {
    id: 4,
    name: 'Terence',
    handle: '@terencebuilds',
    avatar: 'https://unavatar.io/twitter/terencebuilds',
    content: 'This is so cool and will distract me soooo much 😂',
    verified: true,
    variant: 'horizontal',
  },
  {
    id: 5,
    name: 'Terence',
    handle: '@terencebuilds',
    avatar: 'https://unavatar.io/twitter/terencebuilds',
    content: 'This looks really amazing. Pure craft.',
    verified: true,
    variant: 'horizontal',
  },
  {
    id: 6,
    name: 'Ilia Stepin',
    handle: '@martbln_dev',
    avatar: 'https://unavatar.io/twitter/martbln_dev',
    content: 'Love it! 😍 Truly inspiring work for modern web developers.',
    verified: true,
    variant: 'horizontal',
  },
  {
    id: 7,
    name: 'subhan',
    handle: '@subhanmalik911',
    avatar: 'https://unavatar.io/twitter/subhanmalik911',
    content: "This looks clean, it's solid work man! Can't wait to see more components added.",
    verified: false,
    variant: 'square',
  },
  {
    id: 8,
    name: 'Ziwen Xu',
    handle: '@ziwenxu_',
    avatar: 'https://unavatar.io/twitter/ziwenxu_',
    content:
      'Love the craft and the detail in this library! Truly amazing work and attention to every subtle interaction.',
    verified: true,
    variant: 'vertical',
  },
  {
    id: 9,
    name: 'Steven Tey',
    handle: '@steventey',
    avatar: 'https://unavatar.io/twitter/steventey',
    content:
      'The level of polish here is insane. RareUI is a game changer for anyone building high-performance landing pages.',
    verified: true,
    variant: 'vertical',
  },
  {
    id: 10,
    name: 'Guillermo Rauch',
    handle: '@rauchg',
    avatar: 'https://unavatar.io/twitter/rauchg',
    content: 'Design engineering is the differentiator.',
    verified: true,
    variant: 'horizontal',
  },
  {
    id: 11,
    name: 'Prashant',
    handle: '@prashantbuilds',
    avatar: 'https://unavatar.io/twitter/prashantbuilds',
    content:
      'These components feel like actual native app physics. Best animated React library I have used this year.',
    verified: true,
    variant: 'vertical',
  },
  {
    id: 12,
    name: 'Sahil',
    handle: '@sahilcreates',
    avatar: 'https://unavatar.io/twitter/sahilcreates',
    content:
      'The attention to sound, spring physics, and micro-interactions is rare in the web ecosystem. Pure craft.',
    verified: false,
    variant: 'square',
  },
  {
    id: 13,
    name: 'Devon',
    handle: '@devon_ui',
    avatar: 'https://unavatar.io/twitter/devon_ui',
    content:
      'The liquid button and magnetic text blew my mind. Dropped it straight into our landing page.',
    verified: true,
    variant: 'horizontal',
  },
  {
    id: 14,
    name: 'Alex',
    handle: '@alexm_dev',
    avatar: 'https://unavatar.io/twitter/alexm_dev',
    content:
      'Shadcn CLI support makes installing these instant. Just copy and paste, zero config headaches.',
    verified: true,
    variant: 'square',
  },
  {
    id: 15,
    name: 'Rohan',
    handle: '@rohan_crafts',
    avatar: 'https://unavatar.io/twitter/rohan_crafts',
    content:
      'The rebrand to ShitUI is hilarious and unforgettable, but the components are genuinely top tier.',
    verified: true,
    variant: 'horizontal',
  },
  {
    id: 16,
    name: 'Kavya',
    handle: '@kavyaux',
    avatar: 'https://unavatar.io/twitter/kavyaux',
    content:
      'Finally a library where animations feel natural instead of clunky CSS transitions. 10/10.',
    verified: false,
    variant: 'vertical',
  },
];

const VARIANT_HEIGHTS: Record<'vertical' | 'square' | 'horizontal', string> = {
  vertical: 'h-[220px] sm:h-[240px]',
  square: 'h-[165px] sm:h-[180px]',
  horizontal: 'h-[125px] sm:h-[135px]',
};

export const PremiumTweetCard = ({ item }: { item: Testimonial }) => {
  const profileUrl = `https://x.com/${item.handle.replace('@', '')}`;
  const variant = item.variant || 'square';
  const heightClass = VARIANT_HEIGHTS[variant];

  return (
    <a
      href={profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group shadow-pill-inset relative block w-full shrink-0 rounded-lg bg-neutral-100 p-4 transition-[transform,box-shadow,opacity] duration-200 ease-out active:scale-[0.99] dark:bg-neutral-800',
        heightClass
      )}
    >
      {/* Card Content Layout based on user sketch */}
      <div className="relative z-10 flex h-full flex-col justify-between">
        {/* Top: Content text on left, Duo X logo on top right */}
        <div className="flex items-start justify-between gap-3">
          <p
            className={cn(
              'text-foreground/90 leading-relaxed font-normal tracking-tight',
              variant === 'vertical' && 'line-clamp-4 text-[14px]',
              variant === 'square' && 'line-clamp-3 text-[13.5px]',
              variant === 'horizontal' && 'line-clamp-2 text-[13px]'
            )}
          >
            {item.content}
          </p>
          <DuoXCom className="text-muted-foreground group-hover:text-foreground h-4 w-4 shrink-0 transition-colors" />
        </div>

        {/* Bottom Left: Avatar + Author Name + Handle */}
        <div className="flex items-center gap-2.5 pt-2">
          <div className="bg-muted h-9 w-9 shrink-0 overflow-hidden rounded-lg shadow-md ring-2 shadow-black/10 ring-black/10 dark:ring-white/10">
            <img
              src={item.avatar}
              alt={item.name}
              loading="lazy"
              className="shadow-pill-inset h-full w-full object-cover"
            />
          </div>
          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-1">
              <span className="text-foreground group-hover:text-primary truncate text-[13px] font-semibold transition-colors">
                {item.name}
              </span>
              {item.verified && (
                <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0 fill-current text-[#1D9BF0]">
                  <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.97-.81-4.08s-2.47-1.49-3.89-1.29c-.78-1.57-2.34-2.54-4.11-2.54s-3.33.97-4.11 2.54c-1.42-.2-2.88.18-3.89 1.29s-1.27 2.69-.81 4.08c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.97.81 4.08s2.47 1.49 3.89 1.29c.78 1.57 2.34 2.54 4.11 2.54s-3.33-.97 4.11-2.54c1.42.2 2.88-.18 3.89-1.29s1.27-2.69.81-4.08c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2l-3.5-3.5 1.4-1.4 2.1 2.1 5.3-5.3 1.4 1.4-6.7 6.7z" />
                </svg>
              )}
            </div>
            <span className="text-muted-foreground truncate text-[11.5px] font-medium">
              {item.handle}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
};

export function Testimonials() {
  const col1 = FEEDBACK_WALL.filter((_, i) => i % 2 === 0);
  const col2 = FEEDBACK_WALL.filter((_, i) => i % 2 === 1);

  // Duplicate for seamless 50% infinite vertical loop
  const dupCol1 = [...col1, ...col1];
  const dupCol2 = [...col2, ...col2];

  return (
    <section className="relative z-10 w-full overflow-hidden py-16 transition-colors duration-500 sm:py-24">
      <div className="mx-auto w-full max-w-[1700px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Side: Center Text */}
          <div className="flex flex-col justify-center pr-0 lg:col-span-5 lg:pr-6">
            <h2 className="text-foreground mb-4 text-xl leading-[1.08] font-medium tracking-tighter sm:text-2xl md:text-3xl lg:text-4xl">
              They loved RareUI. <br />
              Now it&apos;s ShitUI.
            </h2>
            <p className="sm:text-md text-muted-foreground max-w-md text-sm leading-relaxed tracking-tight">
              Real feedback from our RareUI era. We changed the name to ShitUI, but the obsession
              with craft stayed the same.
            </p>
          </div>

          {/* Right Side: Vertical Marquee Masonry Grid with Smooth Vanish Vignette */}
          <div className="relative h-[560px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.02)_2%,rgba(0,0,0,0.1)_6%,rgba(0,0,0,0.35)_12%,rgba(0,0,0,0.75)_18%,black_25%,black_75%,rgba(0,0,0,0.75)_82%,rgba(0,0,0,0.35)_88%,rgba(0,0,0,0.1)_94%,rgba(0,0,0,0.02)_98%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.02)_2%,rgba(0,0,0,0.1)_6%,rgba(0,0,0,0.35)_12%,rgba(0,0,0,0.75)_18%,black_25%,black_75%,rgba(0,0,0,0.75)_82%,rgba(0,0,0,0.35)_88%,rgba(0,0,0,0.1)_94%,rgba(0,0,0,0.02)_98%,transparent_100%)] sm:h-[650px] lg:col-span-7">
            {/* Top Soft Blur Vanish Vignette */}
            <div className="from-background via-background/80 pointer-events-none absolute inset-x-0 top-0 z-20 h-28 bg-gradient-to-b to-transparent [mask-image:linear-gradient(to_bottom,black_30%,transparent)] backdrop-blur-[2.5px] [-webkit-mask-image:linear-gradient(to_bottom,black_30%,transparent)]" />

            {/* Bottom Soft Blur Vanish Vignette */}
            <div className="from-background via-background/80 pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 bg-gradient-to-t to-transparent [mask-image:linear-gradient(to_top,black_30%,transparent)] backdrop-blur-[2.5px] [-webkit-mask-image:linear-gradient(to_top,black_30%,transparent)]" />

            <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              {/* Column 1 - Scrolling UP with Hardware-Accelerated 60/120fps Transform */}
              <motion.div
                animate={{ y: ['0%', '-50%'] }}
                transition={{
                  duration: 30,
                  ease: 'linear',
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
                style={{ willChange: 'transform' }}
                className="flex transform-gpu flex-col gap-4 will-change-transform select-none sm:gap-6"
              >
                {dupCol1.map((item, i) => (
                  <PremiumTweetCard key={`col1-${item.id}-${i}`} item={item} />
                ))}
              </motion.div>

              {/* Column 2 - Scrolling DOWN with Hardware-Accelerated 60/120fps Transform */}
              <motion.div
                animate={{ y: ['-50%', '0%'] }}
                transition={{
                  duration: 34,
                  ease: 'linear',
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
                style={{ willChange: 'transform' }}
                className="hidden transform-gpu flex-col gap-4 will-change-transform select-none sm:flex sm:gap-6"
              >
                {dupCol2.map((item, i) => (
                  <PremiumTweetCard key={`col2-${item.id}-${i}`} item={item} />
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Centered: View all testimonials button */}
        <div className="mt-10 flex items-center justify-center sm:mt-14">
          <Link
            href="/testimonials"
            className="group shadow-pill-glow inline-flex items-center gap-2 rounded-full bg-[#3f80ff] px-5 py-2.5 text-xs font-semibold text-white transition-all active:scale-98 sm:text-sm"
          >
            <span>View all testimonials</span>
            <DuoArrowRight className="h-3.5 w-3.5 text-white transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
