import React from 'react'

const ErrorDisplay = ({ 
  error, 
  title = "Something went wrong", 
  onRetry, 
  retryText = "Try Again",
  showIcon = true,
  className = "",
  style = {}
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      window.location.reload()
    }
  }

  return (
    <div 
      className={className}
      style={{
        backgroundColor: 'var(--error-bg)', 
        color: 'var(--error)', 
        padding: '1.5rem', 
        borderRadius: '12px',
        fontSize: '1rem',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto',
        ...style
      }}
    >
      {showIcon && (
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
      )}
      <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--error)' }}>
        {title}
      </h3>
      <p style={{ margin: '0 0 1.5rem 0', opacity: 0.9 }}>
        {error}
      </p>
      <button 
        onClick={handleRetry} 
        style={{
          background: 'var(--error)',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          fontSize: '0.9rem',
          cursor: 'pointer',
          fontWeight: 500,
          transition: 'opacity 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.opacity = '0.8'}
        onMouseLeave={(e) => e.target.style.opacity = '1'}
      >
        {retryText}
      </button>
    </div>
  )
}

export default ErrorDisplay
