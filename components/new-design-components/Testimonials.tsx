'use client';

import React from 'react';
import { motion } from 'motion/react';
import { DuoXCom } from './DuoIcons';
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
    content: 'Respect! How long you been grinding on this? Looks solid already. Definitely using this in my projects.',
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
    content: 'Love the craft and the detail in this library! Truly amazing work and attention to every subtle interaction.',
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
];

const VARIANT_HEIGHTS: Record<'vertical' | 'square' | 'horizontal', string> = {
  vertical: 'h-[220px] sm:h-[240px]',
  square: 'h-[165px] sm:h-[180px]',
  horizontal: 'h-[125px] sm:h-[135px]',
};

const PremiumTweetCard = ({ item }: { item: Testimonial }) => {
  const profileUrl = `https://x.com/${item.handle.replace('@', '')}`;
  const variant = item.variant || 'square';
  const heightClass = VARIANT_HEIGHTS[variant];

  return (
    <a
      href={profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group relative block w-full shrink-0 rounded-lg bg-neutral-100 p-4 shadow-pill-inset transition-[transform,box-shadow,opacity] duration-200 ease-out  dark:bg-neutral-800 active:scale-[0.99]',
        heightClass
      )}
    >
      {/* Card Content Layout based on user sketch */}
      <div className="relative z-10 flex h-full flex-col justify-between">
        {/* Top: Content text on left, Duo X logo on top right */}
        <div className="flex items-start justify-between gap-3">
          <p
            className={cn(
              'leading-relaxed tracking-tight text-foreground/90 font-normal',
              variant === 'vertical' && 'text-[14px] line-clamp-4',
              variant === 'square' && 'text-[13.5px] line-clamp-3',
              variant === 'horizontal' && 'text-[13px] line-clamp-2'
            )}
          >
            {item.content}
          </p>
          <DuoXCom className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
        </div>

        {/* Bottom Left: Avatar + Author Name + Handle */}
        <div className="flex items-center gap-2.5 pt-2">
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-muted shadow-md shadow-black/10 ring-2 ring-black/10 dark:ring-white/10">
            <img
              src={item.avatar}
              alt={item.name}
              loading="lazy"
              className="h-full w-full object-cover shadow-pill-inset"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[13px] font-semibold text-foreground transition-colors group-hover:text-primary truncate">
                {item.name}
              </span>
              {item.verified && (
                <svg
                  viewBox="0 0 24 24"
                  className="h-3 w-3 shrink-0 fill-current text-[#1D9BF0]"
                >
                  <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.97-.81-4.08s-2.47-1.49-3.89-1.29c-.78-1.57-2.34-2.54-4.11-2.54s-3.33.97-4.11 2.54c-1.42-.2-2.88.18-3.89 1.29s-1.27 2.69-.81 4.08c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.97.81 4.08s2.47 1.49 3.89 1.29c.78 1.57 2.34 2.54 4.11 2.54s-3.33-.97 4.11-2.54c1.42.2 2.88-.18 3.89-1.29s1.27-2.69.81-4.08c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2l-3.5-3.5 1.4-1.4 2.1 2.1 5.3-5.3 1.4 1.4-6.7 6.7z" />
                </svg>
              )}
            </div>
            <span className="text-[11.5px] font-medium text-muted-foreground truncate">
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
    <section className="relative z-10 w-full overflow-hidden py-16 sm:py-24 transition-colors duration-500">
      <div className="mx-auto w-full max-w-[1700px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          
          {/* Left Side: Center Text */}
          <div className="flex flex-col justify-center lg:col-span-5 pr-0 lg:pr-6">
            <h2 className="mb-4 text-xl font-medium tracking-tighter text-foreground sm:text-2xl md:text-3xl lg:text-4xl leading-[1.08]">
              They loved RareUI. <br />
              Now it&apos;s ShitUI.
            </h2>
            <p className="max-w-md text-sm sm:text-md tracking-tight text-muted-foreground leading-relaxed">
              Real feedback from our RareUI era. We changed the name to ShitUI, but the obsession with craft stayed the same.
            </p>
          </div>

          {/* Right Side: Vertical Marquee Masonry Grid with Smooth Vanish Vignette */}
          <div className="relative h-[560px] sm:h-[650px] overflow-hidden lg:col-span-7 [mask-image:linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.02)_2%,rgba(0,0,0,0.1)_6%,rgba(0,0,0,0.35)_12%,rgba(0,0,0,0.75)_18%,black_25%,black_75%,rgba(0,0,0,0.75)_82%,rgba(0,0,0,0.35)_88%,rgba(0,0,0,0.1)_94%,rgba(0,0,0,0.02)_98%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.02)_2%,rgba(0,0,0,0.1)_6%,rgba(0,0,0,0.35)_12%,rgba(0,0,0,0.75)_18%,black_25%,black_75%,rgba(0,0,0,0.75)_82%,rgba(0,0,0,0.35)_88%,rgba(0,0,0,0.1)_94%,rgba(0,0,0,0.02)_98%,transparent_100%)]">
            {/* Top Soft Blur Vanish Vignette */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-28 bg-gradient-to-b from-background via-background/80 to-transparent backdrop-blur-[2.5px] [mask-image:linear-gradient(to_bottom,black_30%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,black_30%,transparent)]" />

            {/* Bottom Soft Blur Vanish Vignette */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 bg-gradient-to-t from-background via-background/80 to-transparent backdrop-blur-[2.5px] [mask-image:linear-gradient(to_top,black_30%,transparent)] [-webkit-mask-image:linear-gradient(to_top,black_30%,transparent)]" />

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
                className="flex flex-col gap-4 sm:gap-6 will-change-transform transform-gpu select-none"
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
                className="hidden sm:flex flex-col gap-4 sm:gap-6 will-change-transform transform-gpu select-none"
              >
                {dupCol2.map((item, i) => (
                  <PremiumTweetCard key={`col2-${item.id}-${i}`} item={item} />
                ))}
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Testimonials;
