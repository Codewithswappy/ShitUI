import React from 'react';
import SplitFaqDemo from './drafts/SplitFaq';
import ChatOnboardingDemo from './drafts/ChatOnboarding';

export interface LabDraft {
  id: string;
  name: string;
  category: string;
  description: string;
  component: React.ComponentType;
  tags?: string[];
}

export const LAB_DRAFTS: LabDraft[] = [
  {
    id: 'chat-onboarding',
    name: 'Chat Onboarding',
    category: 'blocks',
    description:
      'Fluid onboarding experience that begins with a single input pill and smoothly morphs into an interactive multi-step chat flow.',
    component: ChatOnboardingDemo,
    tags: ['motion', 'chat', 'onboarding', 'multiselect', 'spring', 'interactive'],
  },
  {
    id: 'split-faq',
    name: 'Split FAQ',
    category: 'accordion',
    description:
      'Grouped FAQ that splits on click. Open question detaches into its own card while others regroup and merge back.',
    component: SplitFaqDemo,
    tags: ['motion', 'spring', 'faq', 'accordion', 'layout-animation', 'accessible'],
  },
];
