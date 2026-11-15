'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { usePreviewStage } from './preview-context';

function InsertTopLeftIcon({ className, size = 14 }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 14"
      width={size}
      height={size}
      className={className}
    >
      <g>
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M13.5 1H9" strokeWidth="1" />
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M13.5 4H9" strokeWidth="1" />
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M13.5 7H9" strokeWidth="1" />
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M13.5 13H0.5" strokeWidth="1" />
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M13.5 10H0.5" strokeWidth="1" />
        <path fill="currentColor" fillOpacity="0.25" d="M6 1H1c-0.276142 0 -0.5 0.22386 -0.5 0.5v5c0 0.27614 0.223858 0.5 0.5 0.5h5c0.27614 0 0.5 -0.22386 0.5 -0.5v-5c0 -0.27614 -0.22386 -0.5 -0.5 -0.5Z" strokeWidth="1" />
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M6 1H1c-0.276142 0 -0.5 0.22386 -0.5 0.5v5c0 0.27614 0.223858 0.5 0.5 0.5h5c0.27614 0 0.5 -0.22386 0.5 -0.5v-5c0 -0.27614 -0.22386 -0.5 -0.5 -0.5Z" strokeWidth="1" />
      </g>
    </svg>
  );
}

function FocusPointsIcon({ className, size = 14 }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 14"
      width={size}
      height={size}
      className={className}
    >
      <g>
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M2.5 1.5h-1c-0.26522 0 -0.51957 0.10536 -0.707107 0.29289C0.605357 1.98043 0.5 2.23478 0.5 2.5v1" strokeWidth="1" />
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M13.5 3.5v-1c0 -0.26522 -0.1054 -0.51957 -0.2929 -0.70711C13.0196 1.60536 12.7652 1.5 12.5 1.5h-1" strokeWidth="1" />
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M11.5 12.5h1c0.2652 0 0.5196 -0.1054 0.7071 -0.2929s0.2929 -0.4419 0.2929 -0.7071v-1" strokeWidth="1" />
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M0.5 10.5v1c0 0.2652 0.105357 0.5196 0.292893 0.7071 0.187537 0.1875 0.441887 0.2929 0.707107 0.2929h1" strokeWidth="1" />
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M7 7.5c0.27614 0 0.5 -0.22386 0.5 -0.5s-0.22386 -0.5 -0.5 -0.5 -0.5 0.22386 -0.5 0.5 0.22386 0.5 0.5 0.5Z" strokeWidth="1" />
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M3 7.5c0.27614 0 0.5 -0.22386 0.5 -0.5s-0.22386 -0.5 -0.5 -0.5 -0.5 0.22386 -0.5 0.5 0.22386 0.5 0.5 0.5Z" strokeWidth="1" />
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M11 7.5c0.2761 0 0.5 -0.22386 0.5 -0.5s-0.2239 -0.5 -0.5 -0.5 -0.5 0.22386 -0.5 0.5 0.2239 0.5 0.5 0.5Z" strokeWidth="1" />
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M7 11.5c0.27614 0 0.5 -0.2239 0.5 -0.5s-0.22386 -0.5 -0.5 -0.5 -0.5 0.2239 -0.5 0.5 0.22386 0.5 0.5 0.5Z" strokeWidth="1" />
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M7 3.5c0.27614 0 0.5 -0.22386 0.5 -0.5s-0.22386 -0.5 -0.5 -0.5 -0.5 0.22386 -0.5 0.5 0.22386 0.5 0.5 0.5Z" strokeWidth="1" />
      </g>
    </svg>
  );
}

export function FloatingDocIndex({
  alwaysDocs = false,
  className,
}: {
  alwaysDocs?: boolean;
  className?: string;
}) {
  const { isInfoOpen, setIsInfoOpen, setIsCodeOpen } = usePreviewStage();
  const isDocMode = alwaysDocs || isInfoOpen;
  const pathname = usePathname();

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

  return (
    <div
      id="floating-doc-index-pill"
      className={cn(
        'absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto flex justify-center items-end select-none',
        className
      )}
    >
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
          'relative bg-[#3074fe] text-white shadow-pill-glow border border-white/20 flex flex-col origin-bottom cursor-pointer overflow-hidden',
          isOpen ? 'rounded-xl' : 'rounded-lg'
        )}
        onClick={!isDocMode ? () => setIsInfoOpen(true) : undefined}
      >
        {/* Content Container */}
        <div className="relative z-10 w-full">
          {/* Header / Trigger */}
          <div
            id="trigger-component-info"
            onClick={toggleIndex}
            className="flex items-center justify-between px-3 cursor-pointer h-[44px] shrink-0 w-full"
          >
            {isDocMode ? (
              /* State A: Info/Doc Mode Active -> Circular Progress + Index Label + Chevron + % + FocusPointsIcon */
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

                  {/* Switch Back to Preview Button: ONLY FocusPoints SVG icon (no preview text, no eye icon) */}
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
                      className="flex h-6 w-6 items-center justify-center rounded-md text-white bg-white/20 transition-colors active:scale-95 cursor-pointer shrink-0"
                    >
                      <FocusPointsIcon size={14} />
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* State B: Preview Mode Active -> ONLY InsertTopLeftIcon and text Component Info */
              <div className="flex items-center justify-center gap-2 whitespace-nowrap w-full">
                <InsertTopLeftIcon size={14} className="text-white shrink-0" />
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
                className="w-full border-t border-white/20 bg-[#3074fe]"
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
    </div>
  );
}

export default FloatingDocIndex;
