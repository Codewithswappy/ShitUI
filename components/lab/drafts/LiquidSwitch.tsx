'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface LiquidSwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  label?: string;
}

export function LiquidSwitch({
  checked = false,
  onCheckedChange,
  className,
  label = 'Fluid Motion',
}: LiquidSwitchProps) {
  const [isOn, setIsOn] = React.useState(checked);

  const toggle = () => {
    const next = !isOn;
    setIsOn(next);
    onCheckedChange?.(next);
  };

  return (
    <div className={cn('flex items-center gap-3 select-none', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        onClick={toggle}
        className={cn(
          'relative flex h-8 w-14 cursor-pointer items-center rounded-full p-1 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          isOn ? 'bg-primary' : 'bg-neutral-200 dark:bg-neutral-800'
        )}
      >
        <motion.div
          layout
          transition={{
            type: 'spring',
            stiffness: 600,
            damping: 30,
          }}
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md',
            isOn ? 'translate-x-6' : 'translate-x-0'
          )}
        >
          <motion.div
            animate={{
              scale: isOn ? [1, 1.25, 1] : 1,
            }}
            transition={{ duration: 0.2 }}
            className={cn(
              'h-2 w-2 rounded-full transition-colors',
              isOn ? 'bg-primary' : 'bg-neutral-300 dark:bg-neutral-600'
            )}
          />
        </motion.div>
      </button>
      {label && (
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label} ({isOn ? 'Active' : 'Idle'})
        </span>
      )}
    </div>
  );
}

export default LiquidSwitch;
