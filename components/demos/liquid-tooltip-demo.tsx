'use client';

import React from 'react';
import { LiquidTooltip } from '@/components/shitui/LiquidTooltip';

export function LiquidTooltipDemo() {
  const buttonClasses =
    'w-36 h-10 inline-flex items-center justify-center rounded-lg shadow-sm shadow-black/5 ring-1 ring-black/5 dark:shadow-sm dark:shadow-white/10 dark:ring-1 dark:ring-white/10 bg-neutral-100 dark:bg-neutral-900 text-xs sm:text-sm font-medium text-foreground transition-colors hover:bg-muted/70 hover:border-border cursor-pointer';

  return (
    <div className="flex items-center justify-center w-full min-h-[320px] p-8 sm:p-12 md:p-16 select-none">
      <div className="grid grid-cols-2 gap-x-12 sm:gap-x-20 gap-y-10 sm:gap-y-12">
        <LiquidTooltip text="Liquid tooltip magic!" placement="top">
          <button type="button" className={buttonClasses}>
            Top tooltip
          </button>
        </LiquidTooltip>

        <LiquidTooltip text="Smooth liquid physics!" placement="bottom">
          <button type="button" className={buttonClasses}>
            Bottom tooltip
          </button>
        </LiquidTooltip>

        <LiquidTooltip text="Dynamic direction!" placement="left">
          <button type="button" className={buttonClasses}>
            Left tooltip
          </button>
        </LiquidTooltip>

        <LiquidTooltip text="Interactive spring feel!" placement="right">
          <button type="button" className={buttonClasses}>
            Right tooltip
          </button>
        </LiquidTooltip>
      </div>
    </div>
  );
}

export default LiquidTooltipDemo;
