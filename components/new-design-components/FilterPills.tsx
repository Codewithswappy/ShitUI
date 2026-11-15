'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Link } from 'next-view-transitions';
import { motion } from 'motion/react';
import { DuoHome, DuoClock, RoundedMagniferIcon, DuoCuteStar } from './DuoIcons';
import { cn } from '@/lib/utils';

export interface CategoryOption {
  id: string;
  name: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface NavPillsProps {
  onOpenSearch?: () => void;
  className?: string;
}

interface NavItem {
  id: 'home' | 'changelog' | 'search' | 'sponsor';
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    icon: DuoHome,
  },
  {
    id: 'changelog',
    label: 'Changelog',
    href: '/changelog',
    icon: DuoClock,
  },
  {
    id: 'search',
    label: 'Search',
    icon: RoundedMagniferIcon,
    badge: (
      <kbd className="hidden rounded bg-neutral-300 dark:bg-neutral-700 px-1 py-0.2 text-[9px] font-mono text-muted-foreground sm:inline-block">
        ⌘K
      </kbd>
    ),
  },
  {
    id: 'sponsor',
    label: 'Sponsor',
    href: '/sponsors',
    icon: DuoCuteStar,
  },
];

/**
 * Navbar Pill Navigation
 * Order: Home, Changelog, Search, Sponsor
 * Smoothly transfers the blue color and glowing shadow to whichever pill is hovered.
 * When mouse leaves, it glides back to the currently active route pill.
 */
export function NavPills({ onOpenSearch, className }: NavPillsProps) {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollOffsets, setScrollOffsets] = useState({ leftPx: 0, rightPx: 0 });

  const getActiveId = useCallback((): NavItem['id'] => {
    if (pathname === '/changelog' || pathname?.startsWith('/changelog')) return 'changelog';
    if (pathname === '/sponsors' || pathname?.startsWith('/sponsors')) return 'sponsor';
    if (pathname === '/' || pathname === '') return 'home';
    return 'home';
  }, [pathname]);

  const activeId = getActiveId();
  const [hoveredId, setHoveredId] = useState<NavItem['id'] | null>(null);
  const currentHighlight = hoveredId ?? activeId;

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = Math.max(0, scrollWidth - clientWidth);

    const leftPx = Math.round(Math.min(Math.max(scrollLeft, 0), 32));
    const remainingRight = maxScroll - scrollLeft;
    const rightPx = Math.round(Math.min(Math.max(remainingRight, 0), 32));

    setScrollOffsets({ leftPx, rightPx });
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, [handleScroll]);

  // Feathered gradient mask on edges if pills overflow
  const maskStyle: React.CSSProperties = {
    maskImage: `linear-gradient(to right, ${
      scrollOffsets.leftPx > 0
        ? `transparent 0px, black ${scrollOffsets.leftPx}px`
        : 'black 0px'
    }, black calc(100% - ${scrollOffsets.rightPx}px), ${
      scrollOffsets.rightPx > 0 ? 'transparent 100%' : 'black 100%'
    })`,
    WebkitMaskImage: `linear-gradient(to right, ${
      scrollOffsets.leftPx > 0
        ? `transparent 0px, black ${scrollOffsets.leftPx}px`
        : 'black 0px'
    }, black calc(100% - ${scrollOffsets.rightPx}px), ${
      scrollOffsets.rightPx > 0 ? 'transparent 100%' : 'black 100%'
    })`,
    transition: 'mask-image 0.2s ease, -webkit-mask-image 0.2s ease',
  };

  return (
    <div
      className={cn(
        'relative w-auto max-w-[340px] sm:max-w-[420px] md:max-w-[480px] select-none',
        className
      )}
    >
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseLeave={() => setHoveredId(null)}
        style={maskStyle}
        className="flex items-center justify-center gap-1.5 overflow-x-auto scrollbar-none sm:gap-2 p-1"
      >
        {NAV_ITEMS.map((item) => {
          const isHighlighted = currentHighlight === item.id;
          const isLink = !!item.href;

          const innerContent = (
            <>
              {/* Smooth Liquid Sliding Blue Pill with shadow-pill-glow */}
              {isHighlighted && (
                <motion.div
                  layoutId="navbar-pill-active-glow"
                  transition={{
                    type: 'spring',
                    stiffness: 420,
                    damping: 30,
                  }}
                  className="absolute inset-0 rounded-full bg-primary shadow-pill-glow z-0"
                />
              )}

              {/* Pill Content (Icon + Label + Optional Badge) */}
              <span className="relative z-10 flex items-center gap-1.5 pointer-events-none">
                <item.icon
                  className={cn(
                    'h-3.5 w-3.5 shrink-0 transition-colors duration-150',
                    item.id === 'sponsor' && 'fill-current',
                    isHighlighted
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground'
                  )}
                />
                <span
                  className={cn(
                    'transition-colors duration-150',
                    isHighlighted
                      ? 'text-primary-foreground font-medium'
                      : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </span>
                {item.badge}
              </span>
            </>
          );

          const pillClasses = cn(
            'relative inline-flex shrink-0 items-center justify-center rounded-full px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs transition-colors select-none sm:text-sm cursor-pointer',
            'bg-neutral-200 dark:bg-neutral-800 shadow-pill-inset active:scale-98'
          );

          if (isLink && item.href) {
            return (
              <Link
                key={item.id}
                href={item.href}
                onMouseEnter={() => setHoveredId(item.id)}
                className={pillClasses}
              >
                {innerContent}
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={onOpenSearch}
              onMouseEnter={() => setHoveredId(item.id)}
              className={pillClasses}
              aria-label="Search components"
            >
              {innerContent}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Backward-compatible FilterPills export
export interface FilterPillsProps {
  categories?: CategoryOption[];
  activeCategory?: string;
  onSelectCategory?: (id: string) => void;
  onOpenSearch?: () => void;
  starsCount?: number | null;
}

export function FilterPills({ onOpenSearch }: FilterPillsProps) {
  return <NavPills onOpenSearch={onOpenSearch} />;
}
