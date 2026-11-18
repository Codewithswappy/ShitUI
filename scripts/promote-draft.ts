// scripts/promote-draft.ts
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const draftId = args[0];

if (!draftId) {
  console.log('❌ Please provide the draft id or name to promote:');
  console.log('   Example: pnpm lab:promote split-faq');
  process.exit(1);
}

const pascalName = draftId
  .split(/[-_]/)
  .filter(Boolean)
  .map((w) => {
    if (w.toLowerCase() === '3d') return '3D';
    if (w.toLowerCase() === 'faq') return 'Faq';
    return w.charAt(0).toUpperCase() + w.slice(1);
  })
  .join('');

let title = draftId
  .split(/[-_]/)
  .filter(Boolean)
  .map((w) => {
    if (w.toLowerCase() === '3d') return '3D';
    if (w.toLowerCase() === 'faq') return 'FAQ';
    return w.charAt(0).toUpperCase() + w.slice(1);
  })
  .join(' ');

let description = `Interactive ${title} component built with Motion and Tailwind CSS.`;
let tags: string[] = ['React', 'Motion', 'Tailwind', 'Interactive'];
let category = 'Components';

// 1. Read metadata from components/lab/registry.ts if available
const registryFile = path.join(process.cwd(), 'components/lab/registry.ts');
if (fs.existsSync(registryFile)) {
  const regContent = fs.readFileSync(registryFile, 'utf-8');
  // Look for draft object matching id: 'draftId'
  const draftRegex = new RegExp(
    `{\\s*id:\\s*['"\`]${draftId}['"\`][^}]+}`,
    's'
  );
  const match = regContent.match(draftRegex);
  if (match) {
    const block = match[0];
    const nameMatch = block.match(/name:\s*['"\`]([^'"\`]+)['"\`]/);
    if (nameMatch) title = nameMatch[1];

    const descMatch = block.match(/description:\s*['"\`]([^'"\`]+)['"\`]/);
    if (descMatch) description = descMatch[1].replace(/\n\s*/g, ' ').trim();

    const catMatch = block.match(/category:\s*['"\`]([^'"\`]+)['"\`]/);
    if (catMatch) {
      const rawCat = catMatch[1].toLowerCase();
      if (['accordion', 'faq', 'blocks', 'block'].includes(rawCat)) {
        category = 'Blocks';
      } else if (rawCat.includes('text')) {
        category = 'Text';
      } else if (rawCat.includes('3d')) {
        category = '3D';
      } else if (rawCat.includes('background')) {
        category = 'Backgrounds';
      } else {
        category = 'Components';
      }
    }

    const tagsMatch = block.match(/tags:\s*\[([^\]]+)\]/);
    if (tagsMatch) {
      tags = tagsMatch[1]
        .split(',')
        .map((t) => t.trim().replace(/['"\`]/g, ''))
        .filter(Boolean)
        .map((t) => t.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
    }
  }
}

const draftsDir = path.join(process.cwd(), 'components/lab/drafts');
let sourceFile = path.join(draftsDir, `${pascalName}.tsx`);

if (!fs.existsSync(sourceFile)) {
  const files = fs.existsSync(draftsDir) ? fs.readdirSync(draftsDir) : [];
  const match = files.find(
    (f) =>
      f.toLowerCase() === `${pascalName.toLowerCase()}.tsx` ||
      f.toLowerCase() === `${draftId.toLowerCase()}.tsx` ||
      f.toLowerCase() === `${draftId.replace(/[-_]/g, '').toLowerCase()}.tsx`
  );
  if (match) {
    sourceFile = path.join(draftsDir, match);
  } else {
    console.log(`❌ Source draft not found: components/lab/drafts/${pascalName}.tsx`);
    process.exit(1);
  }
}

// 2. Destination directories
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

// 3. Copy component source
fs.copyFileSync(sourceFile, targetCompFile);

// 4. Create index.ts
const indexContent = `export * from './${pascalName}';
export { default } from './${pascalName}';
`;
fs.writeFileSync(targetCompIndex, indexContent, 'utf-8');

// 5. Create compatibility bridge
const bridgeContent = `export { default } from './${pascalName}/index';
export * from './${pascalName}/index';
`;
fs.writeFileSync(targetCompBridge, bridgeContent, 'utf-8');

// 6. Create docs template
const docsContent = `---
title: ${title}
category: ${category}
badge: New
description: ${description}
---

import { Preview } from '@/components/mdx/preview';
import { PropsTable } from '@/components/mdx/PropsTable';
import { UsageGuide } from '@/components/mdx/UsageGuide';
import { FeaturesList } from '@/components/mdx/FeaturesList';
import { ${pascalName} } from '@/components/shitui/${pascalName}';

<Preview component="${draftId}" cliCommand="npx shadcn@latest add @shitui/${draftId}">
  <div className="w-full flex items-center justify-center py-6 sm:py-10">
    <${pascalName} />
  </div>
</Preview>

<UsageGuide
  steps={[
    {
      title: 'Import the component',
      code: \`import { ${pascalName} } from '@/components/shitui/${pascalName}';\`,
    },
    {
      title: 'Use in your application',
      description: 'Render ${title} with default options or custom props.',
      code: \`export default function Example() {
  return <${pascalName} />;
}\`,
    },
  ]}
/>

<FeaturesList
  features={[
    {
      title: 'Kinetic Motion & Micro-Interactions',
      description: 'Smooth spring animations and physics-based fluid state changes.',
    },
    {
      title: 'Fully Accessible',
      description: 'Screen reader friendly with semantic HTML and keyboard navigation.',
    },
    {
      title: 'Tailwind CSS Native',
      description: 'Zero external CSS bundles; styled purely with standard utility classes.',
    },
  ]}
/>

<PropsTable
  props={[
    {
      name: 'className',
      type: 'string',
      default: 'undefined',
      description: 'Additional Tailwind CSS classes applied to the root element.',
    },
  ]}
/>
`;

if (!fs.existsSync(docsFile)) {
  fs.writeFileSync(docsFile, docsContent, 'utf-8');
}

// 7. Register in components/new-design-components/component-credits-data.ts
const creditsFile = path.join(process.cwd(), 'components/new-design-components/component-credits-data.ts');
if (fs.existsSync(creditsFile)) {
  let creditsContent = fs.readFileSync(creditsFile, 'utf-8');
  if (!creditsContent.includes(`'${draftId}':`)) {
    const formattedTags = JSON.stringify(tags);
    const newEntry = `  '${draftId}': {
    title: '${title}',
    description:
      '${description.replace(/'/g, "\\'")}',
    tags: ${formattedTags},
    version: 'v1.0.0',
    lastUpdated: 'Nov 2026',
    related: [
      { title: 'Liquid Wave', href: '/docs/components/liquid-wave' },
      { title: 'Animated Tab', href: '/docs/components/animated-tab' },
    ],
    credit: DEFAULT_CREDIT,
  },
`;
    creditsContent = creditsContent.replace(
      'export const COMPONENT_DETAILS_REGISTRY: Record<string, ComponentDetails> = {',
      `export const COMPONENT_DETAILS_REGISTRY: Record<string, ComponentDetails> = {\n${newEntry}`
    );
    fs.writeFileSync(creditsFile, creditsContent, 'utf-8');
    console.log(`   🏷️  Registered in COMPONENT_DETAILS_REGISTRY (right panel metadata)`);
  }
}

console.log(`\n🎉 Successfully promoted "${draftId}" to official ShitUI library!`);
console.log(`   📁 Component: components/shitui/${pascalName}/`);
console.log(`   📄 Docs: content/docs/components/${draftId}.mdx`);
console.log(`\nRun "pnpm build:all" to regenerate sidebar and registry entries.`);
