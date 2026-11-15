'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  DuoSearch,
  DuoClose,
  DuoArrowRight,
  DuoPuzzlePiece,
  RoundedMagniferIcon,
} from './DuoIcons';
import { cn } from '@/lib/utils';

export interface SearchItem {
  id: string;
  name: string;
  category: string;
  tag: string;
  slug: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: SearchItem[];
}

// Consistent puzzle piece duotone icon for all component search results
function getCategoryIcon(_category?: string) {
  return DuoPuzzlePiece;
}

// Subtle text match highlight (medium weight, no bold)
function HighlightMatch({
  text,
  query,
  isSelected,
}: {
  text: string;
  query: string;
  isSelected?: boolean;
}) {
  if (!query.trim()) return <>{text}</>;
  const trimmed = query.trim();
  const regex = new RegExp(`(${trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span
            key={i}
            className={cn(
              'font-medium underline underline-offset-2',
              isSelected
                ? 'text-white decoration-white/70'
                : 'text-[#3074fe] decoration-[#3074fe]/40'
            )}
          >
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

export function SearchModal({ isOpen, onClose, items }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const hasQuery = query.trim().length > 0;

  // Filter items matching query
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.tag.toLowerCase().includes(q)
    );
  }, [items, query]);

  // Focus and clear input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      const timer = setTimeout(() => inputRef.current?.focus(), 40);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Keep selection bounded
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (!hasQuery || filtered.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = (prev + 1) % filtered.length;
          itemRefs.current[next]?.scrollIntoView({ block: 'nearest' });
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = (prev - 1 + filtered.length) % filtered.length;
          itemRefs.current[next]?.scrollIntoView({ block: 'nearest' });
          return next;
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filtered[selectedIndex];
        if (selected) {
          onClose();
          router.push(`/docs/${selected.slug}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasQuery, filtered, selectedIndex, onClose, router]);

  const handleSelect = (slug: string) => {
    onClose();
    router.push(`/docs/${slug}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-3 pt-20 select-none sm:pt-28">
          {/* Backdrop with smooth blur fade */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(6px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 dark:bg-black/70"
          />

          {/* Ultra-compact Command Bar / Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="border-border/80 bg-background relative z-10 flex w-full max-w-[400px] flex-col overflow-hidden rounded-2xl dark:shadow-pill-inset shadow-sm shadow-black/10 ring-1 ring-black/5"
          >
           

            {/* Compact Searchbar Header */}
            <div className="relative flex items-center gap-2.5 px-3 py-2.5">
              <RoundedMagniferIcon className="text-muted-foreground/70 h-4 w-4 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search components..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="text-foreground placeholder:text-muted-foreground/50 h-6 w-full bg-background text-[13px] font-normal tracking-tight focus:outline-none"
              />

              {/* Action Badges / Clear */}
              <div className="flex shrink-0 items-center gap-1.5">
                {query ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      inputRef.current?.focus();
                    }}
                    title="Clear query"
                    className="text-muted-foreground/60 hover:text-foreground hover:bg-muted/60 flex h-5 w-5 cursor-pointer items-center justify-center rounded-md transition-colors"
                  >
                    <DuoClose className="h-3 w-3" />
                  </button>
                ) : (
                  <kbd className="text-muted-foreground/50 bg-muted/40 border-border/40 inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[9.5px]">
                    ESC
                  </kbd>
                )}
              </div>
            </div>

            {/* Animated Expandable Results Area (Smoothly expands and morphs on content change) */}
            <AnimatePresence>
              {hasQuery && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="border-border/40 overflow-hidden border-t"
                >
                  <div className="scrollbar-thin max-h-[260px] overflow-y-auto p-1">
                    {filtered.length === 0 ? (
                      <div className="text-muted-foreground/60 flex flex-col items-center justify-center gap-1 px-4 py-6 text-center">
                        <RoundedMagniferIcon className="mb-0.5 h-3.5 w-3.5 opacity-50" />
                        <p className="text-muted-foreground/75 text-[12px] font-normal">
                          No results for &ldquo;{query}&rdquo;
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        {filtered.map((item, idx) => {
                          const isSelected = selectedIndex === idx;
                          const CatIcon = getCategoryIcon(item.category);

                          return (
                            <button
                              key={item.id}
                              ref={(el) => {
                                itemRefs.current[idx] = el;
                              }}
                              type="button"
                              onClick={() => handleSelect(item.slug)}
                              onMouseEnter={() => setSelectedIndex(idx)}
                              className="group relative flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors select-none"
                            >
                              {/* Liquid Sliding Selection Pill with bg-[#3074fe] and shadow-pill-glow */}
                              {isSelected && (
                                <motion.div
                                  layoutId="search-item-highlight"
                                  className="pointer-events-none absolute inset-0 rounded-lg bg-[#3074fe] shadow-pill-glow"
                                  transition={{
                                    duration: 0.12,
                                    ease: [0.16, 1, 0.3, 1],
                                  }}
                                />
                              )}

                              {/* Left: Category Icon + Title (Regular font, No Badges) */}
                              <div className="relative z-10 flex min-w-0 items-center gap-2.5 pr-2">
                                <div
                                  className={cn(
                                    'flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-md transition-colors',
                                    isSelected
                                      ? 'bg-white/20 text-white'
                                      : 'bg-muted/40 text-muted-foreground/70 group-hover:text-foreground'
                                  )}
                                >
                                  <CatIcon className="h-3.5 w-3.5" />
                                </div>

                                <span
                                  className={cn(
                                    'truncate text-[12.5px] tracking-tight transition-colors',
                                    isSelected
                                      ? 'text-white font-medium'
                                      : 'text-foreground font-normal'
                                  )}
                                >
                                  <HighlightMatch
                                    text={item.name}
                                    query={query}
                                    isSelected={isSelected}
                                  />
                                </span>
                              </div>

                              {/* Right: Clean Arrow Only (No category text) */}
                              <div className="relative z-10 flex shrink-0 items-center">
                                <DuoArrowRight
                                  className={cn(
                                    'h-3 w-3 transition-transform duration-150',
                                    isSelected
                                      ? 'text-white translate-x-0.5'
                                      : 'text-muted-foreground/35 group-hover:text-foreground/70'
                                  )}
                                />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Compact Bottom Footer Helper Bar */}
                  <div className="border-border/30 bg-muted/15 text-muted-foreground/50 flex items-center justify-between border-t px-3 py-1 font-sans text-[9.5px] dark:bg-neutral-900/25">
                    <span className="font-mono">
                      {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
                    </span>

                    <div className="flex items-center gap-2 font-mono text-[9px]">
                      <span className="inline-flex items-center gap-1">
                        <kbd className="py-0.2 bg-muted/50 border-border/30 rounded border px-1">
                          ↑↓
                        </kbd>
                        <span>navigate</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <kbd className="py-0.2 bg-muted/50 border-border/30 rounded border px-1">
                          ↵
                        </kbd>
                        <span>open</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <kbd className="py-0.2 bg-muted/50 border-border/30 rounded border px-1">
                          esc
                        </kbd>
                        <span>close</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default SearchModal;
