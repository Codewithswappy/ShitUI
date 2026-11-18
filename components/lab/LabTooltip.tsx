'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface LabTooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  delay?: number;
}

export function LabTooltip({
  content,
  children,
  side = 'top',
  className,
  delay = 140,
}: LabTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [effectiveSide, setEffectiveSide] = useState(side);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculateSmartSide = () => {
    if (!triggerRef.current || typeof window === 'undefined') return side;
    const rect = triggerRef.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    // Check collision on the requested side and screen borders
    let computed = side;

    // If trigger is very close to left edge (like the corner mini area), show on right so text is never cut off!
    if (rect.left < 110) {
      computed = 'right';
    } else if (rect.right > vw - 110) {
      computed = 'left';
    } else if (side === 'top' && rect.top < 60) {
      computed = 'bottom';
    } else if (side === 'bottom' && rect.bottom > vh - 60) {
      computed = 'top';
    }

    return computed;
  };

  const show = (e?: React.PointerEvent | React.FocusEvent) => {
    if (e && 'pointerType' in e && (e as React.PointerEvent).pointerType === 'touch') return;
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return;
    timeoutRef.current = setTimeout(() => {
      setEffectiveSide(calculateSmartSide());
      setIsVisible(true);
    }, delay);
  };

  const hide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getPositionClasses = () => {
    switch (effectiveSide) {
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2.5';
      case 'top':
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };

  const getMotionOffsets = () => {
    switch (effectiveSide) {
      case 'bottom':
        return { initial: { y: -3, x: 0 }, animate: { y: 0, x: 0 } };
      case 'left':
        return { initial: { x: 3, y: 0 }, animate: { x: 0, y: 0 } };
      case 'right':
        return { initial: { x: -3, y: 0 }, animate: { x: 0, y: 0 } };
      case 'top':
      default:
        return { initial: { y: 3, x: 0 }, animate: { y: 0, x: 0 } };
    }
  };

  const getArrowClasses = () => {
    switch (effectiveSide) {
      case 'bottom':
        return '-top-1 left-1/2 -translate-x-1/2';
      case 'left':
        return '-right-0.5 top-1/2 -translate-y-1/2';
      case 'right':
        return '-left-1 top-1/2 -translate-y-1/2';
      case 'top':
      default:
        return '-bottom-1 left-1/2 -translate-x-1/2';
    }
  };

  const offsets = getMotionOffsets();

  return (
    <div
      ref={triggerRef}
      className="relative inline-flex items-center justify-center"
      onPointerEnter={show}
      onPointerLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}

      <AnimatePresence>
        {isVisible && content && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, ...offsets.initial }}
            animate={{ opacity: 1, scale: 1, ...offsets.animate }}
            exit={{ opacity: 0, scale: 0.94, ...offsets.initial }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
            className={cn(
              'pointer-events-none absolute z-50 max-w-[220px] text-center leading-snug rounded-xl px-2.5 py-1 text-[11px] font-normal select-none shadow-[0_4px_20px_rgba(0,0,0,0.18)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.7)] border-0 whitespace-nowrap',
              'bg-neutral-900/95 text-white dark:bg-white/95 dark:text-neutral-900 backdrop-blur-md',
              getPositionClasses(),
              className
            )}
          >
            {content}

            {/* Pointer arrow / caret (Matching Image 5) */}
            <span
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute h-2 w-2 rotate-45 bg-neutral-900/95 dark:bg-white/95',
                getArrowClasses()
              )}
            ></span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
