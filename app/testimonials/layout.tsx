import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Testimonials',
  description:
    'Unfiltered feedback and tweets from developers and designers building with ShitUI components.',
  alternates: {
    canonical: 'https://shitui.in/testimonials',
  },
  openGraph: {
    title: 'Testimonials | ShitUI',
    description:
      'Unfiltered feedback and tweets from developers and designers building with ShitUI components.',
    url: 'https://shitui.in/testimonials',
    siteName: 'ShitUI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Testimonials | ShitUI',
    description:
      'Unfiltered feedback and tweets from developers and designers building with ShitUI components.',
    creator: '@heyyswap',
    site: '@shituihq',
  },
};

export default function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

