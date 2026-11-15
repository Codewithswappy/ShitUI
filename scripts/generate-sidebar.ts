import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import matter from 'gray-matter';

const ROOT = path.resolve(process.cwd(), 'content/docs/components');
const OUTPUT = path.resolve(process.cwd(), 'lib/sidebar-data.ts');
const PUBLIC_OUTPUT = path.resolve(process.cwd(), 'public/sidebar.json');

// Custom ordered static sections
const STATIC_SECTIONS = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs/introduction' },
      { title: 'Installation', href: '/docs/installation' },
      { title: 'RareUI is now ShitUI', href: '/docs/rareui-is-now-shitui' },
    ],
  },
];

// Preferred section order
const SECTION_ORDER = [
  'Components',
  'Text Animation',
  '3D Elements',
  'Interactive Background',
  'Sections',
];

function formatComponentTitle(fileName: string): string {
  return fileName.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

async function buildSidebar() {
  if (!fs.existsSync(ROOT)) {
    console.log(chalk.yellow(`⚠️  Directory not found: ${ROOT}`));
    return;
  }

  const files = fs.readdirSync(ROOT).filter((file) => file.endsWith('.mdx'));
  const grouped: Record<string, any[]> = {};

  for (const file of files) {
    const filePath = path.join(ROOT, file);
    const fileName = path.basename(file, '.mdx');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    const title = data.title || formatComponentTitle(fileName);
    const category = (data.category as string) || 'Components';
    const badge = data.badge as string | undefined;

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push({
      title,
      href: `/docs/components/${fileName}`,
      ...(badge && { badge }),
    });
  }

  // Sort items alphabetically within each group
  for (const cat in grouped) {
    grouped[cat].sort((a, b) => a.title.localeCompare(b.title));
  }

  // Build ordered sidebar sections
  const sections: any[] = [...STATIC_SECTIONS];

  // Add categories in preferred order first
  for (const catName of SECTION_ORDER) {
    if (grouped[catName] && grouped[catName].length > 0) {
      sections.push({
        title: catName,
        items: grouped[catName],
      });
      delete grouped[catName];
    }
  }

  // Add any remaining categories dynamically
  for (const [catName, items] of Object.entries(grouped)) {
    if (items.length > 0) {
      sections.push({
        title: catName,
        items,
      });
    }
  }

  try {
    const libDir = path.dirname(OUTPUT);
    if (!fs.existsSync(libDir)) {
      fs.mkdirSync(libDir, { recursive: true });
    }

    const tsContent = `export const sidebarData = ${JSON.stringify(sections, null, 2)};\n`;
    fs.writeFileSync(OUTPUT, tsContent);
    console.log(chalk.green(`✅ Sidebar generated successfully → ${OUTPUT}`));

    const publicDir = path.dirname(PUBLIC_OUTPUT);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    fs.writeFileSync(PUBLIC_OUTPUT, JSON.stringify(sections, null, 2));
    console.log(chalk.gray(`📄 Copy created for Command Palette → ${PUBLIC_OUTPUT}`));
  } catch (error) {
    console.error(chalk.red(`❌ Failed to write sidebar files:`), error);
  }
}

buildSidebar();
