'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Link } from 'next-view-transitions';
import { useTheme } from 'next-themes';
import { Sun, Moon, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DuoHome,
  DuoClock,
  RoundedMagniferIcon,
  DuoCuteStar,
  DuoGithub,
  DuoSparkle,
} from './DuoIcons';
import { useSearchContext } from './search-context';
import { NavPills } from './FilterPills';
import { GitHubStarButton } from './GitHubStarButton';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// ============================================================================
// CUSTOM STREAMLINE SOLAR ICONS FOR HAMBURGER & CROSS
// ============================================================================

export function ListHamburgerIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      id="List-1--Streamline-Solar"
      className={cn('h-5 w-5', className)}
    >
      <g id="Line Duotone/List/List-1">
        <path
          d="M15 12H4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="stroke-neutral-500 dark:stroke-neutral-400"
        />
        <path
          d="M9 17H4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="stroke-neutral-500 dark:stroke-neutral-400"
        />
        <path
          d="M20 7H4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="stroke-foreground"
        />
      </g>
    </svg>
  );
}

export function ListCrossIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      id="List-Cross-Minimalistic--Streamline-Solar"
      className={cn('h-5 w-5', className)}
    >
      <g id="Bold Duotone/List/List Cross Minimalistic">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.25 6c0 -0.41421 0.33579 -0.75 0.75 -0.75h17c0.4142 0 0.75 0.33579 0.75 0.75s-0.3358 0.75 -0.75 0.75H3c-0.41421 0 -0.75 -0.33579 -0.75 -0.75Zm0 5c0 -0.4142 0.33579 -0.75 0.75 -0.75h8c0.4142 0 0.75 0.3358 0.75 0.75s-0.3358 0.75 -0.75 0.75H3c-0.41421 0 -0.75 -0.3358 -0.75 -0.75Zm0 5c0 -0.4142 0.33579 -0.75 0.75 -0.75h8c0.4142 0 0.75 0.3358 0.75 0.75s-0.3358 0.75 -0.75 0.75H3c-0.41421 0 -0.75 -0.3358 -0.75 -0.75Z"
          className="fill-neutral-500 dark:fill-neutral-400"
        />
        <path
          d="M14.4697 10.4697c0.2929 -0.2929 0.7677 -0.2929 1.0606 0L17.5 12.4393l1.9697 -1.9696c0.2929 -0.2929 0.7677 -0.2929 1.0606 0 0.2929 0.2929 0.2929 0.7677 0 1.0606L18.5607 13.5l1.9696 1.9697c0.2929 0.2929 0.2929 0.7677 0 1.0606 -0.2929 0.2929 -0.7677 0.2929 -1.0606 0L17.5 14.5607l-1.9697 1.9696c-0.2929 0.2929 -0.7677 0.2929 -1.0606 0 -0.2929 -0.2929 -0.2929 -0.7677 0 -1.0606L16.4393 13.5l-1.9696 -1.9697c-0.2929 -0.2929 -0.2929 -0.7677 0 -1.0606Z"
          className="fill-foreground"
        />
      </g>
    </svg>
  );
}

// ============================================================================
// TOP NAVIGATION COMPONENT
// ============================================================================

export interface TopNavigationProps {
  starsCount?: number | null;
  onOpenSearch?: () => void;
}

export function TopNavigation({
  starsCount: propStars,
  onOpenSearch: propOnOpenSearch,
}: TopNavigationProps = {}) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [stars, setStars] = useState<number | null>(propStars ?? null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { setOpenSearch } = useSearchContext();

  const handleOpenSearch = () => {
    if (propOnOpenSearch) {
      propOnOpenSearch();
    } else {
      setOpenSearch(true);
    }
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when full-screen mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Sync stars from prop if provided, or fetch directly if not provided
  useEffect(() => {
    if (propStars !== undefined && propStars !== null) {
      setStars(propStars);
      return;
    }
    let isMounted = true;
    fetch('https://api.github.com/repos/Codewithswappy/ShitUI')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && typeof data.stargazers_count === 'number') {
          setStars(data.stargazers_count);
        }
      })
      .catch((err) => {
        console.error('Error fetching GitHub stars:', err);
      });
    return () => {
      isMounted = false;
    };
  }, [propStars]);

  const isDark = mounted && resolvedTheme === 'dark';

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!document.startViewTransition) {
      setTheme(isDark ? 'light' : 'dark');
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setTheme(isDark ? 'light' : 'dark');
    });

    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
          },
          {
            duration: 600,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      })
      .catch(() => {
        // Silently catch transition abort if document is hidden or navigation interrupted
      });
  };

  const isHomeActive = pathname === '/' || pathname === '';
  const isChangelogActive = pathname === '/changelog' || pathname?.startsWith('/changelog');
  const isSponsorActive = pathname === '/sponsors' || pathname?.startsWith('/sponsors');

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full select-none transition-all duration-200',
          isScrolled
            ? 'bg-background'
            : 'bg-background'
        )}
      >
        <div className="mx-auto flex h-12 max-w-[1700px] items-center justify-between px-4 sm:px-8 lg:px-12">
          {/* Left: Brand Logo (fixed balanced width) */}
          <div className="flex items-center w-28 sm:w-36 shrink-0">
            <Link
              href="/"
              className="sponge-logo flex items-center select-none"
              aria-label="ShitUI Home"
            >
              <Image
                className="sponge-logo__mark h-[34px] w-[34px] object-contain"
                src="/logo/shitlogo1.svg"
                alt="ShitUI logo mark"
                width={34}
                height={34}
                priority
              />
            </Link>
          </div>

          {/* Center: Pill Navigation (desktop only, centered) */}
          <div className="hidden md:flex items-center justify-center flex-1 min-w-0 mx-2">
            <NavPills onOpenSearch={handleOpenSearch} />
          </div>

          {/* Right: GitHub Stars + Theme Toggle + Mobile Hamburger Button */}
          <div className="flex items-center justify-end w-auto sm:w-auto shrink-0 gap-1.5 sm:gap-2.5 select-none">
            {/* GitHub Repo Stars Button */}
            <GitHubStarButton size="sm" />

            {/* Dark / Light mode switch */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-8 w-8 items-center justify-center cursor-pointer select-none rounded-full hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-colors"
              title="Toggle theme"
            >
              {mounted ? (
                isDark ? (
                  <Sun className="h-5 w-5 dark:fill-neutral-600 dark:stroke-neutral-400" />
                ) : (
                  <Moon className="h-5 w-5 fill-neutral-200 stroke-neutral-600" />
                )
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open navigation menu"
              className="flex h-8 w-8 items-center justify-center cursor-pointer select-none rounded-full hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-colors md:hidden"
            >
              <ListHamburgerIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* True Full-Screen Mobile Navigation Overlay (Solid Background, Zero Bleed, Zero Pill Styling) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="mobile-fullscreen-overlay"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{
              duration: 0.26,
              ease: [0.32, 0.72, 0, 1],
            }}
            className="fixed inset-0 z-[100] bg-background md:hidden flex flex-col justify-between select-none"
          >
            {/* Top Bar inside Fullscreen: Exact Height & Alignment with Close Cross Button */}
            <div className="flex h-12 w-full items-center justify-between px-4 sm:px-8 border-b border-border/30 bg-background shrink-0">
              {/* Left: Brand Logo */}
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="sponge-logo flex items-center select-none"
                aria-label="ShitUI Home"
              >
                <Image
                  className="sponge-logo__mark h-[34px] w-[34px] object-contain"
                  src="/logo/shitlogo1.svg"
                  alt="ShitUI logo mark"
                  width={34}
                  height={34}
                  priority
                />
              </Link>

              {/* Right: GitHub Stars + Theme Toggle + Close (Cross) Button */}
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <GitHubStarButton size="sm" />
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="flex h-8 w-8 items-center justify-center cursor-pointer select-none rounded-full hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-colors"
                >
                  {mounted ? (
                    isDark ? (
                      <Sun className="h-5 w-5 dark:fill-neutral-600 dark:stroke-neutral-400" />
                    ) : (
                      <Moon className="h-5 w-5 fill-neutral-200 stroke-neutral-600" />
                    )
                  ) : (
                    <DuoSparkle className="h-5 w-5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="flex h-8 w-8 items-center justify-center cursor-pointer select-none rounded-full hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-colors"
                >
                  <ListCrossIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Navigation Menu aligned to start/top (NO gap on top, NO dots, NO pills) */}
            <div className="flex-1 flex flex-col justify-start px-6 sm:px-8 pt-4 sm:pt-6 pb-8 overflow-y-auto">
              <nav className="flex flex-col divide-y divide-border/25">
                {/* 1. Home */}
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'group flex items-center justify-between py-4.5 text-2xl font-medium tracking-tight transition-colors select-none',
                    isHomeActive
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <DuoHome
                      className={cn(
                        'h-6 w-6 shrink-0 transition-colors',
                        isHomeActive
                          ? 'text-primary'
                          : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                    <span>Home</span>
                  </div>
                </Link>

                {/* 2. Changelog */}
                <Link
                  href="/changelog"
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'group flex items-center justify-between py-4.5 text-2xl font-medium tracking-tight transition-colors select-none',
                    isChangelogActive
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <DuoClock
                      className={cn(
                        'h-6 w-6 shrink-0 transition-colors',
                        isChangelogActive
                          ? 'text-primary'
                          : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                    <span>Changelog</span>
                  </div>
                </Link>

                {/* 3. Search */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleOpenSearch();
                  }}
                  className="group flex items-center justify-between py-4.5 text-2xl font-medium tracking-tight text-muted-foreground hover:text-foreground transition-colors select-none w-full text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <RoundedMagniferIcon className="h-6 w-6 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span>Search</span>
                  </div>
                  <kbd className="rounded bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 text-xs font-mono text-muted-foreground">
                    ⌘K
                  </kbd>
                </button>

                {/* 4. Sponsor */}
                <Link
                  href="/sponsors"
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'group flex items-center justify-between py-4.5 text-2xl font-medium tracking-tight transition-colors select-none',
                    isSponsorActive
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <DuoCuteStar
                      className={cn(
                        'h-6 w-6 shrink-0 fill-current transition-colors',
                        isSponsorActive
                          ? 'text-primary'
                          : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                    <span>Sponsor</span>
                  </div>
                </Link>
              </nav>
            </div>

            {/* Bottom Footer inside Fullscreen Menu */}
            <div className="w-full px-6 sm:px-8 py-5 border-t border-border/25 flex items-center justify-between text-xs text-muted-foreground font-mono shrink-0">
              <span>ShitUI (Formerly RareUI)</span>
              <a
                href="https://github.com/Codewithswappy/ShitUI"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <DuoGithub className="h-4 w-4" />
                <span>GitHub {stars !== null && `★ ${stars}`}</span>
                <ArrowUpRight className="h-3 w-3 opacity-60" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default TopNavigation;
