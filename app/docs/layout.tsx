import { NewDocsLayout } from '@/components/new-design-components';
import { sidebarData } from '@/lib/sidebar-data';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s - ShitUI',
    default: 'ShitUI - Free React UI Components',
  },
};

export default function DocsLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <NewDocsLayout sidebar={sidebarData} blank={false}>
      {children}
    </NewDocsLayout>
  );
}

