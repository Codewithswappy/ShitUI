'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark, vs } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useTheme } from 'next-themes';

// Clean background colors from syntax highlighter themes so it blends seamlessly
const cleanTheme = (theme: any) => {
  const newTheme = { ...theme };
  Object.keys(newTheme).forEach((key) => {
    if (newTheme[key]?.background) delete newTheme[key].background;
    if (newTheme[key]?.backgroundColor) delete newTheme[key].backgroundColor;
  });
  return newTheme;
};

const vsClean = cleanTheme(vs);
const materialDarkClean = cleanTheme(materialDark);

export interface UsageStep {
  title: string;
  description?: string;
  code: string;
}

export interface DocUsageGuideProps {
  steps?: UsageStep[];
  title?: string;
}

function CodeCard({ step, index }: { step: UsageStep; index: number }) {
  const [copied, setCopied] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(step.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/15 dark:bg-neutral-900/25 overflow-hidden shadow-pill-inset">
      {/* Step Header */}
      <div className="flex items-center justify-between border-b border-border/40 bg-muted/25 dark:bg-neutral-900/40 px-3.5 py-1">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex  shrink-0 items-center justify-center  text-[10px] font-mono font-bold text-primary">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-xs sm:text-sm font-medium text-foreground tracking-tight truncate">
            {step.title}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          title={copied ? 'Copied' : 'Copy code'}
          className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/60 active:scale-95 cursor-pointer shrink-0"
        >
          {copied ? (
            <Check className="h-3 w-3 text-emerald-500" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </button>
      </div>

      {step.description && (
        <p className="px-3.5 pt-1 text-xs text-muted-foreground leading-relaxed">
          {step.description}
        </p>
      )}

      {/* Code Container */}
      <div className="overflow-x-auto px-3.5 pb-3 pt-1 text-xs font-mono scrollbar-thin">
        <SyntaxHighlighter
          language="tsx"
          style={isDark ? materialDarkClean : vsClean}
          wrapLines
          customStyle={{
            margin: 0,
            padding: 0,
            background: 'transparent',
            fontSize: '0.75rem',
            lineHeight: '1.6',
            fontFamily: 'var(--font-mono, monospace)',
          }}
        >
          {step.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export function DocUsageGuide({ steps, title = 'How to use' }: DocUsageGuideProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2
        id="how-to-use"
        className="font-medium text-lg sm:text-xl tracking-tight text-foreground scroll-m-20"
      >
        {title}
      </h2>

      <div className="flex flex-col gap-3.5">
        {steps.map((step, index) => (
          <CodeCard key={index} step={step} index={index} />
        ))}
      </div>
    </section>
  );
}

export default DocUsageGuide;
