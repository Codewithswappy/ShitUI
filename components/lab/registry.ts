import React from 'react';
import SplitFaqDemo from './drafts/SplitFaq';

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
    id: 'split-faq',
    name: 'Split FAQ',
    category: 'accordion',
    description:
      'Grouped FAQ that splits on click. Open question detaches into its own card while others regroup and merge back.',
    component: SplitFaqDemo,
    tags: ['motion', 'spring', 'faq', 'accordion', 'layout-animation', 'accessible'],
  },
];
