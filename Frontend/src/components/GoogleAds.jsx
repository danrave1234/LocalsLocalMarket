import { useEffect, useRef } from 'react'

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
    if (process.env.NODE_ENV === 'production' && adSlot && window.adsbygoogle) {
      try {
        // Push the ad to the dataLayer
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (error) {
        console.error('Error loading Google Ad:', error)
      }
    }
  }, [adSlot])

  // Don't render ads in development
  if (process.env.NODE_ENV === 'development') {
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
        data-ad-client="ca-pub-9245122431395001"
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
      adSlot="YOUR_HEADER_AD_SLOT"
      adFormat="auto"
      style={{ margin: '0.5rem 0' }}
    />
  )
}

export function SidebarAd() {
  return (
    <GoogleAds 
      adSlot="YOUR_SIDEBAR_AD_SLOT"
      adFormat="auto"
      style={{ margin: '1rem 0' }}
    />
  )
}

export function FooterAd() {
  return (
    <GoogleAds 
      adSlot="YOUR_FOOTER_AD_SLOT"
      adFormat="auto"
      style={{ margin: '1rem 0' }}
    />
  )
}

export function InContentAd() {
  return (
    <GoogleAds 
      adSlot="YOUR_IN_CONTENT_AD_SLOT"
      adFormat="auto"
      style={{ margin: '2rem 0' }}
    />
  )
}

// Banner ad component
export function BannerAd() {
  return (
    <GoogleAds 
      adSlot="YOUR_BANNER_AD_SLOT"
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
      adSlot="YOUR_RESPONSIVE_AD_SLOT"
      adFormat="auto"
      responsive={true}
      style={{ margin: '1rem 0' }}
    />
  )
}
