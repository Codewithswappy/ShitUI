'use client';

import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CopyMarkdownButtonProps {
  rawMarkdown: string;
  className?: string;
}

export function CopyMarkdownButton({ rawMarkdown, className }: CopyMarkdownButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard && rawMarkdown) {
        await navigator.clipboard.writeText(rawMarkdown);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy markdown:', err);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      title="Copy page as Markdown"
      aria-label="Copy page as Markdown"
      className={cn(
        'group flex items-center gap-1.5 py-1 px-1.5 font-mono text-xs font-semibold text-foreground/80 hover:text-foreground transition-colors cursor-pointer bg-transparent border-0 select-none drop-shadow-xs',
        className
      )}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="copied-markdown-state"
            initial={{ opacity: 0, filter: 'blur(4px)', scale: 0.85 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(4px)', scale: 0.85 }}
            transition={{ duration: 0.16 }}
            className="flex items-center gap-1 text-emerald-500 font-mono text-[11px]"
          >
            <Check className="h-3.5 w-3.5" />
            <span className="tracking-tight">Copied Markdown</span>
          </motion.div>
        ) : (
          <motion.div
            key="idle-markdown-state"
            initial={{ opacity: 0, filter: 'blur(4px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.16 }}
            className="flex items-center gap-1.5"
          >
            <FileText className="h-3.5 w-3.5 text-muted-foreground/80 transition-transform duration-200 group-hover:text-foreground group-hover:scale-110" />
            <span className="tracking-tight">Copy Markdown</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default CopyMarkdownButton;
