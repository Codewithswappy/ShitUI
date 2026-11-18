'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { LAB_DRAFTS } from './registry';
import Link from 'next/link';
import { Sun, Moon, ArrowLeft } from 'lucide-react';
import { useTheme } from 'next-themes';

export function PlainComponentView() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { theme, setTheme } = useTheme();

  const draft = LAB_DRAFTS.find((d) => d.id === id) || LAB_DRAFTS[0];

  if (!draft) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-white dark:bg-neutral-950">
        <h1 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
          Component Not Found
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          No lab draft was found matching ID: <code className="font-mono">{id}</code>
        </p>
        <Link
          href="/lab"
          className="mt-4 rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-white shadow-pill-glow"
        >
          Return to Lab
        </Link>
      </div>
    );
  }

  const ComponentToRender = draft.component;

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-white p-6 transition-colors duration-200 dark:bg-neutral-950 sm:p-12">
      {/* 100% Plain isolated render of the component without any extra tools */}
      <ComponentToRender />

      {/* Subtle, non-intrusive bottom corner controls */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1 rounded-full border border-black/5 bg-white/80 p-1 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/80 select-none">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 transition-colors"
          title="Toggle Dark / Light Theme"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-3.5 w-3.5 text-amber-500" />
          ) : (
            <Moon className="h-3.5 w-3.5 text-blue-500" />
          )}
        </button>

        <Link
          href="/lab"
          className="flex h-7 items-center gap-1 rounded-full px-2.5 text-[11px] font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
          title="Back to Lab Workbench"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>Lab</span>
        </Link>
      </div>
    </div>
  );
}
