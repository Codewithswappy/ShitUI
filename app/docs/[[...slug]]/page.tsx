import Link from 'next/link';
import { source } from '@/lib/source';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';

import fs from 'fs';
import path from 'path';
import { NewComponentPreview } from '@/components/new-design-components/NewComponentPreview';
import { ComponentPageStage } from '@/components/new-design-components/ComponentPageStage';
import { FloatingDocIndex } from '@/components/new-design-components/FloatingDocIndex';
import { CopyMarkdownButton } from '@/components/new-design-components/CopyMarkdownButton';
import { getComponentSource } from '@/lib/get-component-source';

const componentPageOnlyComponents = {
  Preview: ({ children, code, component, cliCommand, ...props }: any) => {
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
  },
  PreviewCode: ({ children, code, component, ...props }: any) => {
    const resolvedCode = code || (component ? getComponentSource(component) : '') || '';
    return (
      <NewComponentPreview code={resolvedCode} component={component} {...props}>
        {children}
      </NewComponentPreview>
    );
  },
  p: () => null,
  h1: () => null,
  h2: () => null,
  h3: () => null,
  h4: () => null,
  h5: () => null,
  h6: () => null,
  ul: () => null,
  ol: () => null,
  li: () => null,
  table: () => null,
  thead: () => null,
  tbody: () => null,
  tr: () => null,
  th: () => null,
  td: () => null,
  pre: () => null,
  code: () => null,
  blockquote: () => null,
  hr: () => null,
  a: () => null,
  strong: () => null,
  em: () => null,
  PropsTable: () => null,
  UsageGuide: () => null,
  FeaturesList: () => null,
  Step: () => null,
  Steps: () => null,
  Tab: () => null,
  Tabs: () => null,
};

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { DocUsageGuide } from '@/components/new-design-components/DocUsageGuide';
import { DocPropsTable } from '@/components/new-design-components/DocPropsTable';
import { DocContact } from '@/components/new-design-components/DocContact';
import { GuideCodeBlock } from '@/components/new-design-components/GuideCodeBlock';

const componentDocComponents = {
  Preview: () => null,
  PreviewCode: () => null,
  FeaturesList: () => null,
  DocInstallation: () => null,
  Installation: () => null,
  UsageGuide: (props: any) => {
    // Only render primary How to Use / Usage guide, suppress extra Examples blocks
    if (props.title?.toLowerCase() === 'examples') return null;
    return <DocUsageGuide {...props} />;
  },
  PropsTable: (props: any) => <DocPropsTable {...props} />,
  // Suppress all extra markdown text/headings (Interactions, Tips, PageData Interface, Page Types, etc.)
  h1: () => null,
  h2: () => null,
  h3: () => null,
  h4: () => null,
  h5: () => null,
  h6: () => null,
  p: () => null,
  ul: () => null,
  ol: () => null,
  li: () => null,
  pre: () => null,
  code: () => null,
  blockquote: () => null,
  hr: () => null,
  table: () => null,
  thead: () => null,
  tbody: () => null,
  tr: () => null,
  th: () => null,
  td: () => null,
  Step: () => null,
  Steps: () => null,
  Tab: () => null,
  Tabs: () => null,
  details: () => null,
  summary: () => null,
  a: () => null,
  strong: () => null,
  em: () => null,
};

const guideDocComponents = {
  Preview: ({ children, code, component, cliCommand, ...props }: any) => {
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
  },
  PreviewCode: ({ children, code, component, ...props }: any) => {
    const resolvedCode = code || (component ? getComponentSource(component) : '') || '';
    return (
      <NewComponentPreview code={resolvedCode} component={component} {...props}>
        {children}
      </NewComponentPreview>
    );
  },
  h1: ({ children, id, ...props }: any) => {
    const slug = id || (typeof children === 'string' ? children.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : undefined);
    return (
      <h1
        id={slug}
        className="font-medium text-xl sm:text-2xl tracking-tight text-foreground scroll-m-20 border-b border-border/40 pb-3 mt-7 mb-3 first:mt-0"
        {...props}
      >
        {children}
      </h1>
    );
  },
  h2: ({ children, id, ...props }: any) => {
    const slug = id || (typeof children === 'string' ? children.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : undefined);
    return (
      <h2
        id={slug}
        className="font-medium text-base sm:text-lg tracking-tight text-foreground scroll-m-20 border-b border-border/40 pb-2 mt-6 mb-2.5 first:mt-0"
        {...props}
      >
        {children}
      </h2>
    );
  },
  h3: ({ children, id, ...props }: any) => {
    const slug = id || (typeof children === 'string' ? children.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : undefined);
    return (
      <h3
        id={slug}
        className="font-medium text-[13px] sm:text-sm tracking-tight text-foreground scroll-m-20 mt-4 mb-1.5"
        {...props}
      >
        {children}
      </h3>
    );
  },
  p: ({ children, ...props }: any) => (
    <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed mb-2.5 last:mb-0" {...props}>
      {children}
    </p>
  ),
  strong: ({ children, ...props }: any) => (
    <strong className="font-medium text-foreground" {...props}>
      {children}
    </strong>
  ),
  a: ({ children, href, ...props }: any) => {
    const isExternal = href?.startsWith('http://') || href?.startsWith('https://');
    return (
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="inline-flex items-center gap-1 font-medium text-primary hover:text-primary bg-primary/10 hover:bg-primary/15 border border-primary/20 hover:border-primary/30 rounded-md px-1.5 py-0.5 text-[8px] sm:text-xs transition-colors no-underline align-baseline mx-0.5 mt-1 shadow-xs"
        {...props}
      >
        <span className='text-[10px]'>{children}</span>
        {isExternal && <ExternalLink className="h-2.5 w-2.5 opacity-70" />}
      </a>
    );
  },
  ul: ({ children, ...props }: any) => (
    <ul className="my-2 ml-4 list-disc space-y-1 text-xs sm:text-[13px] text-muted-foreground" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="my-2 ml-4 list-decimal space-y-1 text-xs sm:text-[13px] text-muted-foreground" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  hr: () => <hr className="my-5 border-border/40" />,
  code: ({ children, className, ...props }: any) => {
    if (className?.includes('language-')) {
      return <code className={className} {...props}>{children}</code>;
    }
    return (
      <code
        className="rounded-md border border-border/60 bg-muted/30 dark:bg-neutral-900/40 px-1.5 py-0.5 font-mono text-[11px] font-medium text-foreground"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: GuideCodeBlock,
  Steps: ({ children }: any) => (
    <div className="relative border-l border-border/60 pl-5 my-4 space-y-5">
      {children}
    </div>
  ),
  Step: ({ children }: any) => (
    <div className="relative">
      {children}
    </div>
  ),
  details: ({ children, ...props }: any) => (
    <details
      className="my-3 rounded-xl border border-border/60 bg-muted/15 dark:bg-neutral-900/30 p-3.5 backdrop-blur-xs text-xs sm:text-[13px] text-muted-foreground [&_summary]:font-medium [&_summary]:text-foreground [&_summary]:cursor-pointer [&_summary]:select-none"
      {...props}
    >
      {children}
    </details>
  ),
};

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const slug = params.slug ?? [];

  // When visiting /docs directly, redirect to introduction
  if (slug.length === 0) {
    redirect('/docs/introduction');
  }

  // When visiting /docs/components, redirect to first component
  if (slug.length === 1 && slug[0] === 'components') {
    redirect('/docs/components/animated-tab');
  }

  // Redirect legacy nested /docs/installation/* routes to /docs/installation
  if (slug.length > 1 && slug[0] === 'installation') {
    redirect('/docs/installation');
  }

  let page = source.getPage(slug);

  // Fallback 1: Resolve legacy category URLs (e.g. /docs/3d-elements/book-3d -> /docs/components/book-3d)
  if (!page && slug.length >= 2) {
    const legacyCategories = ['3d-elements', 'text-animation', 'interactive-background', 'sections'];
    if (legacyCategories.includes(slug[0])) {
      page = source.getPage(['components', slug[1]]);
    }
  }

  // Fallback 2: match case-insensitively or normalized without hyphens/underscores
  if (!page) {
    const allPages = source.getPages();
    const joined = slug.join('/').toLowerCase().replace(/[-_]/g, '');
    const matched = allPages.find((p) => {
      const pJoined = p.slugs.join('/').toLowerCase().replace(/[-_]/g, '');
      return pJoined === joined;
    });
    if (matched) {
      page = matched;
    }
  }

  if (!page) {
    notFound();
  }

  const MDX = page.data.body;

  const isComponentPage =
    slug.length > 0 &&
    [
      'components',
      '3d-elements',
      'text-animation',
      'interactive-background',
      'sections',
    ].includes(slug[0]);

  if (isComponentPage) {
    return (
      <ComponentPageStage
        key={page.url}
        title={page.data.title}
        description={page.data.description}
        previewContent={<MDX components={componentPageOnlyComponents} />}
        docContent={<MDX components={componentDocComponents} />}
      />
    );
  }

  // Load raw markdown for doc guides (e.g. Getting Started: introduction, installation)
  let rawMarkdown = '';
  try {
    const filePath = path.join(process.cwd(), 'content/docs', `${slug.join('/')}.mdx`);
    if (fs.existsSync(filePath)) {
      rawMarkdown = fs.readFileSync(filePath, 'utf-8');
    }
  } catch {
    // ignore
  }

  return (
    <div
      data-slot="new-component-stage-wrapper"
      className="relative flex h-full w-full flex-col overflow-hidden p-4 pt-4 pb-0 pl-4 pr-1 gap-3"
    >
      {/* 1. TOP ACTION ROW: Physically ABOVE the dither border and doc stage */}
      <div className="relative z-40 flex items-center justify-end w-full shrink-0 min-h-[36px]">
        {rawMarkdown && (
          <CopyMarkdownButton rawMarkdown={rawMarkdown} />
        )}
      </div>

      {/* 2. DOC STAGE CONTAINER */}
      <div
        data-slot="new-component-preview"
        className="relative flex flex-1 w-full items-center justify-center overflow-hidden"
      >
        {/* Inner framed content stage matching NewComponentPreview (flush at the bottom) */}
        <div className="relative z-10 flex h-full w-full flex-col overflow-hidden rounded-b-none bg-neutral-50 dark:bg-neutral-950 transition-colors">
          <div
            id="docs-scroll-container"
            className="relative h-full w-full overflow-y-auto overflow-x-hidden flex justify-center py-6 px-4 sm:px-6 scrollbar-thin"
          >
            <div className="w-full max-w-[880px] xl:max-w-[940px] flex flex-col gap-8 pb-56">
              <article id="main-blog-content" className="flex flex-col gap-8 w-full">
                <header className="border-b border-border/40 pb-4 flex flex-col gap-1.5">
                  <h1 className="font-medium text-xl sm:text-2xl tracking-tight text-foreground">
                    {page.data.title}
                  </h1>
                  {page.data.description && (
                    <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                      {page.data.description}
                    </p>
                  )}
                </header>

                <div className="flex flex-col gap-4 text-foreground">
                  <MDX components={guideDocComponents} />
                </div>

                <DocContact />

                <DocsPager currentSlug={page.slugs} />

                {/* Generous bottom clearance spacer so floating pill never covers footer content */}
                <div className="h-0 w-full shrink-0 pointer-events-none" aria-hidden="true" />
              </article>
            </div>
          </div>
        </div>

        <FloatingDocIndex alwaysDocs />
      </div>
    </div>
  );
}

function DocsPager({ currentSlug }: { currentSlug: string[] }) {
  const pages = source.getPages();
  const index = pages.findIndex(
    (page) => JSON.stringify(page.slugs) === JSON.stringify(currentSlug)
  );

  const prev = pages[index - 1];
  const next = pages[index + 1];

  if (!prev && !next) return null;

  return (
    <div className="border-border/40 mt-16 border-t pt-8">
      <div className="flex flex-row items-stretch justify-between gap-2 sm:gap-4">
        {prev ? (
          <Link
            href={prev.url}
            className="group bg-background/50 hover:bg-accent/5 relative flex w-1/2 items-center justify-start gap-3 overflow-hidden rounded-xl p-4 no-underline backdrop-blur-sm transition-all duration-300"
          >
            {/* Hover Gradient Shine */}
            <div className="via-sidebar-primary/5 group-hover:animate-shimmer absolute inset-0 -translate-x-full bg-linear-to-r from-transparent to-transparent" />

            <svg
              className="text-muted-foreground group-hover:text-sidebar-primary h-5 w-5 min-w-5 transform transition-colors duration-300 group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>

            <span className="text-foreground group-hover:text-sidebar-primary truncate text-sm font-semibold tracking-wide uppercase no-underline transition-colors">
              Previous
            </span>
          </Link>
        ) : (
          <div className="w-1/2" />
        )}

        {next ? (
          <Link
            href={next.url}
            className="group bg-background/50 hover:bg-accent/5 relative flex w-1/2 items-center justify-end gap-3 overflow-hidden rounded-xl p-4 no-underline backdrop-blur-sm transition-all duration-300"
          >
            {/* Hover Gradient Shine */}
            <div className="via-sidebar-primary/5 group-hover:animate-shimmer-reverse absolute inset-0 translate-x-full bg-linear-to-r from-transparent to-transparent" />

            <span className="text-foreground group-hover:text-sidebar-primary truncate text-sm font-semibold tracking-wide uppercase no-underline transition-colors">
              Next
            </span>

            <svg
              className="text-muted-foreground group-hover:text-sidebar-primary h-5 w-5 min-w-5 transform transition-colors duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <div className="w-1/2" />
        )}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: page.slugs,
  }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug ?? []);

  if (!page) {
    return {};
  }

  const canonicalUrl = `https://shitui.in${page.url}`;

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      title: page.data.title,
      description: page.data.description,
      url: canonicalUrl,
      siteName: 'ShitUI',
      images: [
        {
          url: 'https://shitui.in/og-imageblack.png',
          width: 1200,
          height: 630,
          alt: `${page.data.title} - ShitUI Component`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.data.title,
      description: page.data.description,
      images: ['https://shitui.in/og-imageblack.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
