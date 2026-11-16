'use client';

import React, { useRef, useState, useEffect } from 'react';
import DynamicIslandNav from '@/components/shitui/DynamicIslandNav';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'showcase', label: 'Showcase' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export function DynamicIslandNavDemo() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted && resolvedTheme === 'light' ? 'light' : 'dark';

  return (
    <div
      className={cn(
        'relative w-full h-full flex flex-col overflow-hidden transition-colors duration-300 select-none',
        currentTheme === 'light' ? 'bg-neutral-100' : 'bg-neutral-900'
      )}
    >
      {/* Full-coverage scrollable container */}
      <div
        ref={scrollRef}
        className="relative flex-1 w-full overflow-y-auto scroll-smooth"
      >
        {/* Sticky Dynamic Island Navigation */}
        <div className="sticky top-4 z-40 w-full flex justify-center pointer-events-none px-4">
          <DynamicIslandNav
            theme={currentTheme}
            scrollContainerRef={scrollRef}
            compactOnScroll={true}
            scrollOffset={40}
            containerClassName="relative top-0 left-auto right-auto z-auto pointer-events-auto"
          />
        </div>

        {/* Big centered text for each section matching reference image */}
        <div className="pt-10 pb-48">
          {SECTIONS.map((sec) => (
            <section
              key={sec.id}
              id={sec.id}
              data-section={sec.id}
              className="min-h-[75vh] flex items-center justify-center scroll-mt-24"
            >
              <h2
                className={cn(
                  'text-5xl sm:text-7xl md:text-8xl font-medium tracking-tight select-none transition-colors duration-300',
                  currentTheme === 'light'
                    ? 'text-neutral-300/80'
                    : 'text-neutral-700/80'
                )}
              >
                {sec.label}
              </h2>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DynamicIslandNavDemo;
