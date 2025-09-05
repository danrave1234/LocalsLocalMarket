import { Store } from 'lucide-react'

export default function Avatar({ src, alt, size = 36, fallback = <Store size={20} />, name }) {
  // If we have a src, try to use it as an image
  if (src) {
    return (
      <div style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        background: 'var(--surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        border: '1px solid var(--border)'
      }} aria-label={`Avatar for ${alt || name}`}>
        <img 
          src={src} 
          alt={alt || name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
          onError={(e) => {
            // If image fails to load, hide it and show fallback
            console.error('Image failed to load:', e.target.src)
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
          onLoad={(e) => {
            console.log('Image loaded successfully:', e.target.src)
            // Hide the fallback when image loads successfully
            e.target.nextSibling.style.display = 'none'
          }}
        />
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex', // Show fallback initially
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
          color: '#0b1020',
          fontWeight: 800,
          fontSize: size * 0.4
        }}>
          {fallback}
        </div>
      </div>
    )
  }

  // If no src, show fallback or initial
  const displayText = fallback || (name ? name.trim().charAt(0).toUpperCase() : <Store size={20} />)
  
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: size * 0.3,
      background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#0b1020',
      fontWeight: 800,
      fontSize: size * 0.4,
      boxShadow: '0 4px 14px rgba(122,162,255,0.35)'
    }} aria-label={`Avatar for ${alt || name}`}>
      {displayText}
    </div>
  )
}
