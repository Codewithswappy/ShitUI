import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { ThemeProvider } from 'next-themes';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import { ViewTransitions } from 'next-view-transitions';
import { RebrandBanner } from '@/components/new-design-components/RebrandBanner';
import { SearchProvider } from '@/components/new-design-components/search-context';
import { CommandPaletteModal } from '@/components/new-design-components/CommandPaletteModal';
import { DatabuddyProvider } from '@databuddy/sdk/react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://shitui.in'),
  title: {
    default: 'ShitUI - Animated React Components',
    template: '%s | ShitUI',
  },

  description:
    'ShitUI (formerly RareUI) is a modern, free, and open-source React UI component library built with Tailwind CSS, Next.js, and Framer Motion. Copy-paste ready animated components with official Shadcn CLI support. Download buttons, cards, forms, modals, navbars, and text effects.',
  keywords: [
    // Rebranding & Core Identity
    'shitui',
    'shit ui',
    'shitui components',
    'shit ui library',
    'rareui',
    'rare ui',
    'rareui is now shitui',
    'rareui components',
    'rareui alternative',
    'shadcn cli registry',

    // Primary Keywords (High Competition)
    'ui components',
    'react components',
    'component library',
    'ui library',
    'react ui library',
    'free ui components',
    'open source components',

    // Technology-Specific Keywords
    'tailwind css components',
    'tailwind ui components',
    'tailwind components library',
    'next.js components',
    'nextjs ui components',
    'framer motion components',
    'react typescript components',
    'shadcn components',
    'shadcn ui alternative',

    // Component Type Keywords
    'react button components',
    'react card components',
    'react modal components',
    'react form components',
    'react navbar components',
    'react slider components',
    'react animation components',
    'animated buttons react',
    'animated cards react',
    'glassmorphism components',
    'liquid button react',

    // Action-Based Keywords
    'copy paste react components',
    'download react components',
    'free react templates',
    'react component examples',
    'react ui kit free',
    'ready to use react components',

    // Library-Related Keywords
    'react component library free',
    'best react ui library',
    'modern react components',
    'premium react components',
    'professional ui components',
    'production ready components',

    // Feature-Based Keywords
    'dark mode components',
    'responsive react components',
    'accessible react components',
    'animated ui components',
    'interactive components react',
    'modern ui components',
    'beautiful ui components',

    // Framework & Stack Keywords
    'react tailwind components',
    'next.js tailwind components',
    'typescript react components',
    'react hooks components',
    'react server components',

    // Use Case Keywords
    'landing page components',
    'dashboard components react',
    'website components react',
    'web app components',
    'saas ui components',
    'admin dashboard components',

    // Comparison Keywords
    'material ui alternative',
    'ant design alternative',
    'chakra ui alternative',
    'better than shadcn',
    'free shadcn alternative',

    // Developer-Focused Keywords
    'react developer tools',
    'frontend components',
    'web development components',
    'ui design system',
    'component design system',
    'react design system',

    // Quality & Type Keywords
    'high quality react components',
    'enterprise ui components',
    'startup ui components',
    'minimalist ui components',

    // Specific Component Names
    'liquid button component',
    '3d book component',
    'sound text component',
    'animated tab component',
    'toast tabs react',
    'animated background components',

    // Long-Tail Keywords
    'free open source react components',
    'no installation react components',
    'copy paste ui components tailwind',
    'modern web app components',
    'beautiful animated components',
    'professional landing page components',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://shitui.in',
    siteName: 'ShitUI',
    title: 'ShitUI - Animated React Components',
    description:
      'Discover premium, free, and open-source animated React UI components built with Tailwind CSS and Motion.',
    images: [
      {
        url: 'https://shitui.in/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ShitUI Component Library',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShitUI - Animated React Components',
    description:
      'Premium, free, and open-source animated React UI components built with Tailwind CSS and Motion.',
    images: ['https://shitui.in/og-image.jpg'],
    creator: '@heyyswap',
    site: '@shituihq',
  },
  authors: [{ name: 'Swapnil Kalambe', url: 'https://x.com/heyyswap' }],
  creator: 'Swapnil Kalambe',
  publisher: 'ShitUI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: 'https://shitui.in',
    types: {
      'application/rss+xml': 'https://shitui.in/rss.xml',
    },
  },
  category: 'technology',
  classification: 'Web Development Tools',
  other: {
    'google-site-verification': process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.png', sizes: '96x96', type: 'image/png' },
      {
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
        <head>
          {/* Favicons - Multiple sizes for best compatibility */}
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="icon" href="/favicon.ico" sizes="48x48" />
          <link rel="icon" href="/favicon.png" type="image/png" sizes="96x96" />
          <link rel="icon" href="/android-chrome-192x192.png" type="image/png" sizes="192x192" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
          <meta name="theme-color" content="#000000" />
          {/* Google Site Verification - Replace with your actual verification code */}
          <meta
            name="google-site-verification"
            content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || ''}
          />
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@graph': [
                  {
                    '@type': 'WebSite',
                    '@id': 'https://shitui.in/#website',
                    url: 'https://shitui.in',
                    name: 'ShitUI',
                    alternateName: ['RareUI', 'Rare UI', 'Shit UI'],
                    description: 'ShitUI (formerly RareUI) - Premium free React UI component library with 100+ components',
                    publisher: {
                      '@id': 'https://shitui.in/#organization',
                    },
                    potentialAction: [
                      {
                        '@type': 'SearchAction',
                        target: {
                          '@type': 'EntryPoint',
                          urlTemplate: 'https://shitui.in/docs?search={search_term_string}',
                        },
                        'query-input': 'required name=search_term_string',
                      },
                    ],
                  },
                  {
                    '@type': 'Organization',
                    '@id': 'https://shitui.in/#organization',
                    name: 'ShitUI',
                    legalName: 'ShitUI (formerly RareUI)',
                    alternateName: ['RareUI', 'Shit UI'],
                    url: 'https://shitui.in',
                    email: 'useshit.ui@gmail.com',
                    logo: {
                      '@type': 'ImageObject',
                      url: 'https://shitui.in/logo/shitlogo1.svg',
                      width: 512,
                      height: 512,
                    },
                    founder: {
                      '@type': 'Person',
                      name: 'Swapnil Kalambe',
                      url: 'https://x.com/heyyswap',
                      sameAs: ['https://x.com/heyyswap', 'https://github.com/Codewithswappy'],
                    },
                    sameAs: [
                      'https://x.com/shituihq',
                      'https://rareui.in',
                      'https://github.com/Codewithswappy/ShitUI',
                    ],
                  },
                  {
                    '@type': 'SoftwareApplication',
                    '@id': 'https://shitui.in/#software',
                    name: 'ShitUI - Animated React Components Library',
                    alternateName: ['RareUI', 'ShitUI Library'],
                    applicationCategory: 'DeveloperApplication',
                    applicationSubCategory: 'UI Component Library',
                    operatingSystem: 'Web, macOS, Windows, Linux',
                    isAccessibleForFree: true,
                    license: 'https://opensource.org/licenses/MIT',
                    offers: {
                      '@type': 'Offer',
                      price: '0',
                      priceCurrency: 'USD',
                      availability: 'https://schema.org/InStock',
                    },
                    description:
                      'Free, open-source animated React UI component library built with Tailwind CSS and Motion with official shadcn CLI v4 registry support.',
                    screenshot: 'https://shitui.in/og-image.jpg',
                    author: {
                      '@type': 'Person',
                      name: 'Swapnil Kalambe',
                      url: 'https://x.com/heyyswap',
                    },
                    publisher: {
                      '@id': 'https://shitui.in/#organization',
                    },
                    featureList: [
                      'Official shadcn CLI registry integration (@shitui)',
                      'Micro-interactions and physics-based animations with Motion (motion/react)',
                      'Tailwind CSS v3 and v4 styling',
                      'Copy-and-own zero-dependency lock architecture',
                      'Full TypeScript strict typing',
                      'Light and Dark mode support',
                      'Next.js 14, 15, and 16 App Router compatible',
                      'Accessible components (WAI-ARIA compliant)',
                      '100% Free MIT Open Source License',
                    ],
                    softwareVersion: '2.0.0',
                    softwareRequirements: 'React 18+, Next.js 14+, Tailwind CSS, Motion',
                    releaseNotes: 'https://shitui.in/changelog',
                    url: 'https://shitui.in',
                  },
                  {
                    '@type': 'HowTo',
                    name: 'How to install ShitUI components using the shadcn CLI',
                    description: 'Step-by-step guide to installing ShitUI animated React components into any project.',
                    step: [
                      {
                        '@type': 'HowToStep',
                        position: 1,
                        name: 'Run the shadcn CLI command',
                        text: 'Execute npx shadcn@latest add @shitui/[component-name] or npx shadcn@latest add https://shitui.in/r/[component-name].json in your terminal.',
                      },
                      {
                        '@type': 'HowToStep',
                        position: 2,
                        name: 'Verify dependencies',
                        text: 'The shadcn CLI automatically installs necessary dependencies like motion/react and copies the component files directly into your components/ directory.',
                      },
                      {
                        '@type': 'HowToStep',
                        position: 3,
                        name: 'Import and customize',
                        text: 'Import the component into your React or Next.js page and customize colors, animation easing, and props to match your design.',
                      },
                    ],
                  },
                  {
                    '@type': 'ItemList',
                    name: 'ShitUI Component Collection',
                    description: 'Animated React UI components available in ShitUI',
                    itemListElement: [
                      {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Liquid Button',
                        url: 'https://shitui.in/docs/components/liquid-button',
                        description: 'Gooey liquid dripping hover animation button with SVG filter.',
                      },
                      {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Liquid Tooltip',
                        url: 'https://shitui.in/docs/components/liquid-tooltip',
                        description: 'Dynamic cursor-tracking elastic jelly morphing tooltip.',
                      },
                      {
                        '@type': 'ListItem',
                        position: 3,
                        name: 'Animated Tab',
                        url: 'https://shitui.in/docs/components/animated-tab',
                        description: 'Sliding highlight pill navigation tabs powered by Motion.',
                      },
                      {
                        '@type': 'ListItem',
                        position: 4,
                        name: 'Book 3D',
                        url: 'https://shitui.in/docs/components/book-3d',
                        description: 'Interactive 3D book cover tilt with realistic lighting.',
                      },
                      {
                        '@type': 'ListItem',
                        position: 5,
                        name: 'Vapor Smoke Text',
                        url: 'https://shitui.in/docs/components/vapor-smokeText',
                        description: 'Ethereal particle vapor text dissipation animation.',
                      },
                    ],
                  },
                  {
                    '@type': 'FAQPage',
                    mainEntity: [
                      {
                        '@type': 'Question',
                        name: 'What is ShitUI?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: 'ShitUI (formerly RareUI) is a free, open-source animated React UI component library created by Swapnil Kalambe. It provides production-ready, accessible, and high-performance components built with Tailwind CSS and Motion, distributed via the official shadcn CLI.',
                        },
                      },
                      {
                        '@type': 'Question',
                        name: 'Who created and founded ShitUI?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: 'ShitUI and RareUI were created and founded by Swapnil Kalambe. Official contact email is useshit.ui@gmail.com and Twitter/X is @heyyswap.',
                        },
                      },
                      {
                        '@type': 'Question',
                        name: 'How do I install ShitUI components with the CLI?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: 'Run npx shadcn@latest add @shitui/[component-name] (e.g. npx shadcn@latest add @shitui/liquid-tooltip) or use the direct URL npx shadcn@latest add https://shitui.in/r/[component-name].json.',
                        },
                      },
                      {
                        '@type': 'Question',
                        name: 'Is ShitUI free for commercial use?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: 'Yes. ShitUI is 100% free and open-source under the MIT license for personal, commercial, and client projects without any attribution requirement.',
                        },
                      },
                      {
                        '@type': 'Question',
                        name: 'What is the relationship between RareUI and ShitUI?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: 'RareUI (rareui.in) has officially rebranded to ShitUI (shitui.in). All components, features, and docs have moved to shitui.in with native shadcn CLI registry support.',
                        },
                      },
                      {
                        '@type': 'Question',
                        name: 'Does installing ShitUI components automatically install motion?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: 'Yes. When using the shadcn CLI, required dependencies like motion/react and Tailwind utilities are automatically resolved and installed into your project.',
                        },
                      },
                    ],
                  },
                ],
              }),
            }}
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
          suppressHydrationWarning
        >
          {/* Google Analytics */}
          {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
            <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
          )}
          <RootProvider
            search={{
              enabled: false,
            }}
            theme={{
              attribute: 'class',
              defaultTheme: 'system',
              enableSystem: true,
              disableTransitionOnChange: true,
              storageKey: 'theme',
              scriptProps: {
                async: true,
              },
            }}
          >
            <SearchProvider>
              <div className="flex min-h-screen flex-col">
                <RebrandBanner />
                {children}
              </div>
              <CommandPaletteModal />
            </SearchProvider>
          </RootProvider>
          <DatabuddyProvider
            autocapture={{ webVitals: true }}
            replay
          />
        </body>
      </html>
    </ViewTransitions>
  );
}
