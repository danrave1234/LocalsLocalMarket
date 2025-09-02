import React from 'react'

const LoadingSpinner = ({ size = 'medium', color = 'var(--primary)', className = '', style = {} }) => {
  const sizeMap = {
    small: '16px',
    medium: '24px',
    large: '32px',
    xlarge: '48px'
  }

  const spinnerSize = sizeMap[size] || sizeMap.medium

  return (
    <div 
      className={className}
      style={{
        display: 'inline-block',
        width: spinnerSize,
        height: spinnerSize,
        border: `2px solid transparent`,
        borderTop: `2px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        ...style
      }}
    />
  )
}

const LoadingDots = ({ color = 'var(--primary)', className = '', style = {} }) => {
  return (
    <div 
      className={className}
      style={{
        display: 'flex',
        gap: '4px',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: color,
            animation: `bounce 1.4s ease-in-out infinite both`,
            animationDelay: `${i * 0.16}s`
          }}
        />
      ))}
    </div>
  )
}

const LoadingBar = ({ color = 'var(--primary)', className = '', style = {} }) => {
  return (
    <div 
      className={className}
      style={{
        width: '100%',
        height: '4px',
        backgroundColor: 'var(--border)',
        borderRadius: '2px',
        overflow: 'hidden',
        ...style
      }}
    >
      <div
        style={{
          width: '30%',
          height: '100%',
          backgroundColor: color,
          borderRadius: '2px',
          animation: 'loading-bar 1.5s ease-in-out infinite'
        }}
      />
    </div>
  )
}

const LoadingCard = ({ 
  lines = 3, 
  height = '1rem', 
  width = '100%', 
  className = '', 
  style = {} 
}) => {
  return (
    <div 
      className={className}
      style={{
        padding: '1rem',
        backgroundColor: 'var(--card)',
        borderRadius: '8px',
        border: '1px solid var(--border)',
        ...style
      }}
    >
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          style={{
            height,
            width: index === lines - 1 ? '60%' : width,
            backgroundColor: 'var(--border)',
            borderRadius: '4px',
            marginBottom: index < lines - 1 ? '0.5rem' : '0',
            animation: 'pulse 2s infinite'
          }}
        />
      ))}
    </div>
  )
}

const LoadingOverlay = ({ 
  message = 'Loading...', 
  showSpinner = true,
  overlay = true,
  className = '',
  style = {}
}) => {
  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '2rem',
        ...style
      }}
    >
      {showSpinner && <LoadingSpinner size="large" />}
      {message && (
        <p style={{ 
          margin: 0, 
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          textAlign: 'center'
        }}>
          {message}
        </p>
      )}
    </div>
  )

  if (overlay) {
    return (
      <div
        className={className}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(2px)'
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--card)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            minWidth: '200px'
          }}
        >
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {content}
    </div>
  )
}

const LoadingButton = ({ 
  children, 
  loading = false, 
  loadingText = 'Loading...',
  disabled = false,
  className = '',
  style = {},
  ...props 
}) => {
  return (
    <button
      className={className}
      disabled={disabled || loading}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        opacity: loading ? 0.7 : 1,
        cursor: loading || disabled ? 'not-allowed' : 'pointer',
        ...style
      }}
      {...props}
    >
      {loading && <LoadingSpinner size="small" />}
      {loading ? loadingText : children}
    </button>
  )
}

// Add CSS animations to the document
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes bounce {
      0%, 80%, 100% { 
        transform: scale(0);
      } 
      40% { 
        transform: scale(1.0);
      }
    }
    
    @keyframes loading-bar {
      0% { transform: translateX(-100%); }
      50% { transform: translateX(0%); }
      100% { transform: translateX(100%); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `
  document.head.appendChild(style)
}

export {
  LoadingSpinner,
  LoadingDots,
  LoadingBar,
  LoadingCard,
  LoadingOverlay,
  LoadingButton
}

export default LoadingSpinner
