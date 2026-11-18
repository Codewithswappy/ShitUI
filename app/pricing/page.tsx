import React from 'react';
import { Metadata } from 'next';
import { TopNavigation } from '@/components/new-design-components/TopNavigation';
import { NewFooter } from '@/components/new-design-components/NewFooter';
import { PricingPageContent } from '@/components/new-design-components/PricingPageContent';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Simple, transparent sponsorship pricing. Put your brand directly in front of thousands of active front-end builders, designers, and developers.',
};

export default function PricingPage() {
  return (
    <div className="relative min-h-screen w-full bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary">
      <TopNavigation />
      <PricingPageContent />
      <NewFooter />
    </div>
  );
}
