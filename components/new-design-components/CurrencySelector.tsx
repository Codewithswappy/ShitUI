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
        className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 shadow-xs shadow-black/5 dark:shadow-white/10 ring-1 ring-black/5 dark:ring-1 dark:ring-white/10 px-2.5 py-0.5 text-[11px] font-medium text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all outline-none cursor-pointer select-none h-7"
        title="Change currency"
      >
        <span className="font-mono text-[11px] font-semibold">{current.code}</span>
        <span className="text-[10px] text-muted-foreground font-mono">({current.symbol})</span>
        <ChevronDown className={cn('h-2.5 w-2.5 text-muted-foreground transition-transform duration-150', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:left-0 sm:right-auto top-full mt-1.5 z-50 w-44 rounded-xl border border-black/5 bg-white/95 p-1 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.08),0_2px_6px_-1px_rgba(0,0,0,0.03)] backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/95 dark:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.4)] max-h-56 overflow-y-auto">
         
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
                  'flex w-full items-center justify-between rounded-md px-2 py-1 text-[11px] font-normal text-left transition-colors cursor-pointer',
                  isSelected
                    ? 'bg-primary text-white font-normal'
                    : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-normal'
                )}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[10px] leading-none shrink-0 opacity-80">{curr.flag}</span>
                  <span className="font-normal truncate">{curr.name}</span>
                </div>
                <span className={cn('font-mono text-[10px] shrink-0 ml-1.5', isSelected ? 'text-white/80' : 'text-muted-foreground')}>
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
