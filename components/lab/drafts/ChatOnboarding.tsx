'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
  useMemo,
  useImperativeHandle,
} from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

export type OnboardingAnswers = Record<string, string>;

export type StepType = 'text' | 'email' | 'single-select' | 'multi-select';

export interface OnboardingStep {
  /** Unique key in the returned answers object (e.g. 'name', 'email', 'role') */
  id: string;
  /** Friendly label displayed in the summary review card */
  label?: string;
  /** The question string or a dynamic function receiving previous answers */
  question: string | ((answers: OnboardingAnswers) => string);
  /** Input placeholder string */
  placeholder?: string;
  /** Step type: 'text', 'email', 'single-select', or 'multi-select' */
  type?: StepType;
  /** Clickable option choices for single-select or multi-select steps */
  options?: string[];
  /** Subtitle or hint text for this step (e.g. 'Select all that apply') */
  helperText?: string;
  /** Whether this question can be skipped (Default: false) */
  optional?: boolean;
  /** Custom validation function returning true if valid, or an error message string */
  validate?: (value: string) => string | boolean | undefined;
}

export interface ChatOnboardingProps {
  /** Optional container className */
  className?: string;
  /** Brand name displayed in header and welcome text (Default: 'Shit AI') */
  brandName?: string;
  /** Brand logo node (Defaults to an inline geometric SVG logo) */
  logo?: React.ReactNode;
  /** Custom steps array. Defaults to modern AI company onboarding */
  steps?: OnboardingStep[];
  /** Initial placeholder when the pill is closed */
  initialPlaceholder?: string;
  /** Custom completion heading string or function */
  completionTitle?: string | ((answers: OnboardingAnswers) => string);
  /** Custom completion subtitle */
  completionSubtitle?: string;
  /** Custom confirm button text in review step (Default: 'Launch') */
  confirmButtonText?: string;
  /** Custom height in pixels when expanded into chat mode (Default: 420) */
  expandedHeight?: number;
  /** Brand accent color for user bubbles, buttons and active states (Default: '#3074fe') */
  accentColor?: string;
  /** Success checkmark color (Default: '#22c55e') */
  successColor?: string;
  /** Whether the initial pill should autofocus on mount (Default: false) */
  autoFocus?: boolean;
  /** Callback fired with all collected answers when onboarding is completed */
  onComplete?: (answers: OnboardingAnswers) => void;
  /** Callback fired whenever the active question step changes */
  onStepChange?: (stepIndex: number, step: OnboardingStep) => void;
  /** Callback fired when the container expands into chat or collapses back to the initial pill */
  onExpandChange?: (isExpanded: boolean) => void;
  /** Callback fired when the user resets the conversation */
  onReset?: () => void;
}

export interface ChatOnboardingRef {
  startWithName: (name: string) => void;
  setInitialInput: (name: string) => void;
  reset: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  stepIndex?: number;
  isSummary?: boolean;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const DEFAULT_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'name',
    label: 'Your Name',
    question: 'First, what should we call you?',
    placeholder: 'Enter your full name',
    type: 'text',
  },
  {
    id: 'email',
    label: 'Work Email',
    question: (answers) => `Nice to meet you, ${answers.name || 'there'}! What's your email?`,
    placeholder: 'you@example.com',
    type: 'email',
    validate: (val) => (EMAIL_REGEX.test(val.trim()) ? true : 'Please enter a valid email address'),
  },
  {
    id: 'company',
    label: 'Company',
    question: 'What company or organization do you work with?',
    placeholder: 'Company name',
    optional: true,
    type: 'text',
  },
  {
    id: 'role',
    label: 'Your Role',
    question: 'What best describes what you do?',
    helperText: 'Choose the role that fits you best',
    type: 'single-select',
    options: [
      'Engineer',
      'Designer',
      'Product Manager',
      'Founder',
      'Researcher',
      'Student',
      'Other',
    ],
  },
  {
    id: 'experience',
    label: 'Experience',
    question: 'What is your AI experience level?',
    type: 'single-select',
    options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
  },
  {
    id: 'useCases',
    label: 'What You Build',
    question: 'What are you planning to build?',
    helperText: 'Select all that apply',
    type: 'multi-select',
    options: ['AI Agents', 'Web Apps', 'Automations', 'Research', 'All of the above', 'Other'],
  },
  {
    id: 'stack',
    label: 'Your Tech Stack',
    question: 'Which tools and models do you use?',
    helperText: 'Select all that apply',
    optional: true,
    type: 'multi-select',
    options: [
      'OpenAI',
      'Claude',
      'Gemini',
      'Vercel AI',
      'Ollama / Local LLMs',
      'Other Frameworks & APIs',
      'Just Getting Started',
    ],
  },
];

function DefaultBrandLogo({
  className = 'h-5 w-5',
  color = '#3074fe',
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="3.5" fill={color} />
    </svg>
  );
}

function ArrowRightIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ArrowLeftIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

function RefreshIcon({ className = 'h-3 w-3' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}

function UndoIcon({ className = 'h-3 w-3' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </svg>
  );
}

function SparklesIcon({
  className = 'h-3.5 w-3.5',
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
    </svg>
  );
}

const ChatMessageItem = React.memo(function ChatMessageItem({
  msg,
  activeStep,
  selectedMulti,
  onToggleMulti,
  onConfirmMulti,
  onSelectOption,
  onSkip,
  onJumpToStep,
  accentColor,
  summaryData,
  isOptional,
}: {
  msg: ChatMessage;
  activeStep?: OnboardingStep;
  selectedMulti: string[];
  onToggleMulti: (option: string) => void;
  onConfirmMulti: (customOtherText?: string) => void;
  onSelectOption: (option: string) => void;
  onSkip?: () => void;
  onJumpToStep?: (stepIndex: number) => void;
  accentColor: string;
  summaryData?: { steps: OnboardingStep[]; answers: OnboardingAnswers };
  isOptional?: boolean;
}) {
  const isUser = msg.sender === 'user';
  const isMulti = activeStep?.type === 'multi-select';

  // Compact custom "Other" text state
  const [otherText, setOtherText] = useState('');
  const [isOtherSelectedInSingle, setIsOtherSelectedInSingle] = useState(false);

  // Group steps for clean, compact summary presentation
  const scalarSteps = useMemo(() => {
    if (!summaryData) return [];
    return summaryData.steps.filter((s) => s.type !== 'multi-select');
  }, [summaryData]);

  const multiSteps = useMemo(() => {
    if (!summaryData) return [];
    return summaryData.steps.filter((s) => s.type === 'multi-select');
  }, [summaryData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{
        opacity: 0,
        y: -5,
        scale: 0.985,
        transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
      }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'flex w-full shrink-0 origin-bottom flex-col',
        isUser ? 'items-end' : 'items-start'
      )}
    >
      {msg.isSummary && summaryData ? (
        /* Summary card with shadow-sm, ring-1, and normal/medium font layout */
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="w-full space-y-3 rounded-2xl bg-white p-3.5 shadow-sm ring-1 shadow-black/10 ring-black/10 dark:bg-neutral-900 dark:ring-1 dark:shadow-white/10 dark:ring-white/10"
        >
          {/* Card Header (NO icon, medium weight) */}
          <div className="pb-0.5">
            <span className="text-[12px] font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
              Workspace Configuration
            </span>
          </div>

          {/* Symmetrical 2-Column Responsive Grid for Scalar Fields (NO BOLD FONT) */}
          <div className="grid grid-cols-1 gap-x-3 gap-y-2.5 pt-1 text-[11px] sm:grid-cols-2">
            {scalarSteps.map((step) => {
              const val = summaryData.answers[step.id];
              if (!val) return null;

              return (
                <div key={step.id} className="min-w-0">
                  <span className="block text-[9.5px] leading-tight font-medium tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
                    {step.label || step.id}
                  </span>
                  <span className="mt-0.5 block truncate text-[11.5px] leading-snug font-normal text-neutral-800 dark:text-neutral-200">
                    {val}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Compact Multi-Select Fields (NO BOLD FONT) */}
          {multiSteps.length > 0 && (
            <div className="space-y-2.5 pt-1 text-[11px]">
              {multiSteps.map((step) => {
                const val = summaryData.answers[step.id];
                if (!val) return null;
                const items = val.split(', ').filter(Boolean);

                return (
                  <div key={step.id}>
                    <span className="block text-[9.5px] leading-tight font-medium tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
                      {step.label || step.id}
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {items.map((item) => (
                        <span
                          key={item}
                          className="rounded-lg bg-white px-2 py-0.5 text-[10px] font-normal text-neutral-800 shadow-xs ring-1 shadow-black/5 ring-black/5 dark:bg-neutral-700/80 dark:text-neutral-200 dark:shadow-xs dark:ring-1 dark:shadow-white/5 dark:ring-white/10"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      ) : (
        /* Regular Message Bubble with Optional Label & Quick Rewind Icon */
        <div
          className={cn(
            'flex flex-col',
            isUser ? 'items-end self-end' : 'items-start self-start',
            'max-w-[92%]'
          )}
        >
          {!isUser && isOptional && (
            <span className="pb-1 pl-1 text-[10px] font-normal text-neutral-400 select-none dark:text-neutral-500">
              optional
            </span>
          )}
          <div className={cn('flex items-center gap-1.5', isUser && 'flex-row-reverse')}>
            <div
              style={isUser ? { backgroundColor: accentColor } : undefined}
              className={cn(
                'rounded-2xl px-3 py-1.5 text-[11.5px] leading-relaxed transition-colors',
                isUser
                  ? 'rounded-br-sm font-medium text-white'
                  : 'rounded-bl-sm bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100'
              )}
            >
              {msg.text}
            </div>

            {/* Back Navigation Icon on each answered chat message */}
            {isUser && msg.stepIndex !== undefined && onJumpToStep && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.65, scale: 1 }}
                whileHover={{ opacity: 1, scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                type="button"
                onClick={() => onJumpToStep(msg.stepIndex!)}
                className="shrink-0 cursor-pointer rounded-md p-1 text-neutral-400 transition-colors outline-none select-none hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                title="Edit this question"
                aria-label={`Edit question ${msg.stepIndex + 1}`}
              >
                <UndoIcon className="h-3 w-3" />
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* Render options for the active question step */}
      {activeStep && activeStep.options && activeStep.options.length > 0 && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{
              opacity: 0,
              height: 0,
              transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
            }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="w-full overflow-hidden py-1"
          >
            {isMulti ? (
              /* Genuine Vertical Checklist with optional "Other" custom input and "All of the above" */
              <div className="flex w-full flex-col gap-1 px-1 pt-1 pb-0.5">
                {activeStep.helperText && (
                  <span className="pb-0.5 pl-0.5 text-[10.5px] font-normal text-neutral-400 dark:text-neutral-500">
                    {activeStep.helperText}
                  </span>
                )}

                <div className="flex w-full flex-col gap-0.5">
                  {activeStep.options.map((option, idx) => {
                    const isSelected = selectedMulti.includes(option);
                    const isOther = option.trim().toLowerCase() === 'other';

                    return (
                      <motion.div
                        key={option}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.02, ease: [0.16, 1, 0.3, 1] }}
                        className="flex w-full flex-col"
                      >
                        <motion.button
                          whileTap={{ scale: 0.985 }}
                          type="button"
                          onClick={() => onToggleMulti(option)}
                          className="group flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1.5 text-left text-[11.5px] font-medium transition-colors outline-none hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60"
                        >
                          {/* Animated circular check indicator with glossy illuminated inset */}
                          <motion.div
                            animate={{
                              scale: isSelected ? [0.85, 1.15, 1] : 1,
                            }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            style={isSelected ? { backgroundColor: accentColor } : undefined}
                            className={cn(
                              'flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full transition-all select-none',
                              isSelected
                                ? 'text-white shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.45),inset_0_0_10px_0_rgba(255,255,255,0.25)]'
                                : 'border border-neutral-300 bg-transparent group-hover:border-neutral-400 dark:border-neutral-600 dark:group-hover:border-neutral-500'
                            )}
                          >
                            <AnimatePresence>
                              {isSelected && (
                                <motion.svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-2.5 w-2.5 text-white"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                >
                                  <motion.path
                                    d="M 20 6 L 9 17 L 4 12"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    exit={{ pathLength: 0 }}
                                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                  />
                                </motion.svg>
                              )}
                            </AnimatePresence>
                          </motion.div>
                          <span
                            className={cn(
                              'leading-snug transition-colors',
                              isSelected
                                ? 'font-medium text-neutral-900 dark:text-neutral-100'
                                : 'text-neutral-600 group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-200'
                            )}
                          >
                            {option}
                          </span>
                        </motion.button>

                        {/* Compact Textarea for "Other" when checked */}
                        <AnimatePresence>
                          {isOther && isSelected && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                              className="pt-1 pr-1.5 pb-2 pl-7"
                            >
                              <textarea
                                rows={2}
                                value={otherText}
                                onChange={(e) => setOtherText(e.target.value)}
                                placeholder="Please specify your own..."
                                className="w-full resize-none rounded-xl bg-neutral-100/90 px-3 py-2 text-[11.5px] text-neutral-800 shadow-xs ring-1 shadow-black/5 ring-black/10 transition-all outline-none placeholder:text-neutral-400 focus:ring-1 focus:ring-neutral-200  dark:bg-neutral-800 dark:text-neutral-200 dark:ring-white/10 dark:placeholder:text-neutral-500"
                                autoFocus
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-end pt-2">
                  <motion.button
                    whileHover={selectedMulti.length > 0 ? { scale: 1.03 } : undefined}
                    whileTap={selectedMulti.length > 0 ? { scale: 0.96 } : undefined}
                    type="button"
                    onClick={() => onConfirmMulti(otherText)}
                    disabled={selectedMulti.length === 0}
                    style={selectedMulti.length > 0 ? { backgroundColor: accentColor } : undefined}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-offset-1',
                      selectedMulti.length > 0
                        ? 'cursor-pointer text-white shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.45),inset_0_0_10px_0_rgba(255,255,255,0.25)] hover:opacity-95 active:scale-95'
                        : 'cursor-not-allowed bg-neutral-200 text-neutral-400 opacity-60 shadow-none dark:bg-neutral-800 dark:text-neutral-600'
                    )}
                  >
                    <span>Continue</span>
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </motion.button>
                </div>
              </div>
            ) : (
              /* Single-select Pill Chips with optional "Other" custom input */
              <div className="flex w-full flex-col gap-1.5 px-1.5 pt-1.5 pb-1">
                <div className="flex w-full flex-wrap items-center gap-1.5">
                  {activeStep.options.map((option, idx) => {
                    const isOther = option.trim().toLowerCase() === 'other';
                    const isSelected = isOther && isOtherSelectedInSingle;

                    return (
                      <motion.button
                        key={option}
                        initial={{ opacity: 0, scale: 0.92, y: 3 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.18, delay: idx * 0.02, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        type="button"
                        onClick={() => {
                          if (isOther) {
                            setIsOtherSelectedInSingle((prev) => !prev);
                          } else {
                            setIsOtherSelectedInSingle(false);
                            onSelectOption(option);
                          }
                        }}
                        style={isSelected ? { backgroundColor: accentColor } : undefined}
                        className={cn(
                          'shrink-0 cursor-pointer rounded-xl px-2.5 py-1 text-[11px] font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-neutral-400',
                          isSelected
                            ? 'text-white shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.45),inset_0_0_10px_0_rgba(255,255,255,0.25)] ring-0'
                            : 'dark:hover:bg-neutral-750 bg-white text-neutral-700 shadow-xs ring-1 shadow-black/5 ring-black/5 hover:bg-neutral-50 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-300 dark:shadow-xs dark:ring-1 dark:shadow-white/5 dark:ring-white/5 dark:hover:text-white'
                        )}
                      >
                        {option}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Compact Textarea when "Other" pill is selected in single-select */}
                <AnimatePresence>
                  {isOtherSelectedInSingle && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full px-1.5 pt-1.5 pb-3"
                    >
                      <div className="flex items-center gap-2">
                        <textarea
                          rows={2}
                          value={otherText}
                          onChange={(e) => setOtherText(e.target.value)}
                          onFocus={(e) => {
                            setTimeout(() => {
                              e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }, 100);
                          }}
                          placeholder="Please specify your own..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              const customVal = otherText.trim() || 'Other';
                              onSelectOption(customVal);
                            }
                          }}
                          className="w-full resize-none rounded-xl bg-neutral-100/90 px-3 py-2 text-[11.5px] text-neutral-800 shadow-xs ring-1 shadow-black/5 ring-black/10 transition-all outline-none placeholder:text-neutral-400 focus:ring-1 focus:ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:ring-white/10 dark:placeholder:text-neutral-500"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const customVal = otherText.trim() || 'Other';
                            onSelectOption(customVal);
                          }}
                          style={{ backgroundColor: accentColor }}
                          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl text-white shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.45),inset_0_0_10px_0_rgba(255,255,255,0.25)] transition-all outline-none hover:opacity-95 active:scale-95"
                          title="Submit"
                        >
                          <ArrowRightIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
});

export const ChatOnboarding = React.forwardRef<ChatOnboardingRef, ChatOnboardingProps>(
  function ChatOnboarding(
    {
      className,
      brandName = 'Shit AI',
      logo,
      steps = DEFAULT_ONBOARDING_STEPS,
      initialPlaceholder,
      completionTitle,
      completionSubtitle = 'Your AI workspace is configured and ready.',
      confirmButtonText = 'Launch',
      expandedHeight = 420,
      accentColor = '#3074fe',
      successColor = '#22c55e',
      autoFocus = false,
      onComplete,
      onStepChange,
      onExpandChange,
      onReset,
    },
    ref
  ) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [initialInput, setInitialInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [answers, setAnswers] = useState<OnboardingAnswers>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedMulti, setSelectedMulti] = useState<string[]>([]);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      if (window.visualViewport) {
        setViewportHeight(window.visualViewport.height);
      } else {
        setViewportHeight(window.innerHeight);
      }
    };

    handleResize();
    window.visualViewport?.addEventListener('resize', handleResize);
    window.addEventListener('resize', handleResize);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const timersRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const idCounter = useRef(0);
  const trailGradientId = useId();
  const prefersReducedMotion = useReducedMotion();

  const safeTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timersRef.current.delete(id);
      fn();
    }, ms);
    timersRef.current.add(id);
    return id;
  }, []);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current.clear();
  }, []);

  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  const getNextId = useCallback((prefix: string) => {
    idCounter.current += 1;
    return `${prefix}-${idCounter.current}-${Math.random().toString(36).slice(2, 7)}`;
  }, []);

  const currentStep = steps[currentStepIndex];

  const scrollToBottom = useCallback((smooth = true) => {
    if (!bottomRef.current) return;
    bottomRef.current.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'end',
    });
  }, []);

  useEffect(() => {
    if (!isExpanded || isCompleted) return;
    const timer = setTimeout(() => {
      scrollToBottom(true);
    }, 40);
    return () => clearTimeout(timer);
  }, [
    messages.length,
    currentStepIndex,
    isTyping,
    isExpanded,
    isCompleted,
    isReviewing,
    scrollToBottom,
  ]);

  useEffect(() => {
    if (isExpanded && !isReviewing) {
      const t = setTimeout(() => {
        chatInputRef.current?.focus();
      }, 260);
      return () => clearTimeout(t);
    }
  }, [isExpanded, currentStepIndex, isReviewing]);

  const triggerBotStep = useCallback(
    (nextStepIdx: number, currentAnswers: OnboardingAnswers) => {
      setIsTyping(true);

      safeTimeout(() => {
        setIsTyping(false);

        safeTimeout(() => {
          const stepObj = steps[nextStepIdx];
          if (!stepObj) return;

          const questionText =
            typeof stepObj.question === 'function'
              ? stepObj.question(currentAnswers)
              : stepObj.question;

          setMessages((prev) => [
            ...prev,
            {
              id: getNextId('bot'),
              sender: 'bot',
              text: questionText,
              stepIndex: nextStepIdx,
            },
          ]);

          setCurrentStepIndex(nextStepIdx);
          setSelectedMulti([]);
          onStepChange?.(nextStepIdx, stepObj);
        }, 50);
      }, 450);
    },
    [steps, safeTimeout, getNextId, onStepChange]
  );

  const showSummary = useCallback(
    (finalAnswers: OnboardingAnswers) => {
      setIsReviewing(true);
      setIsTyping(true);

      safeTimeout(() => {
        setIsTyping(false);
        safeTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: getNextId('bot-summary'),
              sender: 'bot',
              text: `You're all set, ${finalAnswers.name || 'builder'}! Review your workspace profile below before launching:`,
              stepIndex: steps.length,
              isSummary: true,
            },
          ]);
        }, 50);
      }, 400);
    },
    [steps.length, safeTimeout, getNextId]
  );

  const handleInitialSubmit = (nameToUse?: string) => {
    const rawVal = (nameToUse || initialInput).trim();
    if (!rawVal) return;

    const firstStep = steps[0];
    const stepId = firstStep?.id || 'name';

    if (firstStep?.validate) {
      const res = firstStep.validate(rawVal);
      if (typeof res === 'string' || res === false) return;
    }

    const newAnswers = { ...answers, [stepId]: rawVal };
    setAnswers(newAnswers);
    setIsExpanded(true);
    onExpandChange?.(true);

    setMessages([
      {
        id: getNextId('user'),
        sender: 'user',
        text: rawVal,
        stepIndex: 0,
      },
    ]);

    if (steps.length > 1) {
      triggerBotStep(1, newAnswers);
    } else {
      showSummary(newAnswers);
    }
  };

  const handleAnswer = useCallback(
    (answerText: string) => {
      const cleanText = answerText.trim();
      if (!cleanText || isTyping) return;
      if (!currentStep) return;

      if (currentStep.type === 'email' && !EMAIL_REGEX.test(cleanText)) {
        setInputError('Please enter a valid work email address');
        return;
      }
      if (currentStep.validate) {
        const valRes = currentStep.validate(cleanText);
        if (typeof valRes === 'string') {
          setInputError(valRes);
          return;
        }
        if (valRes === false) {
          setInputError('Invalid answer. Please try again.');
          return;
        }
      }

      setInputError(null);
      setChatInput('');

      const newAnswers = { ...answers, [currentStep.id]: cleanText };
      setAnswers(newAnswers);

      setMessages((prev) => [
        ...prev,
        {
          id: getNextId('user'),
          sender: 'user',
          text: cleanText,
          stepIndex: currentStepIndex,
        },
      ]);

      const nextIdx = currentStepIndex + 1;
      if (nextIdx < steps.length) {
        triggerBotStep(nextIdx, newAnswers);
      } else {
        showSummary(newAnswers);
      }
    },
    [
      currentStep,
      isTyping,
      answers,
      currentStepIndex,
      steps.length,
      getNextId,
      triggerBotStep,
      showSummary,
    ]
  );

  const isAllOfTheAboveOption = useCallback((opt: string) => {
    return /all of the above|all of above|above all/i.test(opt.trim());
  }, []);

  const isOtherOption = useCallback((opt: string) => {
    return opt.trim().toLowerCase() === 'other';
  }, []);

  const handleToggleMulti = useCallback(
    (option: string) => {
      if (!currentStep) return;
      const isAllAbove = isAllOfTheAboveOption(option);
      const allOptions = currentStep.options || [];
      const standardOptions = allOptions.filter(
        (o) => !isAllOfTheAboveOption(o) && !isOtherOption(o)
      );
      const allAboveOption = allOptions.find((o) => isAllOfTheAboveOption(o));

      setSelectedMulti((prev) => {
        if (isAllAbove) {
          const isCurrentlySelected = prev.includes(option);
          if (isCurrentlySelected) {
            // Uncheck "All of the above" and all standard options
            return prev.filter((o) => !isAllOfTheAboveOption(o) && !standardOptions.includes(o));
          } else {
            // Check "All of the above" and all standard options
            const otherSelected = prev.filter((o) => isOtherOption(o));
            return [...standardOptions, option, ...otherSelected];
          }
        } else {
          const isCurrentlySelected = prev.includes(option);
          let next: string[];
          if (isCurrentlySelected) {
            next = prev.filter((o) => o !== option);
            if (allAboveOption) {
              next = next.filter((o) => !isAllOfTheAboveOption(o));
            }
          } else {
            next = [...prev, option];
            if (
              allAboveOption &&
              standardOptions.length > 0 &&
              standardOptions.every((o) => next.includes(o))
            ) {
              if (!next.includes(allAboveOption)) {
                next.push(allAboveOption);
              }
            }
          }
          return next;
        }
      });
    },
    [currentStep, isAllOfTheAboveOption, isOtherOption]
  );

  const handleConfirmMulti = useCallback(
    (customOtherText?: string) => {
      if (selectedMulti.length === 0) return;
      const hasAllAbove = selectedMulti.some((item) => isAllOfTheAboveOption(item));
      const customOther = customOtherText?.trim();

      let answerStr: string;
      if (hasAllAbove) {
        const otherChecked = selectedMulti.some((item) => isOtherOption(item));
        if (otherChecked && customOther) {
          answerStr = `All of the above, ${customOther}`;
        } else {
          answerStr = 'All of the above';
        }
      } else {
        const finalItems = selectedMulti.map((item) => {
          if (isOtherOption(item) && customOther) {
            return customOther;
          }
          return item;
        });
        answerStr = finalItems.join(', ');
      }

      handleAnswer(answerStr);
    },
    [selectedMulti, handleAnswer, isAllOfTheAboveOption, isOtherOption]
  );

  /** Jump directly back to any specific step (accessible on every chat bubble & summary card) */
  const handleJumpToStep = useCallback(
    (targetStepIdx: number) => {
      if (targetStepIdx < 0 || targetStepIdx >= steps.length) return;

      // Rewind to initial pill
      if (targetStepIdx === 0) {
        setIsExpanded(false);
        onExpandChange?.(false);
        setIsReviewing(false);
        setMessages([]);
        setCurrentStepIndex(0);
        setInitialInput(answers[steps[0]?.id || 'name'] || initialInput);
        return;
      }

      setIsReviewing(false);
      setInputError(null);

      // Clean answers from targetStepIdx onwards
      setAnswers((prev) => {
        const nextAns = { ...prev };
        for (let i = targetStepIdx; i < steps.length; i++) {
          if (steps[i]) delete nextAns[steps[i].id];
        }
        return nextAns;
      });

      // Keep bot question for targetStepIdx, remove user answers for it and all subsequent messages
      setMessages((prev) =>
        prev.filter((m) => {
          if (m.isSummary) return false;
          if (m.stepIndex === undefined) return false;
          if (m.stepIndex < targetStepIdx) return true;
          if (m.stepIndex === targetStepIdx && m.sender === 'bot') return true;
          return false;
        })
      );

      setCurrentStepIndex(targetStepIdx);

      const targetStep = steps[targetStepIdx];
      if (targetStep?.type === 'multi-select') {
        const prevVal = answers[targetStep.id];
        setSelectedMulti(prevVal ? prevVal.split(', ').filter(Boolean) : []);
      } else {
        setSelectedMulti([]);
        if (targetStep?.type === 'email' || targetStep?.type === 'text') {
          setChatInput(answers[targetStep.id] || '');
        } else {
          setChatInput('');
        }
      }
    },
    [steps, answers, initialInput]
  );

  /** Step back 1 question */
  const handleBack = useCallback(() => {
    if (isReviewing) {
      handleJumpToStep(steps.length - 1);
      return;
    }
    if (currentStepIndex > 0) {
      handleJumpToStep(currentStepIndex - 1);
    }
  }, [isReviewing, currentStepIndex, steps.length, handleJumpToStep]);

  /** Skip current question if it is optional */
  const handleSkip = useCallback(() => {
    if (!currentStep || isTyping) return;
    setInputError(null);
    setChatInput('');
    setSelectedMulti([]);

    const newAnswers = { ...answers, [currentStep.id]: '' };
    setAnswers(newAnswers);

    setMessages((prev) => [
      ...prev,
      {
        id: getNextId('user'),
        sender: 'user',
        text: 'Skipped',
        stepIndex: currentStepIndex,
      },
    ]);

    const nextIdx = currentStepIndex + 1;
    if (nextIdx < steps.length) {
      triggerBotStep(nextIdx, newAnswers);
    } else {
      showSummary(newAnswers);
    }
  }, [
    currentStep,
    isTyping,
    answers,
    currentStepIndex,
    steps.length,
    getNextId,
    triggerBotStep,
    showSummary,
  ]);

  const handleFinalSubmit = useCallback(() => {
    onComplete?.(answers);
    setIsCompleted(true);
  }, [answers, onComplete]);

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    handleAnswer(chatInput);
  };

  const handleReset = useCallback(() => {
    clearAllTimers();
    setIsCompleted(false);
    setIsExpanded(false);
    onExpandChange?.(false);
    setIsReviewing(false);
    setInitialInput('');
    setChatInput('');
    setInputError(null);
    setIsTyping(false);
    setMessages([]);
    setCurrentStepIndex(0);
    setAnswers({});
    setSelectedMulti([]);
    onReset?.();
  }, [clearAllTimers, onReset, onExpandChange]);

  useImperativeHandle(
    ref,
    () => ({
      startWithName: (name: string) => {
        setInitialInput(name);
        handleInitialSubmit(name);
      },
      setInitialInput: (name: string) => {
        setInitialInput(name);
      },
      reset: () => {
        handleReset();
      },
    }),
    [handleInitialSubmit, handleReset]
  );

  const resolvedTitle = useMemo(() => {
    if (typeof completionTitle === 'function') return completionTitle(answers);
    if (completionTitle) return completionTitle;
    const name = answers.name || answers[steps[0]?.id || 'name'];
    return `Welcome to ${brandName}${name ? `, ${name}` : ''}!`;
  }, [completionTitle, answers, brandName, steps]);

  const summaryData = useMemo(() => {
    return { steps, answers };
  }, [steps, answers]);

  const targetCardHeight = useMemo(() => {
    if (!isExpanded) return 44;
    if (viewportHeight && viewportHeight < 560) {
      // When mobile virtual keyboard is open or viewport is short, constrain height
      // so the card + input fits comfortably in the visible space above the keyboard
      const maxAllowed = Math.max(220, viewportHeight - 75);
      return Math.min(expandedHeight, maxAllowed);
    }
    return expandedHeight;
  }, [isExpanded, viewportHeight, expandedHeight]);

  return (
    <div className={cn('relative flex w-full flex-col items-center justify-center p-1 sm:p-3', className)}>
      {/* Outside Celebration Welcome Header */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            key="welcome-header"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
            animate={{
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.45, delay: 1.65, ease: [0.16, 1, 0.3, 1] },
            }}
            exit={{
              opacity: 0,
              height: 0,
              marginBottom: 0,
              filter: 'blur(4px)',
              transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
            }}
            className="pointer-events-none z-10 mb-5 flex flex-col items-center text-center overflow-hidden"
          >
            <p className="text-xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
              {resolvedTitle}
            </p>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              {completionSubtitle}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Morphing Outer Card */}
      <motion.div
        animate={{
          width: isCompleted ? 72 : '100%',
          maxWidth: isCompleted ? 72 : isExpanded ? 410 : 380,
          height: isCompleted ? 72 : targetCardHeight,
          borderRadius: 16,
        }}
        transition={{
          duration: 0.38,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={cn(
          'relative w-full max-h-[calc(100dvh-75px)] sm:max-h-none rounded-2xl overflow-hidden transition-[background-color,box-shadow,border-color] duration-300',
          isCompleted
            ? 'flex items-center justify-center overflow-visible bg-transparent shadow-none ring-0'
            : 'bg-white shadow-sm ring-1 shadow-black/10 ring-black/10 dark:bg-neutral-900 dark:ring-1 dark:shadow-white/10 dark:ring-white/10',
          !isCompleted && !isExpanded
            ? ''
            : !isCompleted
              ? 'flex flex-col'
              : ''
        )}
      >
        <AnimatePresence initial={false}>
          {isCompleted ? (
            /* Completed celebration state */
            <motion.button
              type="button"
              key="completed-dot"
              onClick={handleReset}
              aria-label="Onboarding completed. Click to restart"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                scale: 0.9,
                filter: 'blur(3px)',
                transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
              }}
              className="relative flex h-[72px] w-[72px] cursor-pointer items-center justify-center rounded-2xl outline-none select-none focus-visible:ring-2 focus-visible:ring-offset-2"
              title="Click to restart onboarding"
            >
              {/* Check Box Background */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 16, stiffness: 220, delay: 1.55 }}
                className="absolute inset-0 rounded-2xl bg-white shadow-sm ring-1 shadow-black/10 ring-black/10 transition-transform hover:scale-105 active:scale-95 dark:bg-neutral-900 dark:ring-1 dark:shadow-white/10 dark:ring-white/10"
              />

              {/* Comet Paintbrush Dot Sweeps 360° Orbit */}
              <motion.div
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{
                  rotate: [-90, 270],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  rotate: { duration: 0.65, delay: 0.22, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.65, delay: 0.22, times: [0, 0.15, 0.85, 1] },
                }}
              >
                <svg className="h-full w-full" viewBox="0 0 72 72" aria-hidden="true">
                  <defs>
                    <linearGradient id={trailGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={successColor} stopOpacity="0" />
                      <stop offset="55%" stopColor={successColor} stopOpacity="0.5" />
                      <stop offset="100%" stopColor={successColor} stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 23.5 14.35 A 25 25 0 0 1 61 36"
                    fill="none"
                    stroke={`url(#${trailGradientId})`}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <circle cx="61" cy="36" r="2.2" fill={successColor} />
                </svg>
              </motion.div>

              {/* Celebration Burst Lines */}
              <svg
                className="pointer-events-none absolute -inset-9 h-[144px] w-[144px] overflow-visible"
                viewBox="0 0 144 144"
                aria-hidden="true"
              >
                {Array.from({ length: 16 }).map((_, i) => {
                  const angle = -90 + (i * 360) / 16;
                  const rad = (angle * Math.PI) / 180;
                  const isBig = i % 2 === 0;
                  const r1 = 32;
                  const r2 = isBig ? 50 : 41;
                  const x1 = 72 + r1 * Math.cos(rad);
                  const y1 = 72 + r1 * Math.sin(rad);
                  const x2 = 72 + r2 * Math.cos(rad);
                  const y2 = 72 + r2 * Math.sin(rad);

                  return (
                    <motion.line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={successColor}
                      strokeWidth={isBig ? '1.8' : '1.2'}
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{
                        pathLength: [0, 1, 0.4],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 0.65,
                        delay: 1.05 + (i / 16) * 0.22,
                        ease: [0.16, 1, 0.3, 1],
                        times: [0, 0.4, 1],
                      }}
                    />
                  );
                })}
              </svg>

              {/* Checkmark drawing */}
              <motion.div
                initial={{ opacity: 0, scale: 0.65, rotate: -8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  opacity: { duration: 0.15, delay: 0.82 },
                  scale: { type: 'spring', damping: 11, stiffness: 220, delay: 0.95 },
                  rotate: { type: 'spring', damping: 12, stiffness: 200, delay: 0.95 },
                }}
                className="pointer-events-none relative z-10 flex items-center justify-center"
              >
                <motion.div
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : {
                          y: [0, -1.8, 0, 1.2, 0],
                          rotate: [0, -1.5, 0, 1.5, 0],
                        }
                  }
                  transition={{
                    duration: 3.2,
                    repeat: 3,
                    ease: 'easeInOut',
                    delay: 2.1,
                  }}
                  className="flex items-center justify-center"
                >
                  <svg
                    viewBox="0 0 72 72"
                    fill="none"
                    className="h-[72px] w-[72px]"
                    aria-hidden="true"
                  >
                    <motion.path
                      d="M 26 36 L 33 43 L 47 29"
                      fill="none"
                      stroke={successColor}
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.82,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                  </svg>
                </motion.div>
              </motion.div>
            </motion.button>
          ) : !isExpanded ? (
            /* Initial compact pill state */
            <motion.div
              key="initial-pill"
              initial={{ opacity: 0, filter: 'blur(3px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.28, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-20 flex h-[44px] items-center p-1.5"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center pl-1 select-none">
                {logo || <DefaultBrandLogo color={accentColor} />}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleInitialSubmit();
                }}
                className="flex w-full flex-1 items-center"
              >
                <input
                  type="text"
                  value={initialInput}
                  onChange={(e) => setInitialInput(e.target.value)}
                  onFocus={(e) => {
                    setTimeout(() => {
                      e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 100);
                  }}
                  placeholder={initialPlaceholder || steps[0]?.placeholder || "What's your name?"}
                  aria-label={initialPlaceholder || steps[0]?.placeholder || "What's your name?"}
                  maxLength={120}
                  className="w-full bg-transparent px-2.5 py-1.5 text-base font-medium text-neutral-900 outline-none placeholder:text-neutral-400 focus-visible:ring-0 sm:text-xs dark:text-neutral-100 dark:placeholder:text-neutral-500"
                  autoFocus={autoFocus}
                />

                <button
                  type="submit"
                  aria-label="Continue"
                  disabled={!initialInput.trim()}
                  style={initialInput.trim() ? { backgroundColor: accentColor } : undefined}
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-offset-1',
                    initialInput.trim()
                      ? 'cursor-pointer text-white shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.45),inset_0_0_10px_0_rgba(255,255,255,0.25)] hover:opacity-95 active:scale-95'
                      : 'cursor-not-allowed bg-neutral-200 text-neutral-400 opacity-60 shadow-none dark:bg-neutral-800 dark:text-neutral-600'
                  )}
                  title="Continue"
                >
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </button>
              </form>
            </motion.div>
          ) : (
            /* Expanded chat conversation state */
            <motion.div
              key="chat-window"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.35, ease: 'easeOut' } }}
              transition={{ duration: 0.25, ease: 'easeOut', delay: 0.05 }}
              className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 shadow-black/10 ring-black/10 dark:bg-neutral-900 dark:ring-1 dark:shadow-white/10 dark:ring-white/10"
            >
              {/* Header with Back, Logo & Reset */}
              <div className="relative z-20 flex shrink-0 items-center justify-between px-3.5 py-3">
                <div className="flex items-center gap-1.5 select-none">
                  {(currentStepIndex > 0 || isReviewing) && (
                    <button
                      type="button"
                      onClick={handleBack}
                      aria-label="Go to previous step"
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-neutral-400 transition-colors outline-none hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-400 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                      title="Go back"
                    >
                      <ArrowLeftIcon className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <div className="flex h-6 w-6 items-center justify-center">
                    {logo || <DefaultBrandLogo className="h-4.5 w-4.5" color={accentColor} />}
                  </div>
                  <span className="text-[12.5px] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                    {brandName}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Reset conversation"
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-neutral-400 transition-colors outline-none select-none hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-400 dark:text-neutral-500 dark:hover:bg-neutral-800/80 dark:hover:text-neutral-100"
                  title="Reset conversation"
                >
                  <RefreshIcon className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Top Smooth Fade Mask */}
              <div className="pointer-events-none absolute top-[44px] right-0 left-0 z-10 h-6 bg-gradient-to-b from-white via-white/80 to-transparent dark:from-neutral-900 dark:via-neutral-900/80" />

              {/* Chat Message Stream */}
              <div
                ref={scrollRef}
                role="log"
                aria-live="polite"
                aria-label="Onboarding chat log"
                style={{
                  maskImage: 'linear-gradient(to bottom, transparent 0px, black 24px, black 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to bottom, transparent 0px, black 24px, black 100%)',
                }}
                className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-3.5 pt-4 pb-3 text-xs [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                <AnimatePresence initial={false}>
                  {messages.map((msg) => {
                    const isCurrentActiveStep =
                      !isReviewing &&
                      !isTyping &&
                      msg.stepIndex === currentStepIndex &&
                      msg.sender === 'bot';
                    const activeStepObj = isCurrentActiveStep ? currentStep : undefined;
                    const isOptional = Boolean(
                      msg.stepIndex !== undefined && steps[msg.stepIndex]?.optional
                    );

                    return (
                      <ChatMessageItem
                        key={msg.id}
                        msg={msg}
                        activeStep={activeStepObj}
                        selectedMulti={selectedMulti}
                        onToggleMulti={handleToggleMulti}
                        onConfirmMulti={handleConfirmMulti}
                        onSelectOption={handleAnswer}
                        onSkip={handleSkip}
                        onJumpToStep={handleJumpToStep}
                        accentColor={accentColor}
                        summaryData={msg.isSummary ? summaryData : undefined}
                        isOptional={isOptional}
                      />
                    );
                  })}
                </AnimatePresence>

                {/* Smooth Wave Typing Indicator */}
                <AnimatePresence mode="wait">
                  {isTyping && (
                    <motion.div
                      key="typing-indicator"
                      role="status"
                      aria-label={`${brandName} is typing`}
                      initial={{ opacity: 0, y: 3, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{
                        opacity: 0,
                        y: -2,
                        scale: 0.95,
                        transition: { duration: 0.18, ease: 'easeOut' },
                      }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="flex w-fit shrink-0 items-center gap-1.5 rounded-2xl rounded-bl-sm bg-neutral-100 px-3 py-2 select-none dark:bg-neutral-800"
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={
                            prefersReducedMotion
                              ? undefined
                              : {
                                  opacity: [0.35, 1, 0.35],
                                  scale: [0.85, 1.15, 0.85],
                                  y: [0, -2, 0],
                                }
                          }
                          transition={{
                            duration: 1.15,
                            repeat: Infinity,
                            delay: i * 0.16,
                            ease: 'easeInOut',
                          }}
                          className="h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500"
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Smooth Bottom Auto-Scroll Anchor */}
                <div ref={bottomRef} className="h-px w-full shrink-0" />
              </div>

              {/* Bottom Action Area: Review Confirmation Bar OR Chat Input */}
              {isReviewing ? (
                /* Review Confirmation Bar */
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="flex w-full shrink-0 items-center gap-2 p-3 pt-1"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={handleBack}
                    className="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-100 px-3.5 text-xs font-medium text-neutral-700 transition-colors outline-none select-none hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  >
                    <ArrowLeftIcon className="h-3.5 w-3.5 shrink-0" />
                    <span className="shrink-0">Back</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleFinalSubmit}
                    style={{ backgroundColor: accentColor }}
                    className="flex h-10 flex-1 min-w-0 cursor-pointer items-center justify-center gap-2 rounded-full px-4 text-xs font-semibold text-white shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.45),inset_0_0_10px_0_rgba(255,255,255,0.25)] transition-all outline-none select-none hover:opacity-95 focus-visible:ring-2 focus-visible:ring-offset-1"
                  >
                    <span className="truncate">{confirmButtonText}</span>
                    <ArrowRightIcon className="h-3.5 w-3.5 shrink-0" />
                  </motion.button>
                </motion.div>
              ) : (
                /* Chat Input (Only shown during active typing steps) */
                <div className="shrink-0 p-3 pt-1">
                  <form onSubmit={handleSendChat} className="flex items-center gap-2">
                    <div className="relative flex h-10 flex-1 items-center rounded-full border border-neutral-200/90 bg-neutral-50 px-3.5 shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,0.85)] transition-all dark:border-neutral-700/80 dark:bg-neutral-800/40 dark:shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,0.06)]">
                      <input
                        ref={chatInputRef}
                        type={currentStep?.type === 'email' ? 'email' : 'text'}
                        autoComplete={currentStep?.type === 'email' ? 'email' : 'off'}
                        value={chatInput}
                        onChange={(e) => {
                          setChatInput(e.target.value);
                          if (inputError) setInputError(null);
                        }}
                        onFocus={(e) => {
                          setTimeout(() => {
                            e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            scrollToBottom(true);
                          }, 100);
                        }}
                        disabled={isTyping || currentStep?.type === 'multi-select'}
                        placeholder={
                          isTyping
                            ? `${brandName} is typing...`
                            : currentStep?.type === 'multi-select'
                              ? 'Select options above to continue...'
                              : currentStep?.placeholder || 'Type your answer...'
                        }
                        aria-label={currentStep?.placeholder || 'Type your answer'}
                        maxLength={256}
                        className="w-full bg-transparent text-base leading-none font-medium text-neutral-900 outline-none placeholder:text-neutral-400 disabled:opacity-50 sm:text-xs dark:text-neutral-100 dark:placeholder:text-neutral-500"
                      />
                    </div>

                    <AnimatePresence>
                      {currentStep?.optional && (
                        <motion.button
                          key="skip-btn"
                          initial={{ opacity: 0, scale: 0.92, x: 6 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.92, x: 6 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={handleSkip}
                          className="h-10 shrink-0 cursor-pointer rounded-full px-3 text-xs font-medium text-neutral-400 transition-colors outline-none select-none hover:text-neutral-700 focus-visible:ring-1 dark:hover:text-neutral-200"
                        >
                          Skip
                        </motion.button>
                      )}
                    </AnimatePresence>

                    <motion.button
                      layout
                      whileHover={
                        !isTyping && currentStep?.type !== 'multi-select' && chatInput.trim()
                          ? { scale: 1.05 }
                          : undefined
                      }
                      whileTap={
                        !isTyping && currentStep?.type !== 'multi-select' && chatInput.trim()
                          ? { scale: 0.93 }
                          : undefined
                      }
                      type="submit"
                      aria-label="Submit answer"
                      disabled={
                        isTyping || currentStep?.type === 'multi-select' || !chatInput.trim()
                      }
                      style={
                        !isTyping && currentStep?.type !== 'multi-select' && chatInput.trim()
                          ? { backgroundColor: accentColor }
                          : undefined
                      }
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-offset-1',
                        !isTyping && currentStep?.type !== 'multi-select' && chatInput.trim()
                          ? 'cursor-pointer text-white shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.45),inset_0_0_10px_0_rgba(255,255,255,0.25)] hover:opacity-95'
                          : 'cursor-not-allowed bg-neutral-200 text-neutral-400 opacity-60 shadow-none dark:bg-neutral-800 dark:text-neutral-600'
                      )}
                      title="Submit"
                    >
                      <ArrowRightIcon className="h-3.5 w-3.5" />
                    </motion.button>
                  </form>

                  {/* Inline Validation Error Message */}
                  <AnimatePresence>
                    {inputError && (
                      <motion.p
                        role="alert"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="px-3 pt-1.5 text-[11px] font-medium text-rose-500 dark:text-rose-400"
                      >
                        {inputError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  );
});

// Default export kept for lab registry preview compatibility
export default function ChatOnboardingDemo() {
  return (
    <div className="flex min-h-[560px] w-full items-center justify-center p-1 sm:p-4">
      <ChatOnboarding
        brandName="Shit AI"
        accentColor="#3074fe"
        onComplete={(answers) => {
          // Send to your backend API or database
        }}
      />
    </div>
  );
}
