'use client';

import React, { useState, useEffect } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark, vs } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useTheme } from 'next-themes';

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

interface DocInstallationProps {
  cliCommand?: string;
  name?: string;
}

function sanitizeSlug(raw?: string): string {
  if (!raw) return 'component';
  return raw
    .replace(/^https?:\/\/[^\/]+\/r\//, '')
    .replace(/\.json$/, '')
    .replace(/^(npx|pnpm dlx|yarn dlx|bunx|bunx --bun)\s+(shadcn@latest|shadcn|rareui|shitui)\s+add\s+(@shitui\/)?/, '')
    .replace(/^@shitui\//, '')
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

export function DocInstallation({ cliCommand, name }: DocInstallationProps) {
  const [activeTab, setActiveTab] = useState<'npm' | 'pnpm' | 'bun' | 'yarn'>('npm');
  const [copied, setCopied] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  // Derive clean slug (e.g. liquid-button, book-3d)
  const slug = sanitizeSlug(cliCommand) !== 'component' ? sanitizeSlug(cliCommand) : sanitizeSlug(name);

  const commands: Record<'npm' | 'pnpm' | 'bun' | 'yarn', string> = {
    npm: `npx shadcn@latest add https://shitui.in/r/${slug}.json`,
    pnpm: `pnpm dlx shadcn@latest add https://shitui.in/r/${slug}.json`,
    bun: `bunx --bun shadcn@latest add https://shitui.in/r/${slug}.json`,
    yarn: `yarn dlx shadcn@latest add https://shitui.in/r/${slug}.json`,
  };

  const currentCommand = commands[activeTab];

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(currentCommand);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy command:', err);
    }
  };

  return (
    <section className="flex flex-col gap-3">
      <h2
        id="installation"
        className="font-medium text-lg sm:text-xl tracking-tight text-foreground scroll-m-20"
      >
        Installation
      </h2>

      <div className="relative overflow-hidden rounded-lg border border-border/60 bg-muted/20 dark:bg-neutral-900/30 shadow-pill-inset">
        {/* Tabs header */}
        <div className="flex items-center justify-between border-b border-border/50 bg-muted dark:bg-neutral-900/50 px-3 py-1">
          <div className="flex items-center gap-1">
            {(['npm', 'pnpm', 'bun', 'yarn'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'rounded-md px-3 py-1 text-xs font-mono font-medium transition-all duration-150 cursor-pointer',
                  activeTab === tab
                    ? 'bg-background text-foreground shadow-pill-inset border-2 border-muted'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            title={copied ? 'Copied' : 'Copy command'}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/60 active:scale-95 cursor-pointer"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Command line content */}
        <div className="flex items-center px-4 py-3 font-mono text-xs text-foreground overflow-x-auto select-all scrollbar-none">
          <span className="text-muted-foreground/60 mr-2 select-none shrink-0">$</span>
          <div className="flex-1 min-w-0">
            <SyntaxHighlighter
              language="bash"
              style={isDark ? materialDarkClean : vsClean}
              customStyle={{
                margin: 0,
                padding: 0,
                background: 'transparent',
                fontSize: '0.75rem',
                lineHeight: '1.5',
                fontFamily: 'var(--font-mono, monospace)',
                display: 'inline-block',
                whiteSpace: 'nowrap',
              }}
            >
              {currentCommand}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DocInstallation;
