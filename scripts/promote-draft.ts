// scripts/promote-draft.ts
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const draftId = args[0];

if (!draftId) {
  console.log('❌ Please provide the draft id or name to promote:');
  console.log('   Example: pnpm lab:promote neon-glow-card');
  process.exit(1);
}

const pascalName = draftId
  .split(/[-_]/)
  .filter(Boolean)
  .map((w) => {
    if (w.toLowerCase() === '3d') return '3D';
    return w.charAt(0).toUpperCase() + w.slice(1);
  })
  .join('');

const title = draftId
  .split(/[-_]/)
  .filter(Boolean)
  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  .join(' ');

const draftsDir = path.join(process.cwd(), 'components/lab/drafts');
const sourceFile = path.join(draftsDir, `${pascalName}.tsx`);

if (!fs.existsSync(sourceFile)) {
  console.log(`❌ Source draft not found: components/lab/drafts/${pascalName}.tsx`);
  process.exit(1);
}

// 1. Destination directories
const targetCompDir = path.join(process.cwd(), 'components/shitui', pascalName);
const targetCompFile = path.join(targetCompDir, `${pascalName}.tsx`);
const targetCompIndex = path.join(targetCompDir, 'index.ts');
const targetCompBridge = path.join(process.cwd(), 'components/shitui', `${pascalName}.tsx`);
const docsDir = path.join(process.cwd(), 'content/docs/components');
const docsFile = path.join(docsDir, `${draftId}.mdx`);

if (!fs.existsSync(targetCompDir)) {
  fs.mkdirSync(targetCompDir, { recursive: true });
}
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

// 2. Copy component source
fs.copyFileSync(sourceFile, targetCompFile);

// 3. Create index.ts
const indexContent = `export * from './${pascalName}';
export { default } from './${pascalName}';
`;
fs.writeFileSync(targetCompIndex, indexContent, 'utf-8');

// 4. Create compatibility bridge
const bridgeContent = `export { default } from './${pascalName}/index';
export * from './${pascalName}/index';
`;
fs.writeFileSync(targetCompBridge, bridgeContent, 'utf-8');

// 5. Create docs template
const docsContent = `---
title: ${title}
category: Components
description: Animated ${title} component built with Motion and Tailwind CSS.
---

import { Preview } from '@/components/mdx/preview';
import { ${pascalName} } from '@/components/shitui/${pascalName}';

## Preview

<Preview component="${draftId}" cliCommand="npx shadcn@latest add @shitui/${draftId}">
  <${pascalName} />
</Preview>

## Installation

\`\`\`bash
npx shadcn@latest add @shitui/${draftId}
\`\`\`

## Usage

\`\`\`tsx
import { ${pascalName} } from '@/components/shitui/${pascalName}';

export default function Example() {
  return <${pascalName} />;
}
\`\`\`
`;

if (!fs.existsSync(docsFile)) {
  fs.writeFileSync(docsFile, docsContent, 'utf-8');
}

console.log(`\n🎉 Successfully promoted "${draftId}" to official ShitUI library!`);
console.log(`   📁 Component: components/shitui/${pascalName}/`);
console.log(`   📄 Docs: content/docs/components/${draftId}.mdx`);
console.log(`\nRun "pnpm build:all" to regenerate sidebar and registry entries.`);
