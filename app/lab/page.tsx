import type { Metadata } from 'next';
import { LabWorkbench } from '@/components/lab/LabWorkbench';
import { LabAuthGate } from '@/components/lab/LabAuthGate';

export const metadata: Metadata = {
  title: 'Lab & Component Workbench',
  description:
    'Isolated developer workbench to prototype, animate, and test experimental ShitUI components without touching production code.',
};

export default function LabPage() {
  return (
    <LabAuthGate>
      <LabWorkbench />
    </LabAuthGate>
  );
}
