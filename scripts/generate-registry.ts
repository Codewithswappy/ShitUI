import fs from 'fs';
import path from 'path';

const componentsDir = path.join(process.cwd(), 'components/shitui');
const registryDir = path.join(process.cwd(), 'public/r');

interface RegistryComponent {
  $schema?: string;
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: Array<{
    path: string;
    content: string;
    type: string;
    target?: string;
  }>;
}

const SPECIAL_KEBAB: Record<string, string> = {
  Book3D: 'book-3d',
  LiquidWaveLazy: 'liquid-wave-lazy',
  VaporSmokeText: 'vapor-smoke-text',
  MagneticScatterText: 'magnetic-scatter-text',
  ToastTabs: 'toast-tabs',
  AnimatedTab: 'animated-tab',
  SoundText: 'sound-text',
  WordMagnet: 'word-magnet',
  LiquidButton: 'liquid-button',
  LiquidTooltip: 'liquid-tooltip',
  LiquidWave: 'liquid-wave',
  LoadingSpinner: 'loading-spinner',
  FloatingNavigation: 'floating-navigation',
  DynamicIslandNav: 'dynamic-island-nav',
  InteractiveContactButton: 'interactive-contact-button',
  PremiumButton: 'premium-button',
  RetroPixelButton: 'retro-pixel-button',
  SplitFaq: 'split-faq',
};

const COMPONENT_TITLES: Record<string, string> = {
  'split-faq': 'Split FAQ',
  'book-3d': 'Book 3D',
  'animated-tab': 'Animated Tab',
  'dynamic-island-nav': 'Dynamic Island Navigation',
  'interactive-contact-button': 'Interactive Contact Button',
  'floating-navigation': 'Floating Navigation',
  'liquid-button': 'Liquid Button',
  'liquid-tooltip': 'Liquid Tooltip',
  'liquid-wave': 'Liquid Wave',
  'liquid-wave-lazy': 'Liquid Wave Lazy',
  'loading-spinner': 'Loading Spinner',
  'magnetic-scatter-text': 'Magnetic Scatter Text',
  'premium-button': 'Premium Button',
  'retro-pixel-button': 'Retro Pixel Button',
  'sound-text': 'Sound Text',
  'toast-tabs': 'Toast Tabs',
  'vapor-smoke-text': 'Vapor Smoke Text',
  'word-magnet': 'Word Magnet',
};

const COMPONENT_DESCRIPTIONS: Record<string, string> = {
  'animated-tab': 'A set of animated navigation tabs with smooth sliding pill highlight.',
  'book-3d': 'An interactive 3D book component with realistic hover perspective tilt.',
  'dynamic-island-nav': 'An iOS-inspired adaptive Dynamic Island navigation bar with fluid physics.',
  'floating-navigation': 'A sleek floating navigation bar with fluid hover pill.',
  'interactive-contact-button': 'A tactile floating contact button that expands into an interactive profile card.',
  'liquid-button': 'An interactive gooey liquid dripping hover effect button.',
  'liquid-tooltip': 'A fluid liquid-expanding tooltip with smooth spring physics.',
  'liquid-wave': 'A smooth canvas-based interactive liquid wave fluid simulation.',
  'liquid-wave-lazy': 'Lazy-loaded interactive liquid wave canvas component.',
  'loading-spinner': 'A modern neon ring spinner with smooth cubic-bezier rotation.',
  'magnetic-scatter-text': 'Interactive text characters that scatter dynamically from cursor.',
  'premium-button': 'A luxury gradient border button with subtle shimmer glow.',
  'retro-pixel-button': 'A playful 8-bit retro arcade pixel button with press animation.',
  'sound-text': 'Animated typography that synchronizes with audio frequencies.',
  'split-faq': 'Grouped FAQ that splits on click. Open question detaches into its own card while others regroup and merge back.',
  'toast-tabs': 'Interactive toast-styled notification tabs with spring animations.',
  'vapor-smoke-text': 'Atmospheric vapor and smoke particle text distortion effect.',
  'word-magnet': 'Interactive magnetic word clouds that attract toward the cursor.',
};

// Convert PascalCase to kebab-case
function pascalToKebab(str: string): string {
  if (SPECIAL_KEBAB[str]) return SPECIAL_KEBAB[str];
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

// Convert PascalCase to human-readable title
function pascalToTitle(str: string, kebab: string): string {
  if (COMPONENT_TITLES[kebab]) return COMPONENT_TITLES[kebab];
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .trim();
}

// Map of packages that need @types/* packages
const TYPE_PACKAGES_MAP: Record<string, string> = {
  react: '@types/react',
  'react-dom': '@types/react-dom',
  node: '@types/node',
  three: '@types/three',
};

function extractDeps(content: string): { deps: string[]; registryDeps: string[] } {
  const deps = new Set<string>();
  const registryDeps = new Set<string>();
  const regex = /from\s+['"]([^'"]+)['"]/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const importPath = match[1];

    if (importPath.startsWith('@/components/shitui/')) {
      const compName = importPath.split('/').pop();
      if (compName) registryDeps.add(pascalToKebab(compName));
    } else if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
      let packageName = importPath;
      if (packageName.startsWith('@')) {
        const parts = packageName.split('/');
        packageName = parts.length > 1 ? `${parts[0]}/${parts[1]}` : parts[0];
      } else {
        packageName = importPath.split('/')[0];
      }
      if (packageName && !['fs', 'path', 'url', 'crypto', 'stream'].includes(packageName)) {
        deps.add(packageName);
      }
    }
  }
  return { deps: Array.from(deps), registryDeps: Array.from(registryDeps) };
}

function getDevDeps(deps: string[]): string[] {
  const devDeps = new Set<string>();
  deps.forEach((dep) => {
    if (TYPE_PACKAGES_MAP[dep]) {
      devDeps.add(TYPE_PACKAGES_MAP[dep]);
    }
  });
  return Array.from(devDeps);
}

const EXCLUDED_FOLDERS = [
  'modal',
  'search-context',
  '3D elements',
  'interactive-background',
  'Sections',
  'Text Animation',
];

function generate() {
  if (!fs.existsSync(registryDir)) {
    fs.mkdirSync(registryDir, { recursive: true });
  } else {
    // Clear out stale .json files in public/r
    const existing = fs.readdirSync(registryDir);
    for (const f of existing) {
      if (f.endsWith('.json')) {
        fs.unlinkSync(path.join(registryDir, f));
      }
    }
  }

  const components: RegistryComponent[] = [];
  const entries = fs.readdirSync(componentsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (EXCLUDED_FOLDERS.includes(entry.name)) continue;

      const folderPath = path.join(componentsDir, entry.name);
      const files = fs.readdirSync(folderPath);
      const componentFiles: any[] = [];
      const allDeps = new Set<string>();
      const allRegistryDeps = new Set<string>();

      for (const file of files) {
        if (file.endsWith('.test.tsx') || file.endsWith('.test.ts')) continue;
        if (file.toLowerCase().includes('demo')) continue;
        if (!file.endsWith('.tsx') && !file.endsWith('.ts')) continue;
        // Skip index.ts re-export barrel files so users get a clean single component file like other libraries
        if (file === 'index.ts' || file === 'index.tsx') continue;

        const filePath = path.join(folderPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const kebab = pascalToKebab(entry.name);

        const { deps, registryDeps } = extractDeps(content);
        deps.forEach((d) => allDeps.add(d));
        registryDeps.forEach((rd) => allRegistryDeps.add(rd));

        // Use standard shadcn "ui/<kebab>.tsx" path so shadcn CLI routes it directly to @/components/ui/<kebab>.tsx
        componentFiles.push({
          path: `ui/${kebab}.tsx`,
          content,
          type: 'registry:ui',
        });
      }

      if (componentFiles.length > 0) {
        const kebab = pascalToKebab(entry.name);
        const depsArray = Array.from(allDeps);
        const devDeps = getDevDeps(depsArray);

        components.push({
          $schema: 'https://ui.shadcn.com/schema/registry-item.json',
          name: kebab,
          type: 'registry:ui',
          title: pascalToTitle(entry.name, kebab),
          description: COMPONENT_DESCRIPTIONS[kebab] || `${pascalToTitle(entry.name, kebab)} component for React.`,
          dependencies: depsArray,
          devDependencies: devDeps.length > 0 ? devDeps : undefined,
          registryDependencies: Array.from(allRegistryDeps),
          files: componentFiles,
        });

        // Also record folder name on component for alias generation
        (components[components.length - 1] as any).folderName = entry.name;
      }
    }
  }

  // Sort alphabetically by name
  components.sort((a, b) => a.name.localeCompare(b.name));

  // Write individual component files (both kebab-case and aliases for shadcn & shitui CLI compatibility)
  components.forEach((comp) => {
    const folderName = (comp as any).folderName || comp.name;
    const cleanComp = { ...comp };
    delete (cleanComp as any).folderName;

    const jsonStr = JSON.stringify(cleanComp, null, 2);

    // 1. Primary kebab-case (shadcn default: e.g. liquid-button.json)
    fs.writeFileSync(path.join(registryDir, `${comp.name}.json`), jsonStr);

    // 2. Pascal-case alias (e.g. LiquidButton.json, Book3D.json)
    if (folderName && folderName !== comp.name) {
      const pascalComp = { ...cleanComp, name: folderName };
      fs.writeFileSync(path.join(registryDir, `${folderName}.json`), JSON.stringify(pascalComp, null, 2));
    }

    // 3. Lowercase-flat alias (e.g. book3d.json)
    const flatLower = folderName.toLowerCase();
    if (flatLower !== comp.name && flatLower !== folderName) {
      fs.writeFileSync(path.join(registryDir, `${flatLower}.json`), jsonStr);
    }
  });

  // Write official shadcn registry root: public/r/registry.json
  const shadcnRegistry = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'shitui',
    homepage: 'https://shitui.in',
    items: components.map((c) => {
      const clean = { ...c };
      delete (clean as any).folderName;
      return {
        name: clean.name,
        type: clean.type,
        title: clean.title,
        description: clean.description,
        dependencies: clean.dependencies,
        registryDependencies: clean.registryDependencies,
        files: clean.files.map((f) => ({
          path: f.path,
          type: f.type,
        })),
      };
    }),
  };
  fs.writeFileSync(path.join(registryDir, 'registry.json'), JSON.stringify(shadcnRegistry, null, 2));

  // Write index.json for backward compatibility with CLI & @shitui registry format
  fs.writeFileSync(
    path.join(registryDir, 'index.json'),
    JSON.stringify(
      {
        name: '@shitui',
        components: components.map((c) => c.name),
      },
      null,
      2
    )
  );

  console.log(`✅ Generated shadcn-compatible registry for ${components.length} components`);
}

generate();
