import React from 'react'

// Warning icon component
function WarningIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.width || 24} height={props.height || 24} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  )
}

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
        backgroundColor: 'var(--card)', 
        color: 'var(--text)', 
        padding: '2rem', 
        borderRadius: '16px',
        fontSize: '1rem',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-md)',
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    >
      {/* Background accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, var(--error) 0%, var(--warning) 50%, var(--error) 100%)'
      }} />
      
      {showIcon && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          padding: '1rem',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '50%',
          width: 'fit-content',
          margin: '0 auto 1.5rem auto'
        }}>
          <WarningIcon width={32} height={32} style={{ color: 'var(--error)' }} />
        </div>
      )}
      
      <h3 style={{ 
        margin: '0 0 1rem 0', 
        color: 'var(--error)', 
        fontSize: '1.5rem',
        fontWeight: '600',
        letterSpacing: '-0.025em'
      }}>
        {title}
      </h3>
      
      <p style={{ 
        color: 'var(--muted)',
        fontSize: '1rem',
        lineHeight: '1.6',
        maxWidth: '500px',
        margin: '0 auto 2rem auto'
      }}>
        {error}
      </p>
      
      <button 
        onClick={handleRetry} 
        style={{
          background: 'var(--error)',
          color: 'white',
          border: 'none',
          padding: '0.875rem 2rem',
          borderRadius: '12px',
          fontSize: '1rem',
          cursor: 'pointer',
          fontWeight: '600',
          transition: 'all 0.2s ease',
          boxShadow: 'var(--shadow-sm)',
          minWidth: '140px'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'var(--accent-hover)'
          e.target.style.transform = 'translateY(-1px)'
          e.target.style.boxShadow = 'var(--shadow-md)'
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'var(--error)'
          e.target.style.transform = 'translateY(0)'
          e.target.style.boxShadow = 'var(--shadow-sm)'
        }}
      >
        {retryText}
      </button>
    </div>
  )
}

export default ErrorDisplay
