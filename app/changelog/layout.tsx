import { Metadata } from 'next';
import { SmoothScroll } from '@/components/new-design-components';
import { TopNavigation } from '@/components/new-design-components/TopNavigation';
import { NewFooter } from '@/components/new-design-components/NewFooter';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'New components, design updates, and improvements shipped to ShitUI.',
};

export default function ChangelogLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <TopNavigation />
      <main className="relative w-full pt-0 md:pt-0">{children}</main>
      <NewFooter />
    </SmoothScroll>
  );
}
