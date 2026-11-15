import type { Metadata } from 'next';
import { SmoothScroll } from '@/components/new-design-components';
import { NewLandingPage } from '@/components/new-design-components/NewLandingPage';

export const metadata: Metadata = {
  title: 'ShitUI (Formerly RareUI) - Premium React UI Components Library | Free & Open Source',
  description:
    'ShitUI (formerly RareUI) is a free & open-source React UI component library built with Tailwind CSS, Next.js, and Framer Motion. 100+ high-performance animated components with official Shadcn CLI support.',
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
