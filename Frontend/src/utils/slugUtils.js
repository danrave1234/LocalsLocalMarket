/**
 * Utility functions for handling shop slugs
 */

/**
 * Generate a slug from shop name and ID
 * @param {string} shopName - The shop name
 * @param {number|string} shopId - The shop ID
 * @returns {string} The generated slug (e.g., "burger-king-123")
 */
export const generateShopSlug = (shopName, shopId) => {
  if (!shopName || !shopId) return ''
  
  const nameSlug = shopName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
  
  return `${nameSlug}-${shopId}`
}

/**
 * Extract shop ID from a slug
 * @param {string} slug - The slug to parse
 * @returns {string|null} The shop ID or null if not found
 */
export const extractShopIdFromSlug = (slug) => {
  if (!slug) return null
  
  // Try to parse as direct ID first (for backward compatibility)
  if (!isNaN(slug)) {
    return slug
  }
  
  // Handle slug format: "shop-name-123"
  const parts = slug.split('-')
  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1]
    if (!isNaN(lastPart)) {
      return lastPart
    }
  }
  
  // Fallback to treating as shop name (old behavior)
  return slug
}

/**
 * Extract shop name from a slug
 * @param {string} slug - The slug to parse
 * @returns {string|null} The shop name or null if not found
 */
export const extractShopNameFromSlug = (slug) => {
  if (!slug) return null
  
  // Try to parse as direct ID first (for backward compatibility)
  if (!isNaN(slug)) {
    return null // Can't extract name from numeric ID
  }
  
  // Handle slug format: "shop-name-123"
  const parts = slug.split('-')
  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1]
    if (!isNaN(lastPart)) {
      // Remove the ID part and reconstruct the name
      const nameParts = parts.slice(0, -1)
      return nameParts.join(' ').replace(/\b\w/g, l => l.toUpperCase())
    }
  }
  
  // Fallback to treating as shop name (old behavior)
  return slug.replace(/\b\w/g, l => l.toUpperCase())
}

/**
 * Generate a URL-friendly shop link
 * @param {string} shopName - The shop name
 * @param {number|string} shopId - The shop ID
 * @returns {string} The shop URL
 */
export const generateShopUrl = (shopName, shopId) => {
  const slug = generateShopSlug(shopName, shopId)
  return `/shops/${encodeURIComponent(slug)}`
}

// Test examples (for development/debugging)
export const testSlugExamples = () => {
  const examples = [
    { name: "Burger King", id: 123 },
    { name: "McDonald's", id: 456 },
    { name: "Pizza Hut & Co.", id: 789 },
    { name: "KFC - Kentucky Fried Chicken", id: 101 },
    { name: "Subway", id: 202 }
  ]
  
  console.log('Slug Examples:')
  examples.forEach(example => {
    const slug = generateShopSlug(example.name, example.id)
    const url = generateShopUrl(example.name, example.id)
    const extractedId = extractShopIdFromSlug(slug)
    
    console.log(`"${example.name}" (ID: ${example.id})`)
    console.log(`  Slug: ${slug}`)
    console.log(`  URL: ${url}`)
    console.log(`  Extracted ID: ${extractedId}`)
    console.log('---')
  })
}
