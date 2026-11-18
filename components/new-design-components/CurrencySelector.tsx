'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useCurrency, SUPPORTED_CURRENCIES } from '@/lib/currency';
import { cn } from '@/lib/utils';

export function CurrencySelector({
  currencyCode,
  onChange,
  className,
}: {
  currencyCode: string;
  onChange: (code: string) => void;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.USD;

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn('relative inline-block select-none', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-foreground dark:bg-neutral-800/80 hover:bg-neutral-200/60 dark:hover:bg-neutral-700/80 transition-all outline-none cursor-pointer"
        title="Change currency"
      >
        <span className="text-sm leading-none">{current.flag}</span>
        <span className="font-mono text-[11px] font-semibold">{current.code}</span>
        <span className="text-[11px] text-muted-foreground font-mono">({current.symbol})</span>
        <ChevronDown className={cn('h-3 w-3 text-muted-foreground transition-transform duration-150', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:left-0 sm:right-auto top-full mt-1.5 z-50 w-52 rounded-2xl border border-black/5 bg-white/95 p-1.5 shadow-[0_10px_28px_-4px_rgba(0,0,0,0.1),0_4px_10px_-2px_rgba(0,0,0,0.04)] backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-900/95 dark:shadow-[0_12px_30px_-5px_rgba(0,0,0,0.5)] max-h-64 overflow-y-auto">
          <div className="px-2.5 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Select Currency
          </div>
          {Object.values(SUPPORTED_CURRENCIES).map((curr) => {
            const isSelected = curr.code === currencyCode;
            return (
              <button
                key={curr.code}
                type="button"
                onClick={() => {
                  onChange(curr.code);
                  setIsOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs text-left transition-all cursor-pointer',
                  isSelected
                    ? 'bg-primary text-white font-medium shadow-pill-glow'
                    : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                )}
              >
                <div className="flex items-center gap-2">
                  <span>{curr.flag}</span>
                  <span className="font-medium">{curr.name}</span>
                </div>
                <span className={cn('font-mono text-[11px]', isSelected ? 'text-white/80' : 'text-muted-foreground')}>
                  {curr.symbol}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
