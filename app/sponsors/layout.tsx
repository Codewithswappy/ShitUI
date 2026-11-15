import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sponsors',
  description: 'Sponsor ShitUI and support the development of open-source React components.',
};

export default function SponsorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

