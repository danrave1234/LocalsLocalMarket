// Centralized Google Ads/AdSense configuration
// Uses environment variables when available, with safe fallbacks

export const ADSENSE_CLIENT_ID =
  import.meta?.env?.VITE_ADSENSE_CLIENT_ID || 'ca-pub-9245122431395001'

// Global ads toggle. Set via env var; defaults to false to disable all ad space.
export const ADS_ENABLED = String(import.meta?.env?.VITE_ENABLE_ADS || 'false').toLowerCase() === 'true'

// Map of friendly placement names to ad unit slot IDs
// Replace the placeholder strings with real AdSense unit IDs when available
export const AD_SLOTS = {
  HEADER: import.meta?.env?.VITE_ADS_SLOT_HEADER || 'YOUR_HEADER_AD_SLOT',
  SIDEBAR: import.meta?.env?.VITE_ADS_SLOT_SIDEBAR || 'YOUR_SIDEBAR_AD_SLOT',
  FOOTER: import.meta?.env?.VITE_ADS_SLOT_FOOTER || 'YOUR_FOOTER_AD_SLOT',
  IN_CONTENT: import.meta?.env?.VITE_ADS_SLOT_IN_CONTENT || 'YOUR_IN_CONTENT_AD_SLOT',
  BANNER: import.meta?.env?.VITE_ADS_SLOT_BANNER || 'YOUR_BANNER_AD_SLOT',
  RESPONSIVE: import.meta?.env?.VITE_ADS_SLOT_RESPONSIVE || 'YOUR_RESPONSIVE_AD_SLOT'
}

export function isProductionEnvironment() {
  return import.meta?.env?.MODE === 'production' || process.env.NODE_ENV === 'production'
}

export function areAdsEnabled() {
  return ADS_ENABLED && isProductionEnvironment()
}









