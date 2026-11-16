'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { HeroCard } from './HeroCard';
import { ShowcaseCard } from './ShowcaseCard';
import {
  SHOWCASE_REGISTRY,
  ShowcaseComponent,
  getSortedShowcaseItems,
} from './showcase.config';

// Export for backward compatibility with consumers like SearchModal / NewLandingPage
export const ALL_SHOWCASE_ITEMS: ShowcaseComponent[] = SHOWCASE_REGISTRY;

interface CuratedGalleryProps {
  activeCategory: string;
}

export function CuratedGallery({ activeCategory }: CuratedGalleryProps) {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Filter & sort items based on active category and user-configured order
  const filteredItems = useMemo(() => {
    return getSortedShowcaseItems(activeCategory);
  }, [activeCategory]);

  // "Surprise me" feature
  const handleSurpriseMe = useCallback(() => {
    if (filteredItems.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredItems.length);
    const chosen = filteredItems[randomIndex];
    setHighlightedId(chosen.id);

    const el = document.getElementById(`card-${chosen.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    setTimeout(() => {
      setHighlightedId(null);
    }, 2500);
  }, [filteredItems]);

  return (
    <section className="mx-auto w-full max-w-[1700px] px-4 py-6 sm:px-6 lg:px-8">
      {/* Full width Hero Card across top */}
      <HeroCard
        onSurpriseMe={handleSurpriseMe}
        componentCount={SHOWCASE_REGISTRY.length}
      />

      {/* Horizontal Grid Layout: 1 col mobile, 2 sm, 3 md, 4 lg */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-stretch">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <div
              id={`card-${item.id}`}
              key={item.id}
              className="flex w-full"
            >
              <ShowcaseCard
                item={item}
                index={index}
                isHighlighted={highlightedId === item.id}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
