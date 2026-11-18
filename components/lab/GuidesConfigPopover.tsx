'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Layers, Monitor, ChevronDown, Check } from 'lucide-react';
import { GuidesState, GuideType } from './LabGuides';
import { cn } from '@/lib/utils';

interface GuidesConfigPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  config: GuidesState;
  onChange: (updater: (prev: GuidesState) => GuidesState) => void;
  side?: 'top' | 'bottom';
}

// ============================================================================
// CUSTOM POLISHED NUMBER STEPPER (Matching User's Reference Image)
// Rounded-full, no borders, no shadows, custom up/down triangles
// ============================================================================
interface NumberStepperProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  className?: string;
}

function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  suffix,
  className,
}: NumberStepperProps) {
  const handleIncrement = () => {
    onChange(Math.min(max, value + step));
  };

  const handleDecrement = () => {
    onChange(Math.max(min, value - step));
  };

  return (
    <div
      className={cn(
        'group flex h-7.5 items-center justify-between gap-1 rounded-full bg-neutral-100 px-3 transition-colors dark:bg-neutral-800 select-none',
        className
      )}
    >
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          if (!isNaN(val)) {
            onChange(Math.min(max, Math.max(min, val)));
          }
        }}
        className="w-10 bg-transparent text-right font-mono text-[11px] text-neutral-800 focus:outline-none dark:text-neutral-200 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />

      {suffix && (
        <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-sans">
          {suffix}
        </span>
      )}

      {/* Up & Down Stepper Chevrons (Image 2) */}
      <div className="flex flex-col items-center justify-center -space-y-0.5 pl-0.5">
        <button
          type="button"
          onClick={handleIncrement}
          className="text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors p-0.5 active:scale-125"
        >
          <svg className="h-2 w-2 fill-current" viewBox="0 0 10 6">
            <polygon points="5,0 10,6 0,6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleDecrement}
          className="text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors p-0.5 active:scale-125"
        >
          <svg className="h-2 w-2 fill-current" viewBox="0 0 10 6">
            <polygon points="0,0 10,0 5,6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// CUSTOM POLISHED TYPE DROPDOWN (Replaces Default Native Browser Select)
// Rounded-full trigger, no borders, no harsh shadows, sleek animated menu
// ============================================================================
interface TypeSelectProps<T extends string> {
  value: T;
  options: { label: string; value: T }[];
  onChange: (val: T) => void;
}

function TypeSelect<T extends string>({ value, options, onChange }: TypeSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const current = options.find((o) => o.value === value) || options[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-7.5 items-center justify-between gap-1.5 rounded-full bg-neutral-100 px-3 text-[11px] font-medium text-neutral-800 transition-colors hover:bg-neutral-200/70 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700/70 select-none"
      >
        <span>{current.label}</span>
        <ChevronDown
          className={cn(
            'h-3 w-3 text-neutral-400 transition-transform duration-150',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop click dismiss */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={{ duration: 0.1 }}
              className="absolute right-0 top-full mt-1.5 z-50 min-w-[110px] rounded-2xl bg-white/95 p-1 shadow-xl backdrop-blur-xl dark:bg-neutral-900/95 dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
            >
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-[11px] font-medium transition-colors',
                      isSelected
                        ? 'bg-primary text-white shadow-pill-glow font-semibold'
                        : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="h-3 w-3 text-white" />}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// MAIN COMPACT GUIDES POPOVER
// ============================================================================
export function GuidesConfigPopover({
  isOpen,
  onClose,
  config,
  onChange,
  side = 'top',
}: GuidesConfigPopoverProps) {
  if (!isOpen) return null;

  const { mode, target, columns, rows, grid } = config;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.12 }}
        className="fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))] sm:bottom-[3.75rem] left-1/2 -translate-x-1/2 z-50 w-72 max-w-[calc(100vw-32px)] max-h-[75vh] overflow-y-auto rounded-3xl border border-black/5 bg-white/95 p-3.5 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.1),0_4px_12px_-2px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/95 dark:shadow-[0_16px_40px_-6px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.08)] text-xs font-sans select-none"
      >
        {/* Top Header: Guide Mode Selector & Close */}
        <div className="flex items-center justify-between pb-2.5">
          <div className="flex h-8 items-center gap-0.5 rounded-full bg-neutral-100 p-0.5 dark:bg-neutral-800">
            {(['none', 'columns', 'rows', 'grid'] as GuideType[]).map((type) => (
              <button
                key={type}
                onClick={() => onChange((prev) => ({ ...prev, mode: type }))}
                className={cn(
                  'h-7 rounded-full px-2.5 text-[11px] font-medium capitalize transition-all',
                  mode === type
                    ? 'bg-primary text-white shadow-pill-glow font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                )}
              >
                {type === 'none' ? 'Off' : type}
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Target Scope Switcher (Component vs Page) */}
        {mode !== 'none' && (
          <div className="flex items-center justify-between py-2 text-[11px]">
            <span className="text-neutral-500 dark:text-neutral-400">Apply To</span>
            <div className="flex h-8 items-center gap-0.5 rounded-full bg-neutral-100 p-0.5 dark:bg-neutral-800">
              <button
                onClick={() => onChange((prev) => ({ ...prev, target: 'component' }))}
                className={cn(
                  'flex h-7 items-center gap-1 rounded-full px-2.5 text-[10.5px] font-medium transition-all',
                  target === 'component'
                    ? 'bg-white text-neutral-900 dark:bg-neutral-700 dark:text-white'
                    : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white'
                )}
              >
                <Layers className="h-2.5 w-2.5" />
                <span>Component</span>
              </button>
              <button
                onClick={() => onChange((prev) => ({ ...prev, target: 'page' }))}
                className={cn(
                  'flex h-7 items-center gap-1 rounded-full px-2.5 text-[10.5px] font-medium transition-all',
                  target === 'page'
                    ? 'bg-white text-neutral-900 dark:bg-neutral-700 dark:text-white'
                    : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white'
                )}
              >
                <Monitor className="h-2.5 w-2.5" />
                <span>Page</span>
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Controls based on selected mode */}
        <div className="space-y-2 pt-1">
          {/* COLUMNS CONTROLS */}
          {mode === 'columns' && (
            <>
              {/* Count */}
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Count</span>
                <NumberStepper
                  value={columns.count === 'auto' ? 12 : Number(columns.count)}
                  onChange={(val) =>
                    onChange((prev) => ({
                      ...prev,
                      columns: { ...prev.columns, count: val },
                    }))
                  }
                  min={1}
                  max={24}
                />
              </div>

              {/* Type (Alignment) */}
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Type</span>
                <TypeSelect
                  value={columns.type}
                  options={[
                    { label: 'Stretch', value: 'stretch' },
                    { label: 'Center', value: 'center' },
                    { label: 'Left', value: 'left' },
                    { label: 'Right', value: 'right' },
                  ]}
                  onChange={(val) =>
                    onChange((prev) => ({
                      ...prev,
                      columns: { ...prev.columns, type: val },
                    }))
                  }
                />
              </div>

              {/* Width (when not stretch) */}
              {columns.type !== 'stretch' && (
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Width</span>
                  <NumberStepper
                    value={columns.width === 'auto' ? 60 : Number(columns.width)}
                    onChange={(val) =>
                      onChange((prev) => ({
                        ...prev,
                        columns: { ...prev.columns, width: val },
                      }))
                    }
                    min={10}
                    max={400}
                    step={4}
                    suffix="px"
                  />
                </div>
              )}

              {/* Margin (on stretch) */}
              {columns.type === 'stretch' && (
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Margin</span>
                  <NumberStepper
                    value={columns.margin}
                    onChange={(val) =>
                      onChange((prev) => ({
                        ...prev,
                        columns: { ...prev.columns, margin: val },
                      }))
                    }
                    min={0}
                    max={120}
                    step={4}
                    suffix="px"
                  />
                </div>
              )}

              {/* Offset (on Left or Right) */}
              {(columns.type === 'left' || columns.type === 'right') && (
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Offset</span>
                  <NumberStepper
                    value={columns.offset}
                    onChange={(val) =>
                      onChange((prev) => ({
                        ...prev,
                        columns: { ...prev.columns, offset: val },
                      }))
                    }
                    min={0}
                    max={200}
                    step={4}
                    suffix="px"
                  />
                </div>
              )}

              {/* Gutter */}
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Gutter</span>
                <NumberStepper
                  value={columns.gutter}
                  onChange={(val) =>
                    onChange((prev) => ({
                      ...prev,
                      columns: { ...prev.columns, gutter: val },
                    }))
                  }
                  min={0}
                  max={64}
                  step={2}
                  suffix="px"
                />
              </div>

              {/* Opacity */}
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Opacity</span>
                <NumberStepper
                  value={columns.opacity}
                  onChange={(val) =>
                    onChange((prev) => ({
                      ...prev,
                      columns: { ...prev.columns, opacity: val },
                    }))
                  }
                  min={5}
                  max={100}
                  step={5}
                  suffix="%"
                />
              </div>
            </>
          )}

          {/* ROWS CONTROLS */}
          {mode === 'rows' && (
            <>
              {/* Type */}
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Type</span>
                <TypeSelect
                  value={rows.type}
                  options={[
                    { label: 'Top', value: 'top' },
                    { label: 'Bottom', value: 'bottom' },
                    { label: 'Center', value: 'center' },
                    { label: 'Stretch', value: 'stretch' },
                  ]}
                  onChange={(val) =>
                    onChange((prev) => ({
                      ...prev,
                      rows: { ...prev.rows, type: val },
                    }))
                  }
                />
              </div>

              {/* Row Height */}
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Height</span>
                <NumberStepper
                  value={Number(rows.height) || 16}
                  onChange={(val) =>
                    onChange((prev) => ({
                      ...prev,
                      rows: { ...prev.rows, height: val },
                    }))
                  }
                  min={4}
                  max={120}
                  step={4}
                  suffix="px"
                />
              </div>

              {/* Gutter */}
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Gutter</span>
                <NumberStepper
                  value={rows.gutter}
                  onChange={(val) =>
                    onChange((prev) => ({
                      ...prev,
                      rows: { ...prev.rows, gutter: val },
                    }))
                  }
                  min={0}
                  max={64}
                  step={2}
                  suffix="px"
                />
              </div>

              {/* Margin (on stretch) */}
              {rows.type === 'stretch' && (
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Margin</span>
                  <NumberStepper
                    value={rows.margin}
                    onChange={(val) =>
                      onChange((prev) => ({
                        ...prev,
                        rows: { ...prev.rows, margin: val },
                      }))
                    }
                    min={0}
                    max={120}
                    step={4}
                    suffix="px"
                  />
                </div>
              )}

              {/* Offset (on Top or Bottom) */}
              {(rows.type === 'top' || rows.type === 'bottom') && (
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Offset</span>
                  <NumberStepper
                    value={rows.offset}
                    onChange={(val) =>
                      onChange((prev) => ({
                        ...prev,
                        rows: { ...prev.rows, offset: val },
                      }))
                    }
                    min={0}
                    max={200}
                    step={4}
                    suffix="px"
                  />
                </div>
              )}

              {/* Opacity */}
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Opacity</span>
                <NumberStepper
                  value={rows.opacity}
                  onChange={(val) =>
                    onChange((prev) => ({
                      ...prev,
                      rows: { ...prev.rows, opacity: val },
                    }))
                  }
                  min={5}
                  max={100}
                  step={5}
                  suffix="%"
                />
              </div>
            </>
          )}

          {/* GRID CONTROLS */}
          {mode === 'grid' && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Grid Size</span>
                <NumberStepper
                  value={grid.size}
                  onChange={(val) =>
                    onChange((prev) => ({
                      ...prev,
                      grid: { ...prev.grid, size: val },
                    }))
                  }
                  min={4}
                  max={64}
                  step={2}
                  suffix="px"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Opacity</span>
                <NumberStepper
                  value={grid.opacity}
                  onChange={(val) =>
                    onChange((prev) => ({
                      ...prev,
                      grid: { ...prev.grid, opacity: val },
                    }))
                  }
                  min={5}
                  max={100}
                  step={5}
                  suffix="%"
                />
              </div>
            </>
          )}

          {mode === 'none' && (
            <div className="py-2 text-center text-neutral-400 text-[11px]">
              Select Columns, Rows, or Grid above to preview layout guides.
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default GuidesConfigPopover;
