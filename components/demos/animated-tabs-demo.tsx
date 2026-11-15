'use client';

import React, { useState } from 'react';
import { AnimatedTabs } from '@/components/shitui/AnimatedTab';

export function AnimatedTabsDemo() {
  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ];
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="flex items-center justify-center py-10 w-full">
      <AnimatedTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}

export default AnimatedTabsDemo;
