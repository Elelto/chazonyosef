/**
 * Netlify Function to generate dynamic sitemap.xml
 * This ensures Google can discover all pages on the site
 */

export async function handler(event, context) {
  const headers = event?.headers || {};
  const host = headers['x-forwarded-host'] || headers.host;
  const proto = headers['x-forwarded-proto'] || 'https';
  const baseUrl = host ? `${proto}://${host}` : 'https://chazonyosef.netlify.app';
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Define all pages with their priority and change frequency
  const pages = [
    { url: '', priority: '1.0', changefreq: 'daily' }, // Homepage
    { url: '/about', priority: '0.8', changefreq: 'weekly' },
    { url: '/schedule', priority: '0.9', changefreq: 'daily' },
    { url: '/donate', priority: '0.7', changefreq: 'monthly' },
    { url: '/gallery', priority: '0.6', changefreq: 'weekly' },
    { url: '/contact', priority: '0.7', changefreq: 'monthly' },
  ];

  const toLoc = (pageUrl) => {
    if (!pageUrl) return `${baseUrl}/`;
    return `${baseUrl}${pageUrl}`;
  };

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${pages.map(page => `  <url>
    <loc>${toLoc(page.url)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
    body: sitemap,
  };
}
