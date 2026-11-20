'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatOnboarding, type ChatOnboardingRef } from '@/components/shitui/ChatOnboarding';

export function ChatOnboardingDemo() {
  const onboardingRef = useRef<ChatOnboardingRef>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex w-full h-full flex-col items-center justify-center py-1 sm:py-2 px-1 sm:px-3 select-none">
      <ChatOnboarding
        ref={onboardingRef}
        brandName="Shit AI"
        accentColor="#3074fe"
        expandedHeight={410}
        onExpandChange={setIsExpanded}
        onReset={() => setIsExpanded(false)}
        onComplete={(answers) => {
          console.log('Onboarding answers submitted:', answers);
        }}
      />

      {/* Interactive Try Suggestions for Preview */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.18 }}
            className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5 select-none"
          >
            <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500">
              Try:
            </span>
            {['Alex Rivera', 'Sarah Chen', 'Jordan Lee'].map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => onboardingRef.current?.startWithName(name)}
                className="cursor-pointer rounded-sm bg-white px-2 py-0.5 text-[10px] font-medium text-neutral-700 shadow-xs ring-1 shadow-black/10 ring-black/10 transition-colors outline-none hover:bg-neutral-50 focus-visible:ring-1 focus-visible:ring-neutral-400 dark:bg-neutral-800 dark:text-neutral-300 dark:shadow-xs dark:ring-1 dark:shadow-white/5 dark:ring-white/5 dark:hover:bg-neutral-700"
              >
                {name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChatOnboardingDemo;
