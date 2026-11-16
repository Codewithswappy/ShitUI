'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { Sun, Moon, Heart } from 'lucide-react';
import Link from 'next/link';
import { RareLogo } from './RareLogo';
import { GitHubStarButton } from './GitHubStarButton';
import { useSearchContext } from './search-context';

export interface DocsHeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  className?: string;
}

/**
 * Duo-stroke sidebar menu icon from @public/icons/duo-stroke/sidebar-menu.svg
 */
function SidebarMenuIcon({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        opacity="0.32"
        d="M9 3.01105C9.57703 3 10.2365 3 11 3H13C15.8003 3 17.2004 3 18.27 3.54497C19.2108 4.02433 19.9757 4.78924 20.455 5.73005C21 6.79961 21 8.19974 21 11V13C21 15.8003 21 17.2004 20.455 18.27C19.9757 19.2108 19.2108 19.9757 18.27 20.455C17.2004 21 15.8003 21 13 21H11C10.2365 21 9.57703 21 9 20.989"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 7.99994H6.01M6 11.9999H6.01M6 15.9999H6.01M5.73005 20.455C4.78924 19.9756 4.02433 19.2107 3.54497 18.2699C3 17.2003 3 15.8002 3 12.9999V10.9999C3 8.19968 3 6.79955 3.54497 5.72999C4.02433 4.78918 4.78924 4.02427 5.73005 3.54491C6.50797 3.14853 7.46078 3.04046 9 3.01099V20.9889C7.46078 20.9594 6.50797 20.8513 5.73005 20.455Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Clean Dark / Light Mode Toggle Button with view transitions
 */
function DocThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
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

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="flex h-10 w-11 items-center justify-center rounded-lg bg-muted/20 text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-muted/50 hover:text-foreground active:scale-95 cursor-pointer"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-5 w-5 transition-transform duration-200 hover:rotate-45" />
        ) : (
          <Moon className="h-5 w-5 transition-transform duration-200 hover:-rotate-12" />
        )
      ) : (
        <Sun className="h-5 w-5 opacity-50" />
      )}
    </button>
  );
}

/**
 * Rounded Magnifer Streamline Solar Icon for search
 */
function RoundedMagniferIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={className}
    >
      <g id="Line Duotone/Search/Rounded Magnifer">
        <path
          stroke="currentColor"
          opacity="0.45"
          d="M11 20c4.9706 0 9 -4.0294 9 -9 0 -4.97056 -4.0294 -9 -9 -9 -4.97056 0 -9 4.02944 -9 9 0 4.9706 4.02944 9 9 9Z"
          strokeWidth="1.5"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          d="M21.8121 20.9749c-0.0627 0.0947 -0.176 0.208 -0.4026 0.4346 -0.2266 0.2266 -0.3399 0.3399 -0.4346 0.4026 -0.5546 0.3673 -1.3049 0.178 -1.6189 -0.4084 -0.0536 -0.1001 -0.0996 -0.2536 -0.1916 -0.5606 -0.1005 -0.3354 -0.1507 -0.5032 -0.1605 -0.6212 -0.0572 -0.695 0.523 -1.2752 1.218 -1.218 0.118 0.0098 0.2857 0.06 0.6212 0.1605 0.307 0.092 0.4605 0.138 0.5606 0.1916 0.5864 0.314 0.7757 1.0643 0.4084 1.6189Z"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
}

/**
 * Single-line Docs Header component:
 * - Consistent h-10 height across left sidebar icon, center sponsor bar, and right theme toggle + sponsor button
 * - Center floating RareLogo medallion hugging the socket curve without touching
 */
export function DocsHeader({
  isSidebarOpen,
  onToggleSidebar,
  className,
}: DocsHeaderProps) {
  const { setOpenSearch } = useSearchContext();

  return (
    <header
      className={cn(
        'flex h-16 w-full shrink-0 items-center justify-between px-3 sm:px-6 bg-transparent border-0',
        className
      )}
    >
      {/* Left: Sidebar Toggle Icon Button (consistent h-10 height) */}
      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          aria-expanded={isSidebarOpen}
          className={cn(
            'group flex h-10 w-11 items-center justify-center rounded-lg  transition-all duration-200  hover:bg-muted/50  active:scale-95 cursor-pointer',
            isSidebarOpen && ' hover:bg-muted/50 '
          )}
        > 
          <SidebarMenuIcon className="h-7 w-7 transition-transform duration-200 group-hover:scale-105" />
        </button>
      </div>

      {/* Center: Sponsor Area with increased width & height, tightly hugging logo with minimal gap */}
      {/* <div
        className="flex-1 max-w-4xl mx-2 sm:mx-6 flex items-center justify-center relative select-none min-w-0"
        data-slot="sponsor-area"
        aria-label="Sponsor Area"
      >
        <div className="relative w-full flex items-center justify-center h-12"> */}
          {/* Left Wing: Straight body + curved concave end socket */}
          {/* <div className="flex-1 flex items-center h-10 min-w-0"> */}
            {/* Straight bar body */}
            {/* <div className="flex-1 h-full rounded-l-lg bg-neutral-100 dark:bg-neutral-900 border-l border-y border-neutral-300/80 dark:border-neutral-700/80" /> */}

            {/* Concave socket curve hugging the circle closely */}
            {/* <svg
              className="w-6 h-10 shrink-0 -ml-[1px] -mr-[8.5px] z-0"
              viewBox="0 0 24 44"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M 0 0 L 24 0 A 27 27 0 0 0 24 44 L 0 44 Z"
                className="fill-neutral-100 dark:fill-neutral-900"
              />
              <path
                d="M 0 0.5 L 24 0.5 A 27 27 0 0 0 24 43.5 L 0 43.5"
                className="stroke-neutral-300/80 dark:stroke-neutral-700/80"
                strokeWidth="1"
                fill="none"
              />
            </svg>
          </div> */}

          {/* Center Detached Circle: Floating with logo and concentric ring */}
          {/* <div className="shrink-0 z-10 flex items-center justify-center">
            <Link
              href="/"
              aria-label="RareUI Home"
              className="group relative h-12 w-12 sm:h-[50px] sm:w-[50px] rounded-full bg-primary shadow-pill-inset flex items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95"
            > */}
              {/* Inner concentric ring matching user sketch */}
              {/* <div className="h-12 w-12 sm:h-12 sm:w-12 flex items-center justify-center">
                <RareLogo size={30} className="h-10 w-10 text-primary" animated={true} topColor='white' middleColor='white' bottomColor='white' eyeColor='white' />
              </div>
            </Link>
          </div> */}

          {/* Right Wing: Curved concave end socket + straight body */}
          {/* <div className="flex-1 flex items-center h-10 min-w-0"> */}
            {/* Concave socket curve hugging the circle closely */}
            {/* <svg
              className="w-6 h-10 shrink-0 -ml-[8.5px] -mr-[1px] z-0"
              viewBox="0 0 24 44"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M 24 0 L 0 0 A 27 27 0 0 1 0 44 L 24 44 Z"
                className="fill-neutral-100 dark:fill-neutral-900"
              />
              <path
                d="M 24 0.5 L 0 0.5 A 27 27 0 0 1 0 43.5 L 24 43.5"
                className="stroke-neutral-300/80 dark:stroke-neutral-700/80"
                strokeWidth="1"
                fill="none"
              />
            </svg> */}

            {/* Straight bar body */}
            {/* <div className="flex-1 h-full rounded-r-lg bg-neutral-100 dark:bg-neutral-900 border-r border-y border-neutral-300/80 dark:border-neutral-700/80" />
          </div>
        </div>
      </div> */}

      {/* Right: Search, Theme Toggle & GitHub Stars Button */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Search Modal Trigger (Rounded Magnifer Icon) */}
        <button
          type="button"
          onClick={() => setOpenSearch(true)}
          aria-label="Search components (⌘K or Ctrl+K)"
          title="Search (⌘K or Ctrl+K)"
          className="flex h-10 w-11 items-center justify-center rounded-lg bg-muted/20 text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-muted/50 hover:text-foreground active:scale-95 cursor-pointer"
        >
          <RoundedMagniferIcon className="h-5 w-5 transition-transform duration-200 hover:scale-110" />
        </button>

        {/* Dark Mode Toggle Icon */}
        <DocThemeToggle />

        {/* GitHub Stars Button (replaces Sponsor button) */}
        <GitHubStarButton size="md" />
      </div>
    </header>
  );
}

export default DocsHeader;
