import React from 'react';
import NeonGlowCard from './drafts/NeonGlowCard';
import LiquidSwitch from './drafts/LiquidSwitch';

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
    id: 'neon-glow-card',
    name: 'Neon Glow Card',
    category: 'cards',
    description: 'Interactive cursor-following radial glow card with kinetic spring tilt.',
    component: NeonGlowCard,
    tags: ['motion', 'spring', '3D tilt', 'radial glow'],
  },
  {
    id: 'liquid-switch',
    name: 'Liquid Switch',
    category: 'buttons',
    description: 'Tactile spring toggle with fluid pulse and elastic thumb physics.',
    component: LiquidSwitch,
    tags: ['motion', 'toggle', 'spring', 'elastic'],
  },
];
