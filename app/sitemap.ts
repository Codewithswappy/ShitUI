import { MetadataRoute } from 'next';
import { source } from '@/lib/source';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://shitui.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // Static pages - only include fully functional pages
  // Removed /templates and /pricing as they are "Coming Soon" placeholder pages
  // This prevents Google from indexing incomplete pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/docs/introduction`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/changelog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/testimonials`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/sponsors`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // Dynamic Docs Pages from Source (excluding introduction which is already in staticPages with 0.95 priority)
  const dynamicDocsRoutes: MetadataRoute.Sitemap = source
    .getPages()
    .filter((page) => page.url !== '/docs/introduction' && page.url !== '/docs')
    .map((page) => {
    // Determine priority based on path
    let priority = 0.8;
    if (page.url.includes('/components')) priority = 0.9;
    if (page.url.includes('/installation')) priority = 0.85;

    return {
      url: `${baseUrl}${page.url}`,
      lastModified: currentDate, // In a real app, you might want to track file modification times
      changeFrequency: 'weekly',
      priority,
    };
  });

  return [...staticPages, ...dynamicDocsRoutes];
}
