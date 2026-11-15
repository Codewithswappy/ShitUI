import * as React from 'react';
import { NewComponentPreview } from '@/components/new-design-components/NewComponentPreview';
import { getComponentSource } from '@/lib/get-component-source';

export interface PreviewProps {
  children?: React.ReactNode;
  className?: string;
  code?: string;
  component?: string;
  cliCommand?: string;
  hideCodeTab?: boolean;
  previewClassName?: string;
  expand?: boolean;
  expandable?: boolean;
  minimize?: boolean;
  canExpand?: boolean;
  allowExpand?: boolean;
  rotate?: boolean;
  replay?: boolean;
  reanimate?: boolean;
  [key: string]: any;
}

export function Preview({
  children,
  code,
  component,
  cliCommand,
  ...props
}: PreviewProps) {
  // 1. If manual `code` prop is provided, keep it as an optional override
  // 2. Otherwise, automatically read full source from components/shitui/ with fs via getComponentSource
  const resolvedCode = code || (component ? getComponentSource(component) : '') || '';

  return (
    <NewComponentPreview
      code={resolvedCode}
      component={component}
      cliCommand={cliCommand}
      {...props}
    >
      {children}
    </NewComponentPreview>
  );
}

export default Preview;
