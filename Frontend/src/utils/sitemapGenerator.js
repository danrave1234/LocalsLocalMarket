// Import slug generation utility
import { generateShopSlug } from './slugUtils.js'

// Utility to generate dynamic sitemap entries
export const generateSitemapEntries = (shops = []) => {
  const entries = [
    {
      loc: 'https://localslocalmarket.com/',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      loc: 'https://localslocalmarket.com/login',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      loc: 'https://localslocalmarket.com/register',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      loc: 'https://localslocalmarket.com/donate',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: 'https://localslocalmarket.com/about',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      loc: 'https://localslocalmarket.com/contact',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      loc: 'https://localslocalmarket.com/support',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.5'
    },
    {
      loc: 'https://localslocalmarket.com/help',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.5'
    },
    {
      loc: 'https://localslocalmarket.com/privacy',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'yearly',
      priority: '0.3'
    },
    {
      loc: 'https://localslocalmarket.com/terms',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'yearly',
      priority: '0.3'
    }
  ]

  // Add shop entries with proper slug format
  shops.forEach(shop => {
    const shopSlug = generateShopSlug(shop.name, shop.id)
    entries.push({
      loc: `https://localslocalmarket.com/shops/${shopSlug}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.9'
    })
  })

  return entries
}

export const generateSitemapXML = (entries) => {
  const xmlEntries = entries.map(entry => `
  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`
}
