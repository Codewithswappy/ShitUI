'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { HeroCard } from './HeroCard';
import { ShowcaseCard } from './ShowcaseCard';
import { SHOWCASE_REGISTRY, ShowcaseComponent } from './showcase.config';

// Export for backward compatibility with consumers like SearchModal / NewLandingPage
export const ALL_SHOWCASE_ITEMS: ShowcaseComponent[] = SHOWCASE_REGISTRY;

interface CuratedGalleryProps {
  activeCategory: string;
}

export function CuratedGallery({ activeCategory }: CuratedGalleryProps) {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    if (activeCategory === 'all' || activeCategory === 'home') {
      return SHOWCASE_REGISTRY.filter((item) => item.showOnHome);
    }
    return SHOWCASE_REGISTRY.filter((item) => item.category === activeCategory);
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

      {/* Masonry Layout: columns-1 sm:columns-2 md:columns-3 lg:columns-4 */}
      <div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4 [column-fill:_balance]">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <div
              id={`card-${item.id}`}
              key={item.id}
              className="break-inside-avoid mb-4 inline-block w-full"
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
