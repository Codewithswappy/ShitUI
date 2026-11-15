import React from 'react';

export type SponsorTier = 'lite' | 'core' | 'max';

export interface SponsorItem {
  id: string;
  name: string;
  url: string;
  tier: SponsorTier;
  logoUrl?: string; // Image path or URL e.g. '/sponsors/acme.png' or 'https://...'
  xHandle?: string; // Twitter/X handle e.g. '@acme'
  githubHandle?: string; // GitHub handle e.g. 'Codewithswappy'
  fit?: 'contain' | 'cover'; // 'contain' (default) or 'cover'
  className?: string; // Optional custom classes
  description?: string; // Short bio or sponsor description
  content?: React.ReactNode; // Optional custom SVG or React component
  tagline?: string;
}

export interface SponsorTierInfo {
  id: SponsorTier;
  name: string;
  badge: string;
  price: string;
  period: string;
  description: string;
  perks: string[];
}

export const SPONSOR_TIERS: Record<SponsorTier, SponsorTierInfo> = {
  lite: {
    id: 'lite',
    name: 'Lite Sponsor',
    badge: 'Lite',
    price: '$10',
    period: '/ month',
    description: 'Support independent craft and get listed on our dedicated sponsors page.',
    perks: [
      'Avatar & backlink on dedicated Sponsors page',
      'Special Sponsor role in Discord',
      'Our eternal gratitude & early changelog updates',
    ],
  },
  core: {
    id: 'core',
    name: 'Core Sponsor',
    badge: 'Core',
    price: '$49',
    period: '/ month',
    description: 'Direct showcase on the homepage bento grid with logo, bio, and do-follow link.',
    perks: [
      'Homepage Bento Showcase placement',
      'Logo on docs',
      'Logo, title & verified do-follow backlink',
      'Priority component & bug requests',
    ],
  },
  max: {
    id: 'max',
    name: 'Max Sponsor',
    badge: 'Max',
    price: '$199',
    period: '/ month or lifetime',
    description: 'Large hero card on the homepage bento grid. Maximum visibility for high-growth tools and brands.',
    perks: [
      'Large 2x Hero Bento Card on homepage',
      'Logo on docs',
      'Prominent high-res logo & custom tagline',
      'Direct line for custom component requests',
      'Shoutout on X / Twitter to 10k+ developers',
    ],
  },
};

/**
 * Real sponsors list.
 * Note:
 * - Landing page bento displays 'core' and 'max' sponsors only.
 * - 'lite' sponsors are displayed on the dedicated /sponsors page.
 */
export const SPONSORS_LIST: SponsorItem[] = [];

export const SPONSOR_LINK = 'https://github.com/sponsors/Codewithswappy';

/**
 * Appends `?ref=shitui` attribution tag to outbound sponsor links
 */
export function getSponsorUrl(url: string): string {
  if (!url) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}ref=shitui`;
}

// ============================================================================
// COMPACT PORTRAIT PRICING SECTION DATA
// Pure data with no JSX so both Server & Client Components can import it cleanly
// ============================================================================
export interface PricingTier {
  id: 'lite' | 'core' | 'max';
  name: string;
  tagline: string;
  price: number;
  featured?: boolean;
  buttonVariant: 'black' | 'primary';
  features: string[];
  ctaText: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'lite',
    name: 'Lite',
    tagline: 'Feather — lightweight and simple.',
    price: 120,
    buttonVariant: 'black',
    ctaText: 'Sponsor Lite',
    features: [
      'Logo in the README',
      'Listed on the sponsors page with a link',
      'Name in the release notes',
    ],
  },
  {
    id: 'core',
    name: 'Core',
    tagline: 'Layered shapes — foundation and essentials.',
    price: 250,
    featured: true,
    buttonVariant: 'primary',
    ctaText: 'Sponsor Core',
    features: [
      'Logo on the sponsors page',
      'Logo on the home page',
      'Logo on docs',
      'Larger logo in the README',
      'Shoutout on X',
      'Your issues and requests get answered first',
    ],
  },
  {
    id: 'max',
    name: 'Max',
    tagline: 'Crown — premium and maximum capability.',
    price: 399,
    buttonVariant: 'black',
    ctaText: 'Sponsor Max',
    features: [
      'Largest logo on the sponsors page',
      'Largest logo on the home page and README',
      'Logo on docs',
      'Shoutout on X and LinkedIn',
      'Follow on X',
      'Direct line for feedback and requests',
      'Your top feature request gets built first',
    ],
  },
];
