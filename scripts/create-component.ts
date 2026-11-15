// scripts/create-component.ts
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> =>
  new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log('🎨 Add a new RareUI Component');

  const name = await question('Component Name (e.g., neon-button): ');
  if (!name) {
    console.log('❌ Component name is required.');
    process.exit(1);
  }

  const category = await question('Category (e.g., buttons, cards, text-animation): ');
  if (!category) {
    console.log('❌ Category is required.');
    process.exit(1);
  }

  const title = name
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const componentPascalName = name
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => {
      if (w.toLowerCase() === '3d') return '3D';
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join('');

  // Define paths matching current ShitUI structure:
  // Component source lives at components/shitui/<PascalName>/<PascalName>.tsx
  const compDir = path.join(process.cwd(), 'components/shitui', componentPascalName);
  const compFile = path.join(compDir, `${componentPascalName}.tsx`);
  const compIndexFile = path.join(compDir, 'index.ts');
  const compBridgeFile = path.join(process.cwd(), 'components/shitui', `${componentPascalName}.tsx`);

  // Target docs directory - all components live in content/docs/components
  const docsDir = path.join(process.cwd(), 'content/docs/components');
  const docsFile = path.join(docsDir, `${name}.mdx`);

  if (!fs.existsSync(compDir)) fs.mkdirSync(compDir, { recursive: true });
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

  // 1. Component Main File Template
  const compTemplate = `'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface ${componentPascalName}Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export function ${componentPascalName}({ className, children, ...props }: ${componentPascalName}Props) {
  return (
    <div className={cn('relative', className)} {...props}>
      {children || '${title}'}
    </div>
  );
}

export default ${componentPascalName};
`;

  // 2. Component Folder index.ts
  const indexTemplate = `export * from './${componentPascalName}';
export { default } from './${componentPascalName}';
`;

  // 3. Compatibility Root Bridge
  const bridgeTemplate = `export { default } from './${componentPascalName}/index';
export * from './${componentPascalName}/index';
`;

  // 4. Docs MDX Template using <Preview component="...">
  const docsTemplate = `---
title: ${title}
category: ${category.trim()}
description: A new component for ShitUI
---

import { Preview } from '@/components/mdx/preview';
import { ${componentPascalName} } from '@/components/shitui/${componentPascalName}';
import { PropsTable } from '@/components/mdx/PropsTable';
import { UsageGuide } from '@/components/mdx/UsageGuide';
import { FeaturesList } from '@/components/mdx/FeaturesList';

<Preview component="${name}" cliCommand="npx shadcn@latest add @shitui/${name}">
  <${componentPascalName} />
</Preview>

<UsageGuide steps={[
  {
    title: "Import the component",
    code: \`'use client';
import { ${componentPascalName} } from '@/components/shitui/${componentPascalName}';\`
  },
  {
    title: "Render component",
    code: \`export default function Example() {
  return (
    <${componentPascalName}>
      ${title}
    </${componentPascalName}>
  );
}\`
  }
]} />

<FeaturesList
  features={[
    {
      title: 'Fluid Animation',
      description: 'Smooth spring physics and modern interactions.',
    },
    {
      title: 'Customizable',
      description: 'Easily configured with custom classes and props.',
    },
  ]}
/>

<PropsTable
  props={[
    {
      name: 'className',
      type: 'string',
      description: 'Additional CSS classes to customize styling.',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      description: 'Content to render inside the component.',
    },
  ]}
/>
`;

  // Write Component File
  if (fs.existsSync(compFile)) {
    console.log(`⚠️ Component already exists at ${compFile}`);
  } else {
    fs.writeFileSync(compFile, compTemplate);
    console.log(`✅ Created ${compFile}`);
  }

  // Write index.ts
  if (!fs.existsSync(compIndexFile)) {
    fs.writeFileSync(compIndexFile, indexTemplate);
    console.log(`✅ Created ${compIndexFile}`);
  }

  // Write Root Bridge File
  if (!fs.existsSync(compBridgeFile)) {
    fs.writeFileSync(compBridgeFile, bridgeTemplate);
    console.log(`✅ Created ${compBridgeFile}`);
  }

  // Write Docs File
  if (fs.existsSync(docsFile)) {
    console.log(`⚠️ Docs already exist at ${docsFile}`);
  } else {
    fs.writeFileSync(docsFile, docsTemplate);
    console.log(`✅ Created ${docsFile}`);
  }

  console.log('\\n🚀 Run \`npm run build:all\` to generate registry and sidebar!');
  rl.close();
}

main().catch(console.error);
