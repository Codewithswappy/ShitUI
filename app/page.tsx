import type { Metadata } from 'next';
import { SmoothScroll } from '@/components/new-design-components';
import { NewLandingPage } from '@/components/new-design-components/NewLandingPage';

export const metadata: Metadata = {
  title: 'ShitUI - Animated React Components Library',
  description:
    'Free & open-source animated React UI components built with Tailwind CSS and Motion. Copy-paste ready with official Shadcn CLI support.',
};

export default function HomePage() {
  return (
    <SmoothScroll>
      <main className="relative w-full pt-0 md:pt-0">
        <NewLandingPage />
      </main>
    </SmoothScroll>
  );
}
