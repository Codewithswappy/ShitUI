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
export type BillingCycle = 'monthly' | 'yearly';

export interface PricingTier {
  id: 'lite' | 'core' | 'max';
  name: string;
  tagline: string;
  price: number; // monthly default for backward compatibility
  monthlyPrice: number;
  yearlyPrice: number; // effective per month when billed annually ($96, $200, $319)
  yearlyTotal: number; // total annual charge ($1,152, $2,400, $3,828)
  yearlySavings: number; // savings per year ($288, $600, $960)
  featured?: boolean;
  buttonVariant: 'black' | 'primary';
  features: string[];
  ctaText: string;
  monthlyPaymentUrl?: string;
  yearlyPaymentUrl?: string;
}

/**
 * Resolves a Dodo Payments checkout URL from a product ID or a full checkout URL.
 */
export function getDodoCheckoutUrl(val?: string, fallback = ''): string {
  if (!val) return fallback;
  const trimmed = val.trim();
  if (!trimmed) return fallback;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://checkout.dodopayments.com/buy/${trimmed}?quantity=1`;
}

/**
 * Direct lookup function for tier checkout URLs.
 * Prioritizes process.env.NEXT_PUBLIC_* and seamlessly falls back to the configured live product IDs.
 */
export function getTierPaymentUrl(tierId: 'lite' | 'core' | 'max', cycle: BillingCycle = 'monthly'): string {
  if (tierId === 'lite') {
    const id = cycle === 'yearly'
      ? (process.env.NEXT_PUBLIC_DODO_PRODUCT_LITE_YEARLY || 'pdt_0NsCpEuDaxKjlDIaEQQLr')
      : (process.env.NEXT_PUBLIC_DODO_PRODUCT_LITE_MONTHLY || 'pdt_0NsCoTMahiXAp6f2X3X9g');
    return `https://checkout.dodopayments.com/buy/${id.trim()}?quantity=1`;
  }
  if (tierId === 'core') {
    const id = cycle === 'yearly'
      ? (process.env.NEXT_PUBLIC_DODO_PRODUCT_CORE_YEARLY || 'pdt_0NsCppRWT0d2brXZem4E5')
      : (process.env.NEXT_PUBLIC_DODO_PRODUCT_CORE_MONTHLY || 'pdt_0NsCpf3B8u0wqXKYEdms5');
    return `https://checkout.dodopayments.com/buy/${id.trim()}?quantity=1`;
  }
  if (tierId === 'max') {
    const id = cycle === 'yearly'
      ? (process.env.NEXT_PUBLIC_DODO_PRODUCT_MAX_YEARLY || '')
      : (process.env.NEXT_PUBLIC_DODO_PRODUCT_MAX_MONTHLY || 'pdt_0NsCqFfFLbKNnhutKAFgk');
    if (!id || !id.trim()) {
      return 'mailto:useshit.ui@gmail.com?subject=Max%20Yearly%20Sponsorship%20Inquiry';
    }
    return `https://checkout.dodopayments.com/buy/${id.trim()}?quantity=1`;
  }
  return '';
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'lite',
    name: 'Lite',
    tagline: 'Feather — lightweight and simple.',
    price: 120,
    monthlyPrice: 120,
    yearlyPrice: 96,
    yearlyTotal: 1152,
    yearlySavings: 288,
    buttonVariant: 'black',
    ctaText: 'Sponsor Lite',
    monthlyPaymentUrl: getTierPaymentUrl('lite', 'monthly'),
    yearlyPaymentUrl: getTierPaymentUrl('lite', 'yearly'),
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
    monthlyPrice: 250,
    yearlyPrice: 200,
    yearlyTotal: 2400,
    yearlySavings: 600,
    featured: true,
    buttonVariant: 'primary',
    ctaText: 'Sponsor Core',
    monthlyPaymentUrl: getTierPaymentUrl('core', 'monthly'),
    yearlyPaymentUrl: getTierPaymentUrl('core', 'yearly'),
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
    monthlyPrice: 399,
    yearlyPrice: 319,
    yearlyTotal: 3828,
    yearlySavings: 960,
    buttonVariant: 'black',
    ctaText: 'Sponsor Max',
    monthlyPaymentUrl: getTierPaymentUrl('max', 'monthly'),
    yearlyPaymentUrl: getTierPaymentUrl('max', 'yearly'),
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
