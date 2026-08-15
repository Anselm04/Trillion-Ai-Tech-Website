import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://www.trillionaitech.com', priority: 1 },
    { url: 'https://www.trillionaitech.com/catalog/apps', priority: 0.8 },
    { url: 'https://www.trillionaitech.com/catalog/games', priority: 0.8 },
    { url: 'https://www.trillionaitech.com/catalog/agents', priority: 0.8 },
    { url: 'https://www.trillionaitech.com/catalog/tools', priority: 0.8 },
    { url: 'https://www.trillionaitech.com/catalog/software', priority: 0.8 },
  ];
}
