'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export interface InteractiveContactButtonProps {
  name?: string;
  role?: string;
  email?: string;
  avatarUrl?: string;
  availableForWork?: boolean;
  statusText?: string;
  bookingUrl?: string;
  buttonText?: string;
  buttonHoverText?: string;
  theme?: 'dark' | 'light';
  cardPosition?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  className?: string;
  onBookCall?: () => void;
  onCopyEmail?: (email: string) => void;
}

const springFast = {
  type: 'spring' as const,
  stiffness: 440,
  damping: 28,
  mass: 0.8,
};

const springCard = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 30,
  mass: 0.9,
};

const springStagger = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 26,
};

/** Letter icon for Contact trigger button */
function LetterStreamlineIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <g>
        <path
          fill="currentColor"
          opacity="0.45"
          d="M14.2 3H9.8C5.65164 3 3.57746 3 2.28873 4.31802 1 5.63604 1 7.75736 1 12c0 4.2426 0 6.364 1.28873 7.682C3.57746 21 5.65164 21 9.8 21h4.4c4.1484 0 6.2225 0 7.5113 -1.318C23 18.364 23 16.2426 23 12c0 -4.24264 0 -6.36396 -1.2887 -7.68198C20.4225 3 18.3484 3 14.2 3Z"
        />
        <path
          fill="currentColor"
          d="M19.1284 8.034c0.35 -0.29169 0.3973 -0.81191 0.1056 -1.16194 -0.2917 -0.35002 -0.8119 -0.39732 -1.1619 -0.10563l-2.3748 1.97899c-1.0263 0.85521 -1.7388 1.44708 -2.3403 1.83398 -0.5823 0.3745 -0.9772 0.5002 -1.3568 0.5002 -0.3796 0 -0.7744 -0.1257 -1.3567 -0.5002 -0.6016 -0.3869 -1.31409 -0.97877 -2.34035 -1.83398L5.92837 6.76643c-0.35003 -0.29169 -0.87025 -0.24439 -1.16194 0.10563 -0.29169 0.35003 -0.24439 0.87025 0.10563 1.16194l2.41615 2.0135c0.97499 0.8125 1.76523 1.471 2.4627 1.9196 0.72659 0.4673 1.43409 0.7625 2.24929 0.7625 0.8152 0 1.5228 -0.2952 2.2493 -0.7625 0.6975 -0.4486 1.4877 -1.1071 2.4627 -1.9197l2.4162 -2.0134Z"
        />
      </g>
    </svg>
  );
}

/** Calendar icon for "Book a Call" button */
function CalendarStreamlineIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <g>
        <path
          fill="currentColor"
          opacity="0.45"
          d="M22 14.0001v-2c0 -0.8391 -0.0032 -2.33483 -0.0161 -3.0001H2.00965C1.99674 9.66527 2 11.161 2 12.0001v2c0 3.7712 0 5.6568 1.17158 6.8284 1.17157 1.1716 3.05719 1.1716 6.82841 1.1716H14c3.7713 0 5.6569 0 6.8284 -1.1716C22 19.6569 22 17.7713 22 14.0001Z"
        />
        <path
          fill="currentColor"
          d="M6.94028 2c0.41586 0 0.75298 0.32421 0.75298 0.72414v1.46073c0.66791 -0.01246 1.41657 -0.01246 2.25893 -0.01246h4.01591c0.8423 0 1.591 0 2.2589 0.01246V2.72414c0 -0.39993 0.3371 -0.72414 0.753 -0.72414 0.4158 0 0.753 0.32421 0.753 0.72414v1.5248c1.445 0.11128 2.3937 0.38439 3.0906 1.05465 0.697 0.67026 0.981 1.58257 1.0967 2.97227L22 9H2v-0.72414c0.11571 -1.3897 0.3997 -2.30201 1.09665 -2.97227 0.69696 -0.67026 1.64561 -0.94337 3.09065 -1.05465v-1.5248c0 -0.39993 0.33712 -0.72414 0.75298 -0.72414Z"
        />
        <path
          fill="currentColor"
          d="M18 17c0 0.5523 -0.4477 1 -1 1s-1 -0.4477 -1 -1 0.4477 -1 1 -1 1 0.4477 1 1Z"
        />
        <path
          fill="currentColor"
          d="M18 13c0 0.5523 -0.4477 1 -1 1s-1 -0.4477 -1 -1 0.4477 -1 1 -1 1 0.4477 1 1Z"
        />
        <path
          fill="currentColor"
          d="M13 17c0 0.5523 -0.4477 1 -1 1s-1 -0.4477 -1 -1 0.4477 -1 1 -1 1 0.4477 1 1Z"
        />
        <path
          fill="currentColor"
          d="M13 13c0 0.5523 -0.4477 1 -1 1s-1 -0.4477 -1 -1 0.4477 -1 1 -1 1 0.4477 1 1Z"
        />
        <path
          fill="currentColor"
          d="M8 17c0 0.5523 -0.44772 1 -1 1s-1 -0.4477 -1 -1 0.44772 -1 1 -1 1 0.4477 1 1Z"
        />
        <path
          fill="currentColor"
          d="M8 13c0 0.5523 -0.44772 1 -1 1s-1 -0.4477 -1 -1 0.44772 -1 1 -1 1 0.4477 1 1Z"
        />
      </g>
    </svg>
  );
}

function CheckIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function VerifiedBadge({ className = 'w-5.5 h-5.5' }: { className?: string }) {
  const id = 'solar-verified-3d';
  const pathD =
    'M9.59236 3.20031c-0.2435 0.20751 -0.36526 0.31127 -0.4953 0.39843 -0.2981 0.1998 -0.63289 0.33847 -0.98496 0.40798 -0.15359 0.03033 -0.31307 0.04305 -0.63202 0.0685 -0.80138 0.06395 -1.20208 0.09593 -1.53637 0.21401 -0.7732 0.2731 -1.38138 0.88128 -1.65448 1.65448 -0.11808 0.33429 -0.15005 0.73498 -0.214 1.53636 -0.02545 0.31895 -0.03818 0.47844 -0.06851 0.63203 -0.06951 0.35207 -0.20818 0.68686 -0.40798 0.98496 -0.08716 0.13004 -0.19093 0.25181 -0.39846 0.49533 -0.52144 0.61191 -0.78218 0.91781 -0.93506 1.23771 -0.35363 0.7399 -0.35363 1.5999 0 2.3398 0.15289 0.3199 0.41361 0.6258 0.93505 1.2377 0.20749 0.2435 0.31132 0.3653 0.39847 0.4953 0.1998 0.2981 0.33847 0.6329 0.40798 0.985 0.03033 0.1536 0.04305 0.3131 0.0685 0.632 0.06395 0.8014 0.09593 1.2021 0.21401 1.5364 0.2731 0.7732 0.88128 1.3814 1.65448 1.6545 0.33428 0.118 0.73496 0.15 1.53629 0.214 0.31895 0.0254 0.47851 0.0382 0.6321 0.0685 0.35207 0.0695 0.68686 0.2082 0.98496 0.408 0.13005 0.0871 0.25181 0.1909 0.49534 0.3984 0.6119 0.5215 0.9178 0.7822 1.2377 0.9351 0.7399 0.3536 1.5999 0.3536 2.3398 0 0.3199 -0.1529 0.6258 -0.4136 1.2377 -0.9351 0.2435 -0.2075 0.3653 -0.3113 0.4953 -0.3984 0.2981 -0.1998 0.6329 -0.3385 0.985 -0.408 0.1536 -0.0303 0.3131 -0.0431 0.632 -0.0685 0.8013 -0.064 1.2021 -0.096 1.5364 -0.214 0.7732 -0.2731 1.3814 -0.8813 1.6545 -1.6545 0.118 -0.3343 0.15 -0.735 0.214 -1.5363 0.0254 -0.3189 0.0382 -0.4785 0.0685 -0.6321 0.0695 -0.3521 0.2082 -0.6869 0.408 -0.985 0.0871 -0.13 0.1909 -0.2518 0.3984 -0.4953 0.5215 -0.6119 0.7822 -0.9178 0.9351 -1.2377 0.3536 -0.7399 0.3536 -1.5999 0 -2.3398 -0.1529 -0.3199 -0.4136 -0.6258 -0.9351 -1.2377 -0.2075 -0.24353 -0.3113 -0.36529 -0.3984 -0.49534 -0.1998 -0.2981 -0.3385 -0.63289 -0.408 -0.98496 -0.0303 -0.15359 -0.0431 -0.31307 -0.0685 -0.63202 -0.064 -0.80133 -0.096 -1.20209 -0.214 -1.53637 -0.2731 -0.7732 -0.8813 -1.38138 -1.6545 -1.65448 -0.3343 -0.11808 -0.735 -0.15005 -1.5364 -0.214 -0.3189 -0.02545 -0.4784 -0.03818 -0.632 -0.06851 -0.3521 -0.06951 -0.6869 -0.20818 -0.985 -0.40798 -0.13 -0.08716 -0.2518 -0.19093 -0.4953 -0.39847 -0.6119 -0.52144 -0.9178 -0.78216 -1.2377 -0.93505 -0.7399 -0.35363 -1.5999 -0.35363 -2.3398 0 -0.3199 0.15288 -0.6258 0.41365 -1.23774 0.93509Z';

  const checkD =
    'M16.3736 9.86298c0.3178 -0.31783 0.3178 -0.83314 0 -1.15097 -0.3179 -0.31784 -0.8332 -0.31784 -1.151 0l-4.8503 4.85029 -1.59477 -1.5949c-0.31783 -0.3178 -0.83314 -0.3178 -1.15097 0 -0.31783 0.3179 -0.31783 0.8332 0 1.151l2.17029 2.1703c0.31785 0.3178 0.83315 0.3178 1.15095 0l5.4258 -5.42572Z';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Clip strictly to the rosette perimeter so ZERO effect can ever appear outside */}
        <clipPath id={`${id}-clip`}>
          <path d={pathD} />
        </clipPath>

        {/* 3D Directional Face: bright top gold -> deep rich bottom amber */}
        <linearGradient id={`${id}-face`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="40%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* 100% Inside-Only Inset Rim Bevel */}
        <linearGradient id={`${id}-inner-bevel`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.75)" />
          <stop offset="50%" stopColor="rgba(245, 158, 11, 0.2)" />
          <stop offset="100%" stopColor="rgba(120, 53, 15, 0.55)" />
        </linearGradient>

        {/* Pure Inside Inset Shadow (Confined strictly inside the silhouette) */}
        <filter id={`${id}-inset`} x="-10%" y="-10%" width="120%" height="120%">
          <feOffset dx="0" dy="0.7" />
          <feGaussianBlur stdDeviation="0.4" result="blur" />
          <feComposite operator="out" in="SourceGraphic" in2="blur" result="inverse" />
          <feFlood floodColor="#78350F" floodOpacity="0.4" result="color" />
          <feComposite operator="in" in="color" in2="inverse" result="shadow" />
          <feComposite operator="over" in="shadow" in2="SourceGraphic" />
        </filter>
      </defs>

      {/* Main Base Silhouette (Exact path bounds) */}
      <path d={pathD} fill={`url(#${id}-face)`} />

      {/* Group clipped strictly to the rosette path: Absolutely ZERO outside bleed */}
      <g clipPath={`url(#${id}-clip)`}>
        {/* Inside-only inset shadow overlay */}
        <path d={pathD} fill="none" filter={`url(#${id}-inset)`} />

        {/* Inside-only beveled rim stroke (outer half clipped off by clipPath) */}
        <path d={pathD} fill="none" stroke={`url(#${id}-inner-bevel)`} strokeWidth="1.2" />

        {/* Checkmark inner carved shadow */}
        <path d={checkD} fill="rgba(120, 53, 15, 0.45)" transform="translate(0, 0.55)" />

        {/* Checkmark pure crisp white face */}
        <path d={checkD} fill="#FFFFFF" />
      </g>
    </svg>
  );
}

// ============================================================================
// Vaporizing Email Component: Left-to-Right Dissolve and Condensation Effect
// ============================================================================

function VaporizingEmail({
  email,
  copied,
  onClick,
  theme,
}: {
  email: string;
  copied: boolean;
  onClick: (e: React.MouseEvent) => void;
  theme: 'dark' | 'light';
}) {
  const displayEmail = email.toUpperCase();
  const emailChars = displayEmail.split('');
  const copiedChars = 'Copied to clipboard!'.split('');

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex min-h-[38px] w-full cursor-pointer items-center justify-center overflow-visible border-none bg-transparent p-0 text-center outline-none select-none"
      title="Click to copy email"
      aria-label={copied ? 'Copied to clipboard' : `Copy email ${email}`}
    >
      <AnimatePresence mode="wait">
        {!copied ? (
          <motion.span
            key="email-text"
            className="flex items-center justify-center text-[20px] font-semibold tracking-tight whitespace-nowrap text-neutral-200 uppercase transition-colors duration-200 sm:text-[22px]"
          >
            {emailChars.map((char, i) => (
              <motion.span
                key={`email-${char}-${i}`}
                initial={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{
                  opacity: 0,
                  y: -14,
                  filter: 'blur(8px)',
                  scale: 1.2,
                  transition: {
                    delay: i * 0.016,
                    duration: 0.22,
                    ease: 'easeOut',
                  },
                }}
                className={cn(
                  'inline-block text-neutral-300 transition-colors group-hover:text-neutral-400 dark:group-hover:text-neutral-50',
                  char === ' ' ? 'w-1.5' : ''
                )}
              >
                {char}
              </motion.span>
            ))}
          </motion.span>
        ) : (
          <motion.span
            key="copied-text"
            className="flex items-center justify-center text-[9px] font-medium tracking-widest whitespace-nowrap text-emerald-500 uppercase sm:text-[10px] dark:text-emerald-400"
          >
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25, delay: 0.04 }}
              className="mr-1 inline-flex"
            >
              <CheckIcon className="h-3 w-3" />
            </motion.span>
            {copiedChars.map((char, i) => (
              <motion.span
                key={`copied-${char}-${i}`}
                initial={{
                  opacity: 0,
                  y: 6,
                  filter: 'blur(5px)',
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -6,
                  filter: 'blur(5px)',
                  scale: 1.08,
                  transition: {
                    delay: i * 0.01,
                    duration: 0.16,
                  },
                }}
                transition={{
                  delay: 0.03 + i * 0.014,
                  duration: 0.2,
                  ease: 'easeOut',
                }}
                className={cn('inline-block', char === ' ' ? 'w-1' : '')}
              >
                {char}
              </motion.span>
            ))}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export default function InteractiveContactButton({
  name = 'Swapnil Kalambe',
  role = 'Web Designer & Founder',
  email = 'heyyswap@gmail.com',
  avatarUrl = 'https://images.unsplash.com/photo-1728577740843-5f29c7586afe?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  availableForWork = true,
  statusText = 'Available for work',
  bookingUrl = 'https://cal.com',
  buttonText = 'Contact',
  buttonHoverText = "Let's Talk",
  theme = 'dark',
  cardPosition = 'bottom-right',
  className = '',
  onBookCall,
  onCopyEmail,
}: InteractiveContactButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const copyTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isVisible = isOpen || isHovered;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  // Dismiss on outside click or Escape key
  useEffect(() => {
    if (!isVisible) return;

    const onPointerDownOutside = (e: PointerEvent | MouseEvent) => {
      if (
        containerRef.current &&
        e.target instanceof Node &&
        !containerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
        setIsHovered(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsHovered(false);
      }
    };

    window.addEventListener('pointerdown', onPointerDownOutside);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDownOutside);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isVisible]);

  // Smooth hover bridge
  const handleMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    leaveTimerRef.current = setTimeout(() => {
      setIsHovered(false);
      leaveTimerRef.current = null;
    }, 180);
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopied(true);
    onCopyEmail?.(email);

    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => {
      setCopied(false);
    }, 2400);
  };

  const handleBookClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBookCall) {
      onBookCall();
      return;
    }
    if (bookingUrl) {
      window.open(bookingUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Card Positioning
  const positionClasses = {
    'bottom-right': 'top-[calc(100%+12px)] right-0 origin-top-right',
    'bottom-left': 'top-[calc(100%+12px)] left-0 origin-top-left',
    'bottom-center': 'top-[calc(100%+12px)] left-1/2 -translate-x-1/2 origin-top',
  }[cardPosition];

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn('relative inline-block select-none', className)}
    >
      <motion.button
        type="button"
        onClick={handleToggle}
        whileHover={{ scale: 1.035, y: -1 }}
        whileTap={{ scale: 0.97 }}
        transition={springFast}
        aria-expanded={isVisible}
        aria-haspopup="dialog"
        className={cn(
          'relative flex h-[46px] cursor-pointer items-center justify-between overflow-hidden rounded-full border px-5 backdrop-blur-xl transition-all duration-200 outline-none',
          theme === 'dark'
            ? isVisible
              ? 'border-neutral-100 bg-neutral-50 text-neutral-950 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.9)]'
              : 'border-neutral-700/60 bg-[#141417]/95 text-neutral-200 shadow-[0_4px_14px_-2px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.12)] hover:border-neutral-600 hover:bg-[#1c1c21] hover:text-neutral-50 hover:shadow-[0_8px_22px_-2px_rgba(0,0,0,0.5),inset_0_1px_1.5px_rgba(255,255,255,0.2)]'
            : isVisible
              ? 'border-neutral-950 bg-neutral-950 text-neutral-50 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.22),inset_0_1px_1px_rgba(255,255,255,0.18)]'
              : 'border-neutral-200/90 bg-neutral-50/95 text-neutral-900 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.95)] hover:border-neutral-300 hover:bg-white hover:shadow-[0_6px_18px_-2px_rgba(0,0,0,0.1),inset_0_1px_1.5px_rgba(255,255,255,1)]'
        )}
      >
        <div className="flex items-center gap-2.5">
          {/* Letter Icon with subtle spring hover reaction */}
          <motion.div
            animate={{
              scale: isVisible ? 1.1 : 1,
              rotate: isVisible ? -4 : 0,
            }}
            transition={springFast}
            className="flex flex-none items-center justify-center"
          >
            <LetterStreamlineIcon className="h-4 w-4" />
          </motion.div>

          {/* Vertical Rolling Text Swap (Centered, zero cutoff) */}
          <div className="relative flex h-5 min-w-[76px] items-center overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={isVisible ? 'open' : 'idle'}
                initial={{ y: isVisible ? 16 : -16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: isVisible ? -16 : 16, opacity: 0 }}
                transition={springFast}
                className="text-xs font-semibold tracking-wider whitespace-nowrap uppercase"
              >
                {isVisible ? buttonHoverText : buttonText}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="contact-floating-card"
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={springCard}
            role="dialog"
            aria-label={`Contact ${name}`}
            className={cn(
              "absolute z-50 w-[330px] max-w-[calc(100vw-32px)] rounded-[26px] border p-4 backdrop-blur-2xl transition-colors duration-300 before:absolute before:-top-3 before:right-0 before:left-0 before:h-3 before:content-[''] sm:p-4.5",
              theme === 'dark'
                ? 'border-neutral-50/10 bg-[#131316]/96 text-neutral-50 shadow-[0_16px_36px_-10px_rgba(0,0,0,0.45),0_2px_8px_rgba(0,0,0,0.25),inset_0_1px_0_0_rgba(250,250,250,0.08)]'
                : 'border-neutral-200/90 bg-neutral-50/98 text-neutral-950 shadow-[0_14px_34px_-10px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.02),inset_0_1px_0_0_rgba(250,250,250,0.9)]',
              positionClasses
            )}
          >
            {/* Top Row: Avatar on Left, Details on Right (overflow-visible to prevent clipping) */}
            <div className="flex items-start justify-between gap-3.5 overflow-visible">
              {/* Avatar + Verified Badge Group (scales together with matching elevation) */}
              <motion.div
                initial={{ opacity: 0, x: -35 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: 0.04, ...springStagger }}
                whileHover={{ scale: 1.04 }}
                className="relative flex-none cursor-pointer"
              >
                {/* Avatar Squircle */}
                <div
                  className={cn(
                    'h-[76px] w-[76px] overflow-hidden rounded-2xl shadow-md ring-1 shadow-black/10 ring-black/10 dark:ring-neutral-50/10',
                    theme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-100'
                  )}
                >
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="pointer-events-none h-full w-full object-cover select-none"
                    loading="lazy"
                  />
                </div>

                {/* 3D Inset Verified Medallion Badge (Crisp 3D relief, no glow) */}
                <div className="pointer-events-none absolute -right-2 -bottom-1 z-10 select-none">
                  <VerifiedBadge className="h-6 w-6" />
                </div>
              </motion.div>

              {/* Profile Details: Flies in from RIGHT with Right-Aligned Book Call Button */}
              <motion.div
                initial={{ opacity: 0, x: 35 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.07, ...springStagger }}
                className="flex min-w-0 flex-1 flex-col pt-0.5"
              >
                {/* Live Status Indicator */}
                {availableForWork && (
                  <div className="mb-0.5 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ff332] opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4ff332]" />
                    </span>
                    <span className="text-[11px] font-normal tracking-tight text-[#4ff332]">
                      {statusText}
                    </span>
                  </div>
                )}

                {/* Name */}
                <h3 className="truncate text-[18px] leading-tight font-medium tracking-tight">
                  {name}
                </h3>

                {/* Role */}
                <p
                  className={cn(
                    'mt-0.5 mb-2 truncate text-xs font-normal tracking-tight',
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                  )}
                >
                  {role}
                </p>

                {/* Book a Call Button: #2391FF with inside-only inset glow & Right Aligned */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04, rotate: -1 }}
                  whileTap={{ scale: 0.96 }}
                  transition={springFast}
                  onClick={handleBookClick}
                  className="mt-auto ml-auto flex w-fit cursor-pointer items-center justify-center gap-1.5 self-end rounded-full bg-[#2391FF] px-3 py-2 text-xs font-medium tracking-tight text-neutral-50 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.45)] transition-all hover:bg-[#1a82ee]"
                >
                  <CalendarStreamlineIcon className="h-4 w-4" />
                  <span>Book a call</span>
                </motion.button>
              </motion.div>
            </div>

            {/* Bottom Row: Centered Big Email with generous spacing, without Divider */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ delay: 0.1, ...springStagger }}
              className="mt-1 flex w-full items-center justify-center overflow-visible pt-5 pb-1"
            >
              <VaporizingEmail
                email={email}
                copied={copied}
                onClick={handleCopyEmail}
                theme={theme}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { InteractiveContactButton as ContactCardButton };
