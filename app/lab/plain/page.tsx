import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PlainComponentView } from '@/components/lab/PlainComponentView';
import { LabAuthGate } from '@/components/lab/LabAuthGate';

export const metadata: Metadata = {
  title: 'Plain Component Preview | Lab',
  description: 'Clean isolated view of the component without any extra workbench tools.',
};

export default function PlainLabPage() {
  return (
    <LabAuthGate>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-white dark:bg-neutral-950">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        }
      >
        <PlainComponentView />
      </Suspense>
    </LabAuthGate>
  );
}
