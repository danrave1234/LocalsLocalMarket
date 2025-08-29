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

  const copyLink = async () => {
    const linkToCopy = url || window.location.href
    try {
      await navigator.clipboard.writeText(linkToCopy)
      // You could add a toast notification here
      console.log('Link copied to clipboard:', linkToCopy)
    } catch (err) {
      console.error('Failed to copy link:', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = linkToCopy
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '0.5rem', 
      marginTop: '0.5rem'
    }}>
      <button
        onClick={() => shareOnSocial('facebook')}
        style={{
          background: '#1877f2',
          color: 'white',
          border: 'none',
          padding: '0.75rem 0.5rem',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          fontWeight: '500',
          minHeight: '40px',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        title="Share on Facebook"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        Facebook
      </button>
      
      <button
        onClick={() => shareOnSocial('twitter')}
        style={{
          background: '#000000',
          color: 'white',
          border: 'none',
          padding: '0.75rem 0.5rem',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          fontWeight: '500',
          minHeight: '40px',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        title="Share on X"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        X
      </button>
      
      <button
        onClick={() => shareOnSocial('whatsapp')}
        style={{
          background: '#25d366',
          color: 'white',
          border: 'none',
          padding: '0.75rem 0.5rem',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          fontWeight: '500',
          minHeight: '40px',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        title="Share on WhatsApp"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
        WhatsApp
      </button>
      
      <button
        onClick={() => shareOnSocial('email')}
        style={{
          background: 'var(--surface)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          padding: '0.75rem 0.5rem',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          fontWeight: '500',
          minHeight: '40px',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        title="Share via Email"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 3v18h24V3H0zm21.518 2L12 12.713 2.482 5h19.036zM2 19V7.183l10 8.104 10-8.104V19H2z"/>
        </svg>
        Email
      </button>
      
      <button
        onClick={copyLink}
        style={{
          background: 'var(--accent)',
          color: 'white',
          border: 'none',
          padding: '0.75rem 0.5rem',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          fontWeight: '500',
          minHeight: '40px',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        title="Copy Link"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
        Copy Link
      </button>
    </div>
  )
}

export default SocialSharing
