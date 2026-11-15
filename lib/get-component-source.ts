import fs from 'fs';
import path from 'path';

/**
 * Normalizes a string by converting to lowercase and stripping all dashes, underscores, and spaces.
 * e.g. "animated-tabs" -> "animatedtabs"
 */
function normalize(str: string): string {
  return str.toLowerCase().replace(/[-_\s]/g, '');
}

/**
 * Converts a kebab-case string to PascalCase.
 * e.g. "liquid-button" -> "LiquidButton"
 *      "book-3d" -> "Book3D"
 */
function toPascalCase(str: string): string {
  return str
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => {
      if (word.toLowerCase() === '3d') return '3D';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');
}

/**
 * Reads the component source code from components/shitui/ on the server.
 * Supports:
 * - Direct PascalCase folder & file: components/shitui/<PascalName>/<PascalName>.tsx
 * - Singular/plural variations: e.g. "animated-tabs" -> AnimatedTab/AnimatedTab.tsx
 * - Case-insensitive and dash-normalized lookup
 * - Root level files: components/shitui/<PascalName>.tsx
 * - Category subdirectories: components/shitui/<Category>/<PascalName>/<PascalName>.tsx
 *
 * Gracefully returns a fallback message if not found without throwing errors.
 */
export function getComponentSource(componentNameOrSlug: string): string {
  if (!componentNameOrSlug || typeof componentNameOrSlug !== 'string') {
    return '';
  }

  const cleanName = componentNameOrSlug.trim();
  const baseDir = path.join(process.cwd(), 'components/shitui');

  if (!fs.existsSync(baseDir)) {
    return `// components/shitui directory not found.`;
  }

  const pascal = toPascalCase(cleanName);
  const targetNorm = normalize(cleanName);
  const singularNorm = targetNorm.endsWith('s') ? targetNorm.slice(0, -1) : targetNorm;
  const pluralNorm = targetNorm + 's';

  const singularPascal = pascal.endsWith('s') ? pascal.slice(0, -1) : pascal;
  const pluralPascal = pascal.endsWith('s') ? pascal : `${pascal}s`;

  /**
   * Helper to read a candidate file and follow any re-export bridges (e.g. export * from './...')
   */
  const readSourceFile = (filePath: string): string | null => {
    try {
      if (!fs.existsSync(filePath)) return null;
      const content = fs.readFileSync(filePath, 'utf-8');

      // If it's a short re-export file, follow it to the target file
      if (content.length < 500 && /export\s+.*from\s+['"]\.\/([^'"]+)['"]/.test(content)) {
        const match = content.match(/from\s+['"]\.\/([^'"]+)['"]/);
        if (match && match[1]) {
          const dir = path.dirname(filePath);
          const resolvedBase = path.resolve(dir, match[1]);
          const targets = [
            `${resolvedBase}.tsx`,
            `${resolvedBase}.ts`,
            path.join(resolvedBase, `${path.basename(resolvedBase)}.tsx`),
            path.join(resolvedBase, `${singularPascal}.tsx`),
            path.join(resolvedBase, `${pascal}.tsx`),
            path.join(resolvedBase, 'index.tsx'),
            path.join(resolvedBase, 'index.ts'),
          ];
          for (const target of targets) {
            if (fs.existsSync(target) && target !== filePath) {
              const nested = readSourceFile(target);
              if (nested) return nested;
            }
          }
        }
      }

      return content;
    } catch {
      return null;
    }
  };

  // 1. Direct folder candidate checks: components/shitui/<PascalName>/<PascalName>.tsx
  const directFolderCandidates = [
    path.join(baseDir, pascal, `${pascal}.tsx`),
    path.join(baseDir, singularPascal, `${singularPascal}.tsx`),
    path.join(baseDir, pluralPascal, `${pluralPascal}.tsx`),
    path.join(baseDir, pascal, 'index.tsx'),
    path.join(baseDir, singularPascal, 'index.tsx'),
    path.join(baseDir, pascal, 'index.ts'),
    path.join(baseDir, singularPascal, 'index.ts'),
    // Root files (resolved through bridges if needed)
    path.join(baseDir, `${pascal}.tsx`),
    path.join(baseDir, `${singularPascal}.tsx`),
  ];

  for (const candidate of directFolderCandidates) {
    const content = readSourceFile(candidate);
    if (content) {
      return content;
    }
  }

  // 2. Scan all entries in components/shitui/
  try {
    const entries = fs.readdirSync(baseDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const folderNorm = normalize(entry.name);
        const isMatch =
          folderNorm === targetNorm ||
          folderNorm === singularNorm ||
          folderNorm === pluralNorm;

        if (isMatch) {
          const folderPath = path.join(baseDir, entry.name);
          const candidates = [
            path.join(folderPath, `${entry.name}.tsx`),
            path.join(folderPath, `${pascal}.tsx`),
            path.join(folderPath, `${singularPascal}.tsx`),
            path.join(folderPath, 'index.tsx'),
            path.join(folderPath, 'index.ts'),
          ];

          for (const cand of candidates) {
            const content = readSourceFile(cand);
            if (content) return content;
          }
        }
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        const fileNorm = normalize(path.parse(entry.name).name);
        if (fileNorm === targetNorm || fileNorm === singularNorm || fileNorm === pluralNorm) {
          const content = readSourceFile(path.join(baseDir, entry.name));
          if (content) return content;
        }
      }
    }

    // 3. Scan sub-category directories if present
    const categoryDirs = ['3D elements', 'interactive-background', 'Sections', 'Text Animation'];
    for (const cat of categoryDirs) {
      const catPath = path.join(baseDir, cat);
      if (fs.existsSync(catPath)) {
        const catEntries = fs.readdirSync(catPath, { withFileTypes: true });
        for (const catEntry of catEntries) {
          const catNorm = normalize(path.parse(catEntry.name).name);
          if (catNorm === targetNorm || catNorm === singularNorm || catNorm === pluralNorm) {
            const fullPath = path.join(catPath, catEntry.name);
            if (catEntry.isDirectory()) {
              const fileInDir = path.join(fullPath, `${catEntry.name}.tsx`);
              if (fs.existsSync(fileInDir)) return fs.readFileSync(fileInDir, 'utf-8');
            } else if (catEntry.name.endsWith('.tsx') || catEntry.name.endsWith('.ts')) {
              return fs.readFileSync(fullPath, 'utf-8');
            }
          }
        }
      }
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[getComponentSource] Error reading directory:`, err);
    }
  }

  // Graceful fallback: Never crash the build
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `[getComponentSource] Component source not found for: "${componentNameOrSlug}". Checked components/shitui/${pascal}/${pascal}.tsx`
    );
  }

  return `// Component source not found for: "${componentNameOrSlug}"\n// Expected location: components/shitui/${pascal}/${pascal}.tsx`;
}

export default getComponentSource;
