import { useEffect, useRef } from 'react'
import { ADSENSE_CLIENT_ID, AD_SLOTS, isProductionEnvironment } from '../utils/adsConfig'

export default function GoogleAds({ 
  adSlot, 
  adFormat = 'auto', 
  style = {}, 
  className = '',
  responsive = true 
}) {
  const adRef = useRef(null)

  useEffect(() => {
    // Only load ads if we're in production and have the ad slot
    if (isProductionEnvironment() && adSlot && window.adsbygoogle) {
      try {
        // Push the ad to the dataLayer
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (error) {
        console.error('Error loading Google Ad:', error)
      }
    }
  }, [adSlot])

  // Don't render ads in development
  if (!isProductionEnvironment()) {
    return (
      <div 
        style={{
          ...style,
          background: '#f0f0f0',
          border: '2px dashed #ccc',
          padding: '20px',
          textAlign: 'center',
          color: '#666',
          minHeight: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        className={className}
      >
        <div>
          <strong>Ad Space</strong><br />
          <small>Ad Slot: {adSlot}</small><br />
          <small>Format: {adFormat}</small>
        </div>
      </div>
    )
  }

  return (
    <div style={{ textAlign: 'center', margin: '1rem 0', ...style }} className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive}
      />
    </div>
  )
}

// Predefined ad components for common placements
export function HeaderAd() {
  return (
    <GoogleAds 
      adSlot={AD_SLOTS.HEADER}
      adFormat="auto"
      style={{ margin: '0.5rem 0' }}
    />
  )
}

export function SidebarAd() {
  return (
    <GoogleAds 
      adSlot={AD_SLOTS.SIDEBAR}
      adFormat="auto"
      style={{ margin: '1rem 0' }}
    />
  )
}

export function FooterAd() {
  return (
    <GoogleAds 
      adSlot={AD_SLOTS.FOOTER}
      adFormat="auto"
      style={{ margin: '1rem 0' }}
    />
  )
}

export function InContentAd() {
  return (
    <GoogleAds 
      adSlot={AD_SLOTS.IN_CONTENT}
      adFormat="auto"
      style={{ margin: '2rem 0' }}
    />
  )
}

// Banner ad component
export function BannerAd() {
  return (
    <GoogleAds 
      adSlot={AD_SLOTS.BANNER}
      adFormat="banner"
      responsive={false}
      style={{ margin: '1rem 0' }}
    />
  )
}

// Responsive ad component
export function ResponsiveAd() {
  return (
    <GoogleAds 
      adSlot={AD_SLOTS.RESPONSIVE}
      adFormat="auto"
      responsive={true}
      style={{ margin: '1rem 0' }}
    />
  )
}
