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
    }
  ]

  // Add shop entries
  shops.forEach(shop => {
    entries.push({
      loc: `https://localslocalmarket.com/shops/${shop.id}`,
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
