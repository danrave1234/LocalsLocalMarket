#!/usr/bin/env node

/**
 * Script to generate static sitemap.xml from shop data
 * This should be run during build process or manually when needed
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Import the sitemap generation utilities
import { generateSitemapEntries, generateSitemapXML } from '../src/utils/sitemapGenerator.js'

async function generateSitemap() {
  try {
    console.log('🔄 Generating sitemap...')
    
    // For static generation, we'll create a basic sitemap without shop data
    // The dynamic sitemap will be served from the backend at /api/sitemap.xml
    const staticEntries = [
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
    
    // Generate XML
    const sitemapXML = generateSitemapXML(staticEntries)
    
    // Write to public directory
    const publicDir = path.join(__dirname, '..', 'public')
    const sitemapPath = path.join(publicDir, 'sitemap.xml')
    
    fs.writeFileSync(sitemapPath, sitemapXML, 'utf8')
    
    console.log('✅ Static sitemap generated successfully!')
    console.log(`📁 Location: ${sitemapPath}`)
    console.log('📝 Note: This is a static sitemap. For dynamic shop pages, use the backend endpoint: /api/sitemap.xml')
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error)
    process.exit(1)
  }
}

// Run the script
generateSitemap()
