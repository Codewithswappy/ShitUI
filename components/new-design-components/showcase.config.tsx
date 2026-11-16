// Centralized static showcase component configuration
// Media assets live exclusively in /previews/

export type ShowcaseComponent = {
  id: string;
  name: string;
  category: 'components' | 'text' | '3d' | 'backgrounds' | 'sections';
  slug: string;
  tag: string;
  showOnHome: boolean;
  order?: number;
  preview: {
    poster: string;
    video?: string;
    width: number;
    height: number;
  };
};

export const SHOWCASE_REGISTRY: ShowcaseComponent[] = [
  {
    id: 'liquid-button',
    name: 'Liquid Button',
    category: 'components',
    tag: 'Motion',
    slug: 'components/liquid-button',
    showOnHome: true,
    preview: {
      poster: '',
      video: '/previews/liquid-btn.webm',
      width: 1920,
      height: 1080,
    },
  },
  {
    id: 'book-3d',
    name: '3D Interaction Book',
    category: '3d',
    tag: '3D',
    slug: 'components/book-3d',
    showOnHome: true,
    preview: {
      poster: '',
      video: '/previews/3d-book.webm',
      width: 1394,
      height: 1086,
    },
  },
  {
    id: 'interactive-animated-tabs',
    name: 'Animated Tabs',
    category: 'components',
    tag: 'Navigation',
    slug: 'components/animated-tab',
    showOnHome: true,
    preview: {
      poster: '',
      video: '/previews/animated-tabs.webm',
      width: 1036,
      height: 670,
    },
  },
  {
    id: 'liquid-tooltip',
    name: 'Liquid Tooltip',
    category: 'components',
    tag: 'Tooltip',
    slug: 'components/liquid-tooltip',
    showOnHome: true,
    preview: {
      poster: '',
      video: '/previews/liquid-tooltip.webm',
      width: 1384,
      height: 594,
    },
  },
  {
    id: 'loading-spinner',
    name: 'Loading Spinner',
    category: 'components',
    tag: 'Loader',
    slug: 'components/loading-spinner',
    showOnHome: true,
    preview: {
      poster: '',
      video: '/previews/loading-spinner.webm',
      width: 570,
      height: 458,
    },
  },
  {
    id: 'retro-pixel',
    name: 'Retro Pixel Button',
    category: 'components',
    tag: 'Game',
    slug: 'components/retro-pixel-button',
    showOnHome: true,
    preview: {
      poster: '',
      video: '/previews/retro-pixel-btn.webm',
      width: 656,
      height: 528,
    },
  },
  {
    id: 'word-magnet',
    name: 'Word Magnet',
    category: 'text',
    tag: 'Physics',
    slug: 'components/word-magnet',
    showOnHome: true,
    preview: {
      poster: '',
      video: '/previews/word-magnet.webm',
      width: 1304,
      height: 590,
    },
  },
  {
    id: 'magnetic-scatter',
    name: 'Magnetic Scatter',
    category: 'text',
    tag: 'Hover',
    slug: 'components/magnetic-scatterText',
    showOnHome: true,
    preview: {
      poster: '',
      video: '/previews/magnetic-scatter-text.webm',
      width: 812,
      height: 646,
    },
  },
  {
    id: 'sound-text',
    name: 'Sound Text',
    category: 'text',
    tag: 'Audio',
    slug: 'components/sound-text',
    showOnHome: true,
    preview: {
      poster: '',
      video: '/previews/sound-text.webm',
      width: 1330,
      height: 514,
    },
  },
  {
    id: 'floating-nav',
    name: 'Floating Navigation',
    category: 'components',
    tag: 'Navigation',
    slug: 'components/floating-navigation',
    showOnHome: true,
    preview: {
      poster: '',
      video: '/previews/floating-nav.webm',
      width: 794,
      height: 598,
    },
  },
  {
    id: 'vapor-smoke',
    name: 'Vapor Smoke Text',
    category: 'text',
    tag: 'Particles',
    slug: 'components/vapor-smokeText',
    showOnHome: true,
    preview: {
      poster: '',
      video: '/previews/vaporsmoke-text.webm',
      width: 1232,
      height: 450,
    },
  },
  {
    id: 'premium-btn',
    name: 'Premium Button',
    category: 'components',
    tag: 'Button',
    slug: 'components/premium-button',
    showOnHome: true,
    preview: {
      poster: '',
      video: '/previews/premium-btn.webm',
      width: 624,
      height: 520,
    },
  },
  {
    id: 'liquid-wave',
    name: 'Liquid Wave Canvas',
    category: 'backgrounds',
    tag: 'WebGL',
    slug: 'components/liquid-wave',
    showOnHome: true,
    preview: {
      poster: '',
      video: '/previews/liquid-wave-bg.webm',
      width: 1788,
      height: 1448,
    },
  },
  {
    id: 'toast-tabs',
    name: 'Dynamic Toast Tabs',
    category: 'components',
    tag: 'Tabs',
    slug: 'components/toast-tabs',
    showOnHome: true,
    preview: {
      poster: '/previews/toast-tabs.png',
      video: '/previews/toast-tabs.webm',
      width: 2132,
      height: 1600,
    },
  },
  {
    id: 'dynamic-island-nav',
    name: 'Dynamic Island Nav',
    category: 'components',
    tag: 'Navigation',
    slug: 'components/dynamic-island-nav',
    showOnHome: true,
    preview: {
      poster: '',
      video: '/previews/dynamic-island-nav.webm',
      width: 2560,
      height: 1600,
    },
  },
  {
    id: 'interactive-contact-button',
    name: 'Interactive Contact Button',
    category: 'components',
    tag: 'Button',
    slug: 'components/interactive-contact-button',
    showOnHome: true,
    preview: {
      poster: '',
      video: '/previews/interactive-contact-button.webm',
      width: 1206,
      height: 1052,
    },
  },
];
