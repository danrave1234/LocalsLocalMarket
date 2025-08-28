import { useEffect } from 'react'

const SocialSharing = ({ url, title, description, image }) => {
  useEffect(() => {
    // Update Open Graph meta tags for social sharing
    const updateMetaTags = () => {
      const metaTags = {
        'og:url': url || window.location.href,
        'og:title': title || document.title,
        'og:description': description || 'Discover and connect with local businesses in your community.',
        'og:image': image || 'https://localslocalmarket.com/og-image.jpg',
        'twitter:url': url || window.location.href,
        'twitter:title': title || document.title,
        'twitter:description': description || 'Discover and connect with local businesses in your community.',
        'twitter:image': image || 'https://localslocalmarket.com/og-image.jpg'
      }

      Object.entries(metaTags).forEach(([property, content]) => {
        let meta = document.querySelector(`meta[property="${property}"]`) || 
                   document.querySelector(`meta[name="${property}"]`)
        
        if (!meta) {
          meta = document.createElement('meta')
          if (property.startsWith('og:')) {
            meta.setAttribute('property', property)
          } else {
            meta.setAttribute('name', property)
          }
          document.head.appendChild(meta)
        }
        
        meta.setAttribute('content', content)
      })
    }

    updateMetaTags()
  }, [url, title, description, image])

  const shareOnSocial = (platform) => {
    const shareUrl = encodeURIComponent(url || window.location.href)
    const shareTitle = encodeURIComponent(title || document.title)
    const shareDescription = encodeURIComponent(description || 'Discover and connect with local businesses in your community.')

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      whatsapp: `https://wa.me/?text=${shareTitle}%20${shareUrl}`,
      email: `mailto:?subject=${shareTitle}&body=${shareDescription}%20${shareUrl}`
    }

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400')
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      gap: '0.5rem', 
      marginTop: '1rem',
      flexWrap: 'wrap'
    }}>
      <button
        onClick={() => shareOnSocial('facebook')}
        style={{
          background: '#1877f2',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
        title="Share on Facebook"
      >
        📘 Facebook
      </button>
      
      <button
        onClick={() => shareOnSocial('twitter')}
        style={{
          background: '#1da1f2',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
        title="Share on Twitter"
      >
        🐦 Twitter
      </button>
      
      <button
        onClick={() => shareOnSocial('whatsapp')}
        style={{
          background: '#25d366',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
        title="Share on WhatsApp"
      >
        💬 WhatsApp
      </button>
      
      <button
        onClick={() => shareOnSocial('email')}
        style={{
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
        title="Share via Email"
      >
        ✉️ Email
      </button>
    </div>
  )
}

export default SocialSharing
