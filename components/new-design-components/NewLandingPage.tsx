'use client';

import React, { useState, useEffect } from 'react';
import { TopNavigation } from './TopNavigation';
import { CuratedGallery } from './CuratedGallery';
import { SponsorsSection } from './SponsorsSection';
import { Testimonials } from './Testimonials';
import { NewFooter } from './NewFooter';
import { useSearchContext } from './search-context';

export function NewLandingPage() {
  const [stars, setStars] = useState<number | null>(null);
  const { setOpenSearch } = useSearchContext();

  useEffect(() => {
    let isMounted = true;
    fetch('https://api.github.com/repos/Codewithswappy/RareUI')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && typeof data.stargazers_count === 'number') {
          setStars(data.stargazers_count);
        }
      })
      .catch((err) => {
        console.error('Error fetching stars:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-background font-sans text-foreground transition-colors selection:bg-primary/20 selection:text-primary">
      {/* 1. Top Brand Header with integrated pill navigation (Sponsors, Changelog, Search) & theme toggle */}
      <TopNavigation
        starsCount={stars}
        onOpenSearch={() => setOpenSearch(true)}
      />

      {/* 2. Main Multi-column Curated Showcase Gallery with Hero Card */}
      <main className="w-full">
        <CuratedGallery activeCategory="all" />
      </main>

      {/* 3. Community Testimonials Wall */}
      <Testimonials />

      {/* 4. Bento Sponsors & Backers Showcase */}
      <SponsorsSection />

      {/* 5. Elegant Minimal Footer with built-in Gradual Blur */}
      <NewFooter />
    </div>
  );
}
export default NewLandingPage;
