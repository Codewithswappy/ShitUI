export interface ComponentCredit {
  name: string;
  profession: string;
  xHandle: string;
  xUrl?: string;
  avatarUrl?: string;
}

export interface ComponentDetails {
  title: string;
  description: string;
  tags: string[];
  version: string;
  lastUpdated: string;
  related: Array<{ title: string; href: string }>;
  credit: ComponentCredit;
}

export const DEFAULT_CREDIT: ComponentCredit = {
  name: 'Swapnil Kalambe',
  profession: 'Design Engineer',
  xHandle: '@heyyswap',
  xUrl: 'https://x.com/heyyswap',
  avatarUrl: 'https://unavatar.io/twitter/heyyswap',
};

// All current and future components are created by Swapnil Kalambe
export const COMPONENT_CREDITS: Record<string, ComponentCredit> = new Proxy(
  {},
  {
    get: () => DEFAULT_CREDIT,
  }
);

export const COMPONENT_DETAILS_REGISTRY: Record<string, ComponentDetails> = {
  'chat-onboarding': {
    title: 'Chat Onboarding',
    description:
      'Fluid onboarding experience that begins with a single input pill and smoothly morphs into an interactive multi-step chat flow.',
    tags: ["Motion","Chat","Onboarding","Multiselect","Spring","Interactive"],
    version: 'v1.0.0',
    lastUpdated: 'Nov 2026',
    related: [
      { title: 'Liquid Wave', href: '/docs/components/liquid-wave' },
      { title: 'Animated Tab', href: '/docs/components/animated-tab' },
    ],
    credit: DEFAULT_CREDIT,
  },

  'split-faq': {
    title: 'Split FAQ',
    description:
      'Grouped FAQ that splits on click. Open question detaches into its own card while others regroup and merge back.',
    tags: ['Motion', 'Spring', 'FAQ', 'Accordion', 'Layout Animation', 'Accessible'],
    version: 'v1.0.0',
    lastUpdated: 'Nov 2026',
    related: [
      { title: 'Toast Tabs', href: '/docs/components/toast-tabs' },
      { title: 'Dynamic Island Navigation', href: '/docs/components/dynamic-island-nav' },
      { title: 'Animated Tab', href: '/docs/components/animated-tab' },
    ],
    credit: DEFAULT_CREDIT,
  },
  'liquid-wave': {
    title: 'Liquid Wave',
    description: 'A mesmerizing fluid dynamics background with interactive mouse-driven waves.',
    tags: ['Interactive', 'WebGL', 'Canvas', 'React', 'Shader'],
    version: 'v1.2.0',
    lastUpdated: 'Nov 2026',
    related: [
      { title: 'Liquid Button', href: '/docs/components/liquid-button' },
      { title: 'Liquid Tooltip', href: '/docs/components/liquid-tooltip' },
      { title: 'Vapor Smoke Text', href: '/docs/components/vapor-smokeText' },
    ],
    credit: DEFAULT_CREDIT,
  },
  'liquid-button': {
    title: 'Liquid Button',
    description: 'A tactile button with a liquid gooey surface effect on hover and active click.',
    tags: ['Hover', 'Gooey', 'SVG Filters', 'React', 'Motion'],
    version: 'v1.1.0',
    lastUpdated: 'Nov 2026',
    related: [
      { title: 'Liquid Wave', href: '/docs/components/liquid-wave' },
      { title: 'Premium Button', href: '/docs/components/premium-button' },
      { title: 'Retro Pixel Button', href: '/docs/components/retro-pixel-button' },
    ],
    credit: DEFAULT_CREDIT,
  },
  'animated-tab': {
    title: 'Animated Tab',
    description: 'A smooth, animated tab component with glassmorphism design and spring transitions.',
    tags: ['Navigation', 'Animated', 'Framer Motion', 'React', 'Tabs'],
    version: 'v1.0.4',
    lastUpdated: 'Oct 2026',
    related: [
      { title: 'Toast Tabs', href: '/docs/components/toast-tabs' },
      { title: 'Floating Navigation', href: '/docs/components/floating-navigation' },
    ],
    credit: DEFAULT_CREDIT,
  },
  'book-3d': {
    title: 'Book 3D',
    description: 'A 3D interactive book component that flips and rotates with realistic perspective.',
    tags: ['3D', 'CSS only', 'Hover', 'Perspective', 'React'],
    version: 'v1.3.0',
    lastUpdated: 'Nov 2026',
    related: [
      { title: 'Liquid Wave', href: '/docs/components/liquid-wave' },
      { title: 'Word Magnet', href: '/docs/components/word-magnet' },
    ],
    credit: DEFAULT_CREDIT,
  },
  'dynamic-island-nav': {
    title: 'Dynamic Island Navigation',
    description: 'An adaptive iOS-inspired Dynamic Island navbar with fluid physics and scroll morphing.',
    tags: ['Navigation', 'Dynamic Island', 'Motion', 'React', 'Mobile Drawer'],
    version: 'v1.0.0',
    lastUpdated: 'Nov 2026',
    related: [
      { title: 'Floating Navigation', href: '/docs/components/floating-navigation' },
      { title: 'Animated Tab', href: '/docs/components/animated-tab' },
    ],
    credit: DEFAULT_CREDIT,
  },
  'interactive-contact-button': {
    title: 'Interactive Contact Button',
    description: 'A tactile floating contact button that expands into an interactive profile card with booking and email copy.',
    tags: ['Button', 'Contact', 'Popover', 'React', 'Motion'],
    version: 'v1.0.0',
    lastUpdated: 'Nov 2026',
    related: [
      { title: 'Premium Button', href: '/docs/components/premium-button' },
      { title: 'Liquid Button', href: '/docs/components/liquid-button' },
    ],
    credit: DEFAULT_CREDIT,
  },
  'floating-navigation': {
    title: 'Floating Navigation',
    description: 'A sleek floating navigation bar with fluid hover effects and animated icons.',
    tags: ['Navigation', 'Floating', 'Hover', 'React', 'Spring'],
    version: 'v1.0.8',
    lastUpdated: 'Oct 2026',
    related: [
      { title: 'Animated Tab', href: '/docs/components/animated-tab' },
      { title: 'Toast Tabs', href: '/docs/components/toast-tabs' },
    ],
    credit: DEFAULT_CREDIT,
  },
  'liquid-tooltip': {
    title: 'Liquid Tooltip',
    description: 'A tooltip component with liquid-like spring physics that reacts to mouse velocity.',
    tags: ['Tooltip', 'Hover', 'Spring', 'Physics', 'React'],
    version: 'v1.1.2',
    lastUpdated: 'Nov 2026',
    related: [
      { title: 'Liquid Button', href: '/docs/components/liquid-button' },
      { title: 'Liquid Wave', href: '/docs/components/liquid-wave' },
    ],
    credit: DEFAULT_CREDIT,
  },
  'loading-spinner': {
    title: 'Loading Spinner',
    description: 'A customizable loading spinner with light/dark support and smooth deceleration physics.',
    tags: ['Loader', 'Animated', 'CSS only', 'React', 'Minimal'],
    version: 'v1.0.2',
    lastUpdated: 'Oct 2026',
    related: [
      { title: 'Vapor Smoke Text', href: '/docs/components/vapor-smokeText' },
      { title: 'Premium Button', href: '/docs/components/premium-button' },
    ],
    credit: DEFAULT_CREDIT,
  },
  'magnetic-scattertext': {
    title: 'Magnetic Scatter Text',
    description: 'An interactive text animation that scatters on hover with magnetic spring effects.',
    tags: ['Text', 'Hover', 'Magnetic', 'Physics', 'React'],
    version: 'v1.2.0',
    lastUpdated: 'Nov 2026',
    related: [
      { title: 'Word Magnet', href: '/docs/components/word-magnet' },
      { title: 'Sound Text', href: '/docs/components/sound-text' },
    ],
    credit: DEFAULT_CREDIT,
  },
  'premium-button': {
    title: 'Premium Button',
    description: 'A premium tactile button with a dynamic gradient background and hover sheen effects.',
    tags: ['Button', 'Gradient', 'Hover', 'CSS only', 'React'],
    version: 'v1.0.5',
    lastUpdated: 'Oct 2026',
    related: [
      { title: 'Retro Pixel Button', href: '/docs/components/retro-pixel-button' },
      { title: 'Liquid Button', href: '/docs/components/liquid-button' },
    ],
    credit: DEFAULT_CREDIT,
  },
  'retro-pixel-button': {
    title: 'Retro Pixel Button',
    description: 'A retro-styled animated arcade button with a sliding pixel block and stepped transitions.',
    tags: ['Retro', 'Pixel', 'CSS only', 'Hover', 'React'],
    version: 'v1.1.0',
    lastUpdated: 'Nov 2026',
    related: [
      { title: 'Premium Button', href: '/docs/components/premium-button' },
      { title: 'Liquid Button', href: '/docs/components/liquid-button' },
    ],
    credit: DEFAULT_CREDIT,
  },
  'sound-text': {
    title: 'Sound Text',
    description: 'An interactive text animation that plays generated musical audio frequencies on hover.',
    tags: ['Audio', 'Web Audio API', 'Interactive', 'React', 'Hover'],
    version: 'v1.0.3',
    lastUpdated: 'Nov 2026',
    related: [
      { title: 'Magnetic Scatter Text', href: '/docs/components/magnetic-scatterText' },
      { title: 'Vapor Smoke Text', href: '/docs/components/vapor-smokeText' },
    ],
    credit: DEFAULT_CREDIT,
  },
  'toast-tabs': {
    title: 'Toast Tabs',
    description: 'A tab switching component that displays content like a toast message with avatar morphing.',
    tags: ['Navigation', 'Tabs', 'Toast', 'Framer Motion', 'React'],
    version: 'v1.2.0',
    lastUpdated: 'Nov 2026',
    related: [
      { title: 'Animated Tab', href: '/docs/components/animated-tab' },
      { title: 'Floating Navigation', href: '/docs/components/floating-navigation' },
    ],
    credit: DEFAULT_CREDIT,
  },
  'vapor-smoketext': {
    title: 'Vapor Smoke Text',
    description: 'A smoky text animation with blur and spring effects that creates an ethereal appearance.',
    tags: ['Text', 'Animated', 'Canvas', 'Blur', 'React'],
    version: 'v1.1.4',
    lastUpdated: 'Nov 2026',
    related: [
      { title: 'Sound Text', href: '/docs/components/sound-text' },
      { title: 'Magnetic Scatter Text', href: '/docs/components/magnetic-scatterText' },
    ],
    credit: DEFAULT_CREDIT,
  },
  'word-magnet': {
    title: 'Word Magnet',
    description: 'Words are repelled by the cursor and snap back with physical spring animations.',
    tags: ['Physics', 'Spring', 'Hover', 'Interactive', 'React'],
    version: 'v1.0.8',
    lastUpdated: 'Nov 2026',
    related: [
      { title: 'Magnetic Scatter Text', href: '/docs/components/magnetic-scatterText' },
      { title: 'Book 3D', href: '/docs/components/book-3d' },
    ],
    credit: DEFAULT_CREDIT,
  },
};

export function normalizeSlug(pathnameOrSlug?: string): string {
  if (!pathnameOrSlug) return '';
  const segments = pathnameOrSlug.split('/').filter(Boolean);
  const raw = segments[segments.length - 1] || '';
  return raw.toLowerCase().replace(/[-_]/g, '');
}

export function getComponentDetails(pathnameOrSlug?: string): ComponentDetails {
  const norm = normalizeSlug(pathnameOrSlug);
  
  // Direct key lookup by normalized slug
  for (const [key, details] of Object.entries(COMPONENT_DETAILS_REGISTRY)) {
    if (key.toLowerCase().replace(/[-_]/g, '') === norm) {
      return details;
    }
  }

  // Fallback defaults for general guides or unlisted components
  return {
    title: 'Component',
    description: 'Explore interactive states, props, and installation for this component.',
    tags: ['React', 'TypeScript', 'Tailwind', 'Interactive'],
    version: 'v1.0.0',
    lastUpdated: 'Nov 2026',
    related: [
      { title: 'Liquid Wave', href: '/docs/components/liquid-wave' },
      { title: 'Animated Tab', href: '/docs/components/animated-tab' },
    ],
    credit: DEFAULT_CREDIT,
  };
}

export function getComponentCredit(pathnameOrSlug?: string): ComponentCredit {
  const details = getComponentDetails(pathnameOrSlug);
  return details.credit;
}
