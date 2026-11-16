'use client';

import React, { useState, useEffect } from 'react';
import InteractiveContactButton from '@/components/shitui/InteractiveContactButton';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export function InteractiveContactButtonDemo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted && resolvedTheme === 'light' ? 'light' : 'dark';

  return (
    <div
      className={cn(
        'relative w-full h-full min-h-[460px] sm:min-h-[480px] flex items-start justify-center pt-14 pb-20 transition-colors duration-300 select-none overflow-visible',
        currentTheme === 'light' ? 'bg-neutral-100' : 'bg-neutral-900'
      )}
    >
      <InteractiveContactButton
        name="Swapnil Kalambe"
        role="Web Designer & Founder"
        email="heyyswap@gmail.com"
        avatarUrl="https://images.unsplash.com/photo-1728577740843-5f29c7586afe?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
        availableForWork={true}
        statusText="Available for work"
        bookingUrl="https://cal.com"
        buttonText="Contact"
        buttonHoverText="Let's Talk"
        theme={currentTheme}
        cardPosition="bottom-center"
      />
    </div>
  );
}

export default InteractiveContactButtonDemo;
