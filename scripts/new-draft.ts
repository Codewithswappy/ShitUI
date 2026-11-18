// scripts/new-draft.ts
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const name = args[0] || 'sample-component';
const category = args[1] || 'experiments';

const pascalName = name
  .split(/[-_]/)
  .filter(Boolean)
  .map((w) => {
    if (w.toLowerCase() === '3d') return '3D';
    return w.charAt(0).toUpperCase() + w.slice(1);
  })
  .join('');

const title = name
  .split(/[-_]/)
  .filter(Boolean)
  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  .join(' ');

const draftsDir = path.join(process.cwd(), 'components/lab/drafts');
const targetFile = path.join(draftsDir, `${pascalName}.tsx`);
const registryFile = path.join(process.cwd(), 'components/lab/registry.ts');

if (!fs.existsSync(draftsDir)) {
  fs.mkdirSync(draftsDir, { recursive: true });
}

if (fs.existsSync(targetFile)) {
  console.log(`⚠️ Draft already exists: components/lab/drafts/${pascalName}.tsx`);
  process.exit(0);
}

const template = `'use client';

import * as React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

export interface ${pascalName}Props extends HTMLMotionProps<'div'> {
  className?: string;
}

export function ${pascalName}({ className, ...props }: ${pascalName}Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'relative cursor-pointer rounded-2xl border border-neutral-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-900/80',
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-primary">
          ${category}
        </span>
        <h4 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          ${title}
        </h4>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Prototype created in /lab. Edit in components/lab/drafts/${pascalName}.tsx
        </p>
      </div>
    </motion.div>
  );
}

export default ${pascalName};
`;

fs.writeFileSync(targetFile, template, 'utf-8');
console.log(`✅ Created draft: components/lab/drafts/${pascalName}.tsx`);

// Update registry.ts if file exists
if (fs.existsSync(registryFile)) {
  let content = fs.readFileSync(registryFile, 'utf-8');

  // Add import
  const importStatement = `import ${pascalName} from './drafts/${pascalName}';\n`;
  if (!content.includes(`import ${pascalName}`)) {
    content = importStatement + content;
  }

  // Add to LAB_DRAFTS array
  const draftEntry = `  {
    id: '${name}',
    name: '${title}',
    category: '${category}',
    description: 'Experimental ${title} draft component.',
    component: ${pascalName},
    tags: ['motion', '${category}'],
  },\n];`;

  content = content.replace(/\n\];/, `,\n${draftEntry}`);
  fs.writeFileSync(registryFile, content, 'utf-8');
  console.log(`✅ Registered in: components/lab/registry.ts`);
}

console.log(`\n🚀 Open http://localhost:3000/lab to test your new component!`);
