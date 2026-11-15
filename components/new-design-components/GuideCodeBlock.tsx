'use client';

import React, { useState, useRef } from 'react';
import { Check, Copy } from 'lucide-react';

export function GuideCodeBlock({ children, ...props }: any) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    try {
      const text = preRef.current?.innerText || '';
      if (text && navigator?.clipboard) {
        await navigator.clipboard.writeText(text.replace(/^\$\s+/, ''));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="relative rounded-lg border border-border/60 bg-muted/15 dark:bg-neutral-900/30 overflow-hidden shadow-pill-inset p-1">
      <div className="flex items-center justify-between border-b border-border/40 bg-muted/25 dark:bg-neutral-900/40 px-3.5 ">
        <div className="flex items-center gap-1">
          <span className="h-1 w-1 rounded-full bg-border/80" />
          <span className="h-1 w-1 rounded-full bg-border/80" />
          <span className="h-1 w-1 rounded-full bg-border/80" />
        </div>
        <button
          type="button"
          onClick={handleCopy}
          title={copied ? 'Copied' : 'Copy code'}
          className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/60 active:scale-95 cursor-pointer"
        >
          {copied ? (
            <Check className="h-3 w-3 text-emerald-500" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </button>
      </div>
      <pre
        ref={preRef}
        className="overflow-x-auto p-3.5 font-mono text-xs leading-relaxed text-foreground scrollbar-thin"
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}

export default GuideCodeBlock;
