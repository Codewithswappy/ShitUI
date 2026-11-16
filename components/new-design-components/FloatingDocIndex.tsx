'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Link } from 'next-view-transitions';
import { cn } from '@/lib/utils';
import { usePreviewStage } from './preview-context';

// Double Alt Arrow Left Streamline Solar Icon
function PrevArrowIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      id="Double-Alt-Arrow-Left--Streamline-Solar"
      className={className}
    >
      <g id="Bold Duotone/Arrows/Double Alt Arrow Left">
        <path
          id="Vector"
          opacity="0.32"
          fill="currentColor"
          d="M17.75 19c0 0.3139 -0.1954 0.5946 -0.4898 0.7035 -0.2944 0.1088 -0.6254 0.0229 -0.8296 -0.2154l-6 -7c-0.2408 -0.2808 -0.2408 -0.6953 0 -0.9762l6 -6.99996c0.2042 -0.2383 0.5352 -0.32421 0.8296 -0.21532 0.2944 0.10889 0.4898 0.38956 0.4898 0.70342V19Z"
          strokeWidth="1"
        />
        <path
          id="Vector_2"
          fill="currentColor"
          fillRule="evenodd"
          d="M13.4881 19.5695c0.3145 -0.2696 0.3509 -0.7431 0.0813 -1.0576L7.98781 12l5.58159 -6.51189c0.2696 -0.3145 0.2332 -0.78797 -0.0813 -1.05754s-0.788 -0.23314 -1.0575 0.08135L6.43056 11.5119c-0.24075 0.2809 -0.24075 0.6953 0 0.9762l6.00004 7c0.2695 0.3145 0.743 0.3509 1.0575 0.0814Z"
          clipRule="evenodd"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
}

// Double Alt Arrow Right Streamline Solar Icon
function NextArrowIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      id="Double-Alt-Arrow-Right--Streamline-Solar"
      className={className}
    >
      <g id="Bold Duotone/Arrows/Double Alt Arrow Right">
        <path
          id="Vector"
          opacity="0.32"
          fill="currentColor"
          d="M6.25 19c0 0.3139 0.19543 0.5946 0.48979 0.7035 0.29436 0.1088 0.6254 0.0229 0.82965 -0.2154l5.99996 -7c0.2408 -0.2808 0.2408 -0.6953 0 -0.9762L7.56944 4.51194c-0.20425 -0.2383 -0.53529 -0.32421 -0.82965 -0.21532 -0.29436 0.10889 -0.48979 0.38956 -0.48979 0.70342V19Z"
          strokeWidth="1"
        />
        <path
          id="Vector_2"
          fill="currentColor"
          fillRule="evenodd"
          d="M10.5119 19.5695c-0.3145 -0.2696 -0.3509 -0.7431 -0.0813 -1.0576L16.0122 12l-5.5816 -6.51189c-0.2696 -0.3145 -0.2332 -0.78797 0.0813 -1.05754s0.788 -0.23314 1.0576 0.08135l6 6.99998c0.2407 0.2809 0.2407 0.6953 0 0.9762l-6 7c-0.2696 0.3145 -0.7431 0.3509 -1.0576 0.0814Z"
          clipRule="evenodd"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
}

// Scale Streamline Solar Icon (used when FloatingDoc is closed / Preview mode)
function ScaleIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      id="Scale--Streamline-Solar"
      className={className}
    >
      <g id="Bold Duotone/Arrows Action/Scale">
        <path
          id="Vector"
          opacity="0.32"
          fill="currentColor"
          d="M2 12c0 -4.71405 0 -7.07107 1.46447 -8.53553C4.92893 2 7.28595 2 12 2c4.714 0 7.0711 0 8.5355 1.46447C22 4.92893 22 7.28595 22 12c0 4.714 0 7.0711 -1.4645 8.5355C19.0711 22 16.714 22 12 22c-4.71405 0 -7.07107 0 -8.53553 -1.4645C2 19.0711 2 16.714 2 12Z"
          strokeWidth="1"
        />
        <path
          id="Vector_2"
          fill="currentColor"
          fillRule="evenodd"
          d="M16.6562 2.75c-0.4142 0 -0.75 -0.33579 -0.75 -0.75s0.3358 -0.75 0.75 -0.75H22c0.4142 0 0.75 0.33579 0.75 0.75v5.34375c0 0.41421 -0.3358 0.75 -0.75 0.75s-0.75 -0.33579 -0.75 -0.75V3.81066L13.8107 11.25H16c0.4142 0 0.75 0.3358 0.75 0.75s-0.3358 0.75 -0.75 0.75h-4c-0.4142 0 -0.75 -0.3358 -0.75 -0.75V8c0 -0.41421 0.3358 -0.75 0.75 -0.75s0.75 0.33579 0.75 0.75v2.1893L20.1893 2.75h-3.5331Z"
          clipRule="evenodd"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
}

// Notification Lines Remove Streamline Solar Icon (used when FloatingDoc is open / to close docs)
function NotificationLinesRemoveIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      id="Notification-Lines-Remove--Streamline-Solar"
      className={className}
    >
      <g id="Bold Duotone/Notifications/Notification Lines Remove">
        <path
          id="Vector"
          opacity="0.32"
          fill="currentColor"
          d="M20.5355 20.5355C22 19.0711 22 16.714 22 12c0 -1.358 0 -2.52044 -0.035 -3.52226 -0.0581 0.88429 -0.2127 1.45198 -0.624 1.86326C20.682 11 19.6213 11 17.5 11s-3.182 0 -3.841 -0.659C13 9.68198 13 8.62132 13 6.5s0 -3.18198 0.659 -3.84099c0.4113 -0.41127 0.979 -0.56588 1.8633 -0.624C14.5204 2 13.358 2 12 2 7.28595 2 4.92893 2 3.46447 3.46447 2 4.92893 2 7.28595 2 12c0 4.714 0 7.0711 1.46447 8.5355C4.92893 22 7.28595 22 12 22c4.714 0 7.0711 0 8.5355 -1.4645Z"
          strokeWidth="1"
        />
        <path
          id="Vector_2"
          fill="currentColor"
          d="M7 13.25c-0.41421 0 -0.75 0.3358 -0.75 0.75s0.33579 0.75 0.75 0.75h4c0.4142 0 0.75 -0.3358 0.75 -0.75s-0.3358 -0.75 -0.75 -0.75H7Z"
          strokeWidth="1"
        />
        <path
          id="Vector_3"
          fill="currentColor"
          d="M7 16.75c-0.41421 0 -0.75 0.3358 -0.75 0.75s0.33579 0.75 0.75 0.75h6c0.4142 0 0.75 -0.3358 0.75 -0.75s-0.3358 -0.75 -0.75 -0.75H7Z"
          strokeWidth="1"
        />
        <path
          id="Vector_4"
          fill="currentColor"
          fillRule="evenodd"
          d="M17.5 11c-2.1213 0 -3.182 0 -3.841 -0.659C13 9.68198 13 8.62132 13 6.5s0 -3.18198 0.659 -3.84099C14.318 2 15.3787 2 17.5 2s3.182 0 3.841 0.65901C22 3.31802 22 4.37868 22 6.5s0 3.18198 -0.659 3.841C20.682 11 19.6213 11 17.5 11Zm-2.5303 -7.03033c0.2929 -0.29289 0.7677 -0.29289 1.0606 0L17.5 5.43934l1.4697 -1.46967c0.2929 -0.29289 0.7677 -0.29289 1.0606 0 0.2929 0.29289 0.2929 0.76777 0 1.06066L18.5607 6.5l1.4696 1.46967c0.2929 0.29289 0.2929 0.76777 0 1.06066s-0.7677 0.29289 -1.0606 0L17.5 7.56066l-1.4697 1.46967c-0.2929 0.29289 -0.7677 0.29289 -1.0606 0 -0.2929 -0.29289 -0.2929 -0.76777 0 -1.06066L16.4393 6.5l-1.4696 -1.46967c-0.2929 -0.29289 -0.2929 -0.76777 0 -1.06066Z"
          clipRule="evenodd"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
}

export interface FloatingDocIndexProps {
  alwaysDocs?: boolean;
  className?: string;
  prevPage?: { url: string; title: string };
  nextPage?: { url: string; title: string };
}

export function FloatingDocIndex({
  alwaysDocs = false,
  className,
  prevPage,
  nextPage,
}: FloatingDocIndexProps) {
  const { isInfoOpen, setIsInfoOpen, setIsCodeOpen } = usePreviewStage();
  const isDocMode = alwaysDocs || isInfoOpen;
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [percent, setPercent] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const CLOSED_WIDTH_DOCS = alwaysDocs ? 152 : 184;
  const CLOSED_WIDTH_PREVIEW = 146;
  const OPEN_WIDTH = 280;

  // Extract article headings with selector fallback and dynamic retry
  const extractHeadings = useCallback(() => {
    const selector = [
      '#docs-scroll-container h2',
      '#docs-scroll-container h3',
      '#main-blog-content h2',
      '#main-blog-content h3',
      'article h2',
      'article h3',
      '#installation',
      '#how-to-use',
      '#props',
      '#contact',
    ].join(', ');

    const rawElements = Array.from(document.querySelectorAll(selector));
    const seenIds = new Set<string>();
    const elements: { id: string; text: string; level: number }[] = [];

    rawElements.forEach((elem, index) => {
      if (!elem.id) {
        const slug = (elem.textContent || '')
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
        elem.id = slug || `heading-${index}`;
      }

      if (seenIds.has(elem.id)) return;
      seenIds.add(elem.id);

      const text = (elem.textContent || '').trim();
      const lower = text.toLowerCase();
      if (
        text.length > 0 &&
        !lower.includes('written by') &&
        !lower.includes('author')
      ) {
        const tagName = elem.tagName.toUpperCase();
        const level = tagName.startsWith('H') ? Number(tagName.substring(1)) : 2;
        elements.push({
          id: elem.id,
          text,
          level: isNaN(level) ? 2 : level,
        });
      }
    });

    if (elements.length > 0) {
      setHeadings((prev) => {
        if (
          prev.length === elements.length &&
          prev.every((p, i) => p.id === elements[i].id && p.text === elements[i].text)
        ) {
          return prev;
        }
        return elements;
      });
      setActiveId((prev) => (elements.some((e) => e.id === prev) ? prev : elements[0].id));
    }
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Extract article headings when info mode is active or path changes with MutationObserver
  useEffect(() => {
    if (!isDocMode) {
      setIsOpen(false);
      return;
    }

    extractHeadings();
    const t1 = setTimeout(extractHeadings, 100);
    const t2 = setTimeout(extractHeadings, 250);
    const t3 = setTimeout(extractHeadings, 500);
    const t4 = setTimeout(extractHeadings, 900);
    const t5 = setTimeout(extractHeadings, 1500);

    const observer = new MutationObserver(() => {
      extractHeadings();
    });

    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      observer.disconnect();
    };
  }, [isDocMode, pathname, extractHeadings]);

  // Scroll tracking (both container and window scroll support with capture and dynamic attach)
  useEffect(() => {
    if (!isDocMode) return;

    let attachedContainer: HTMLElement | null = null;

    const handleScroll = () => {
      const container = document.getElementById('docs-scroll-container');
      const article = document.getElementById('main-blog-content');

      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container;
        const maxScroll = scrollHeight - clientHeight;
        if (maxScroll > 0) {
          const p = Math.min(100, Math.max(0, Math.round((scrollTop / maxScroll) * 100)));
          setPercent(p);
        } else {
          setPercent(100);
        }

        const containerRect = container.getBoundingClientRect();
        const spyOffset = 160;
        let currentActiveId = '';
        for (const heading of headings) {
          const el = document.getElementById(heading.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            const relTop = rect.top - containerRect.top;
            if (relTop < spyOffset) {
              currentActiveId = heading.id;
            }
          }
        }
        if (currentActiveId) {
          setActiveId(currentActiveId);
        }
      } else if (article) {
        const rect = article.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const absoluteTop = rect.top + scrollTop;
        const totalHeight = rect.height;
        const viewportHeight = window.innerHeight;
        const start = absoluteTop;
        const end = absoluteTop + totalHeight - viewportHeight;

        if (end > start) {
          let p = (scrollTop - start) / (end - start);
          if (p < 0) p = 0;
          if (p > 1) p = 1;
          setPercent(Math.round(p * 100));
        } else {
          setPercent(100);
        }

        const spyOffset = 160;
        let currentActiveId = '';
        for (const heading of headings) {
          const el = document.getElementById(heading.id);
          if (el) {
            const r = el.getBoundingClientRect();
            if (r.top < spyOffset) {
              currentActiveId = heading.id;
            }
          }
        }
        if (currentActiveId) {
          setActiveId(currentActiveId);
        }
      }
    };

    const attachContainer = () => {
      const container = document.getElementById('docs-scroll-container');
      if (container && container !== attachedContainer) {
        if (attachedContainer) {
          attachedContainer.removeEventListener('scroll', handleScroll);
        }
        attachedContainer = container;
        container.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
      }
    };

    attachContainer();
    const interval = setInterval(attachContainer, 250);

    // Also listen on window with capture to intercept nested scroll containers
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    handleScroll();

    return () => {
      clearInterval(interval);
      if (attachedContainer) {
        attachedContainer.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isDocMode, headings]);

  // Sync selectedIndex with activeId ONLY when menu opens
  useEffect(() => {
    if (isOpen) {
      setHoveredIndex(null);
      if (activeId) {
        const index = headings.findIndex((h) => h.id === activeId);
        if (index !== -1) setSelectedIndex(index);
        else setSelectedIndex(0);
      }
    }
  }, [isOpen]);

  // Keyboard Navigation inside open index
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = (prev + 1) % headings.length;
          scrollToItem(next);
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = (prev - 1 + headings.length) % headings.length;
          scrollToItem(next);
          return next;
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const heading = headings[selectedIndex];
        if (heading) scrollToHeading(heading.id);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    const scrollToItem = (index: number) => {
      const item = document.getElementById(`toc-item-${index}`);
      if (item) {
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, headings, selectedIndex]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    const container = document.getElementById('docs-scroll-container');

    if (element && container) {
      setIsOpen(false);
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const targetScroll = container.scrollTop + (elementRect.top - containerRect.top) - 24;
      container.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });
    } else if (element) {
      setIsOpen(false);
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  const toggleIndex = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!isDocMode) {
      setIsInfoOpen(true);
      return;
    }
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      extractHeadings();
    }
  };

  const radius = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  const currentWidth = isOpen
    ? OPEN_WIDTH
    : isDocMode
      ? CLOSED_WIDTH_DOCS
      : CLOSED_WIDTH_PREVIEW;

  const pillContent = (
    <div
      id="floating-doc-nav-container"
      className={cn(
        'fixed bottom-4 md:bottom-3 left-1/2 -translate-x-1/2 z-50 pointer-events-auto flex items-end justify-center gap-2 select-none',
        className
      )}
    >
      {/* 1. Previous Component Button (Circular) */}
      {prevPage ? (
        <Link
          href={prevPage.url}
          title={`Previous: ${prevPage.title}`}
          aria-label={`Previous: ${prevPage.title}`}
          className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[#3f80ff] text-white shadow-pill-glow border border-white/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <PrevArrowIcon className="h-4 w-4 text-white shrink-0" />
        </Link>
      ) : (
        <div
          className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[#3f80ff]/40 text-white/40 shadow-pill-glow border border-white/10 cursor-not-allowed pointer-events-none"
          aria-hidden="true"
        >
          <PrevArrowIcon className="h-4 w-4 shrink-0 opacity-40" />
        </div>
      )}

      {/* 2. Center Component Info Pill (Rounded Full) */}
      <motion.div
        ref={containerRef}
        initial={false}
        layout
        animate={{
          width: currentWidth,
          height: isOpen ? 'auto' : 44,
        }}
        transition={{
          type: 'spring',
          stiffness: 420,
          damping: 32,
          mass: 0.85,
        }}
        style={{ willChange: 'width, height' }}
        className={cn(
          'relative bg-[#3f80ff] text-white shadow-pill-glow border border-white/20 flex flex-col origin-bottom cursor-pointer overflow-hidden',
          isOpen ? 'rounded-2xl' : 'rounded-full'
        )}
        onClick={!isDocMode ? () => setIsInfoOpen(true) : undefined}
      >
        {/* Content Container */}
        <div className="relative z-10 w-full">
          {/* Header / Trigger */}
          <div
            id="trigger-component-info"
            onClick={toggleIndex}
            className="flex items-center justify-between px-3.5 cursor-pointer h-[44px] shrink-0 w-full"
          >
            {isDocMode ? (
              /* State A: Info/Doc Mode Active -> Circular Progress + Index Label + Chevron + % + NotificationLinesRemoveIcon */
              <>
                <div className="flex items-center gap-2 whitespace-nowrap min-w-0">
                  {/* Progress Circle */}
                  <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90 overflow-visible">
                      <circle
                        cx="10"
                        cy="10"
                        r={radius}
                        stroke="rgba(255, 255, 255, 0.25)"
                        strokeWidth="2.5"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="10"
                        cy="10"
                        r={radius}
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        fill="transparent"
                        strokeDasharray={circumference}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 0.2 }}
                        className="text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.9)]"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  {/* Text: Index + Chevron */}
                  <div className="flex items-center gap-1 text-xs font-semibold text-white transition-colors overflow-hidden">
                    <span className="tracking-tight font-sans truncate text-white">Index</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                    >
                      <ChevronDown className="w-3.5 h-3.5 text-white/80 ml-0.5" />
                    </motion.div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Percentage Pill */}
                  <div className="bg-transparent min-w-[34px] flex justify-center items-center">
                    <span className="text-[10px] font-semibold text-white font-mono">
                      {percent}%
                    </span>
                  </div>

                  {/* Switch Back to Preview Button: NotificationLinesRemoveIcon */}
                  {!alwaysDocs && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsInfoOpen(false);
                        setIsCodeOpen(false);
                        setIsOpen(false);
                      }}
                      title="Back to Preview"
                      aria-label="Back to Preview"
                      className="flex h-7 w-7 items-center justify-center rounded-full text-white bg-white/20 hover:bg-white/30 transition-colors active:scale-95 cursor-pointer shrink-0"
                    >
                      <NotificationLinesRemoveIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* State B: Preview Mode Active -> ScaleIcon and text Component Info */
              <div className="flex items-center justify-center gap-2 whitespace-nowrap w-full px-2">
                <ScaleIcon className="h-4 w-4 text-white shrink-0" />
                <span className="text-xs font-semibold text-white tracking-tight">
                  Component Info
                </span>
              </div>
            )}
          </div>

          {/* Content List Dropdown (Headings Table of Contents) */}
          <AnimatePresence>
            {isOpen && isDocMode && (
              <motion.div
                initial={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
                transition={{
                  duration: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-full border-t border-white/20 bg-[#3f80ff]"
              >
                <div
                  ref={listRef}
                  className="p-2 pt-2 max-h-[350px] overflow-y-auto overscroll-contain scrollbar-none"
                  onWheel={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                >
                  {headings.length > 0 ? (
                    <motion.ul
                      className="flex flex-col gap-0.5"
                      onMouseLeave={() => setHoveredIndex(null)}
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.02,
                            delayChildren: 0.03,
                          },
                        },
                      }}
                    >
                      {headings.map((heading, index) => {
                        const isActive = activeId === heading.id;
                        const isHighlighted =
                          hoveredIndex !== null ? hoveredIndex === index : selectedIndex === index;

                        return (
                          <motion.li
                            id={`toc-item-${index}`}
                            variants={{
                              hidden: { opacity: 0, x: -6 },
                              visible: {
                                opacity: 1,
                                x: 0,
                                transition: {
                                  type: 'spring',
                                  stiffness: 420,
                                  damping: 30,
                                },
                              },
                            }}
                            key={heading.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              scrollToHeading(heading.id);
                            }}
                            onMouseEnter={() => {
                              setHoveredIndex(index);
                              setSelectedIndex(index);
                            }}
                            className="relative isolate px-3 py-2 rounded-md cursor-pointer transition-colors duration-150 group flex items-start gap-2.5"
                          >
                            {/* Liquid Hover/Selection Background */}
                            {isHighlighted && (
                              <motion.div
                                layoutId="hover-background"
                                className="absolute inset-0 bg-white/20 rounded-md pointer-events-none"
                                initial={false}
                                transition={{
                                  type: 'spring',
                                  stiffness: 500,
                                  damping: 32,
                                }}
                              />
                            )}

                            <div className="relative z-10 mt-1 shrink-0 w-1.5 h-1.5 flex items-center justify-center">
                              {isActive && (
                                <motion.div
                                  layoutId="active-dot"
                                  className="absolute rounded-full w-2 h-2 bg-white drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]"
                                  transition={{
                                    type: 'spring',
                                    stiffness: 500,
                                    damping: 35,
                                  }}
                                />
                              )}
                              <div
                                className={cn(
                                  'absolute inset-0 rounded-full transition-all duration-300',
                                  isActive ? 'bg-transparent' : '',
                                  !isActive && isHighlighted
                                    ? 'bg-white scale-125'
                                    : 'bg-white/40 scale-100',
                                  !isActive &&
                                    !isHighlighted &&
                                    'group-hover:bg-white/70'
                                )}
                              />
                            </div>

                            <span
                              className={cn(
                                'relative z-10 text-xs font-medium tracking-tight leading-relaxed transition-colors duration-150',
                                isHighlighted || isActive
                                  ? 'text-white font-semibold'
                                  : 'text-white/80 group-hover:text-white',
                                heading.level === 3 && 'pl-1 opacity-85'
                              )}
                            >
                              {heading.text}
                            </span>
                          </motion.li>
                        );
                      })}
                    </motion.ul>
                  ) : (
                    <div className="p-4 text-center text-xs text-white/70">
                      No sections found
                    </div>
                  )}
                  <div className="h-4" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* 3. Next Component Button (Circular) */}
      {nextPage ? (
        <Link
          href={nextPage.url}
          title={`Next: ${nextPage.title}`}
          aria-label={`Next: ${nextPage.title}`}
          className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[#3f80ff] text-white shadow-pill-glow border border-white/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <NextArrowIcon className="h-4 w-4 text-white shrink-0" />
        </Link>
      ) : (
        <div
          className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[#3f80ff]/40 text-white/40 shadow-pill-glow border border-white/10 cursor-not-allowed pointer-events-none"
          aria-hidden="true"
        >
          <NextArrowIcon className="h-4 w-4 shrink-0 opacity-40" />
        </div>
      )}
    </div>
  );

  if (!mounted || typeof document === 'undefined') return null;
  return createPortal(pillContent, document.body);
}

export default FloatingDocIndex;
