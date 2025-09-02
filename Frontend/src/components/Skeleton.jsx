import React from 'react'

// Base skeleton component with animation
const SkeletonBase = ({ className = '', style = {}, children, ...props }) => (
  <div
    className={`skeleton ${className}`}
    style={{
      background: 'linear-gradient(90deg, var(--border) 25%, var(--card-2) 50%, var(--border) 75%)',
      backgroundSize: '200% 100%',
      animation: 'skeleton-loading 1.5s infinite',
      borderRadius: '4px',
      ...style
    }}
    {...props}
  >
    {children}
  </div>
)

// Text skeleton with variable width
export const SkeletonText = ({ lines = 1, width = '100%', height = '1rem', className = '', style = {} }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width, ...style }}>
    {Array.from({ length: lines }).map((_, index) => (
      <SkeletonBase
        key={index}
        className={className}
        style={{
          height,
          width: index === lines - 1 && lines > 1 ? '60%' : '100%'
        }}
      />
    ))}
  </div>
)

// Card skeleton
export const SkeletonCard = ({ className = '', style = {} }) => (
  <div
    className={`card ${className}`}
    style={{
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      ...style
    }}
  >
    <SkeletonBase style={{ height: '120px', borderRadius: '8px' }} />
    <SkeletonText lines={2} />
    <SkeletonBase style={{ height: '2rem', borderRadius: '6px' }} />
  </div>
)

// Shop card skeleton
export const SkeletonShopCard = ({ className = '', style = {} }) => (
  <div
    className={`card ${className}`}
    style={{
      padding: 0,
      overflow: 'hidden',
      borderRadius: '16px',
      ...style
    }}
  >
    {/* Shop Image */}
    <SkeletonBase style={{ height: '120px' }} />
    
    {/* Shop Details */}
    <div style={{ padding: '0.75rem', position: 'relative' }}>
      {/* Shop Logo Overlay */}
      <SkeletonBase
        style={{
          position: 'absolute',
          top: '-30px',
          left: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: '3px solid var(--card)',
          zIndex: 10
        }}
      />
      
      {/* Shop Name */}
      <SkeletonBase
        style={{
          height: '1rem',
          marginBottom: '0.375rem',
          marginLeft: '80px'
        }}
      />
      
      {/* Location */}
      <SkeletonBase
        style={{
          height: '0.75rem',
          marginBottom: '0.375rem',
          width: '80%'
        }}
      />

      {/* Rating */}
      <SkeletonBase
        style={{
          height: '0.75rem',
          marginBottom: '0.375rem',
          width: '60%'
        }}
      />

      {/* Distance */}
      <SkeletonBase
        style={{
          height: '0.75rem',
          marginBottom: '0.5rem',
          width: '50%'
        }}
      />

      {/* Category Tags */}
      <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.5rem' }}>
        <SkeletonBase style={{ height: '1.2rem', width: '3rem', borderRadius: '12px' }} />
        <SkeletonBase style={{ height: '1.2rem', width: '3rem', borderRadius: '12px' }} />
        <SkeletonBase style={{ height: '1.2rem', width: '4rem', borderRadius: '12px' }} />
      </div>

      {/* Button */}
      <SkeletonBase
        style={{
          height: '2rem',
          borderRadius: '6px'
        }}
      />
    </div>
  </div>
)

// Product card skeleton
export const SkeletonProductCard = ({ className = '', style = {} }) => (
  <div
    className={`card ${className}`}
    style={{
      padding: 0,
      overflow: 'hidden',
      borderRadius: '12px',
      ...style
    }}
  >
    {/* Product Image */}
    <SkeletonBase style={{ height: '200px' }} />
    
    {/* Product Details */}
    <div style={{ padding: '1rem' }}>
      <SkeletonText lines={1} height="1.2rem" style={{ marginBottom: '0.5rem' }} />
      <SkeletonText lines={2} height="0.875rem" style={{ marginBottom: '0.5rem' }} />
      <SkeletonBase style={{ height: '1.5rem', width: '40%', marginBottom: '0.5rem' }} />
      <SkeletonBase style={{ height: '2.5rem', borderRadius: '6px' }} />
    </div>
  </div>
)

// Table skeleton
export const SkeletonTable = ({ rows = 5, columns = 4, className = '', style = {} }) => (
  <div className={className} style={style}>
    {/* Header */}
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '1rem', marginBottom: '1rem' }}>
      {Array.from({ length: columns }).map((_, index) => (
        <SkeletonBase key={index} style={{ height: '1.5rem' }} />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div
        key={rowIndex}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: '1rem',
          marginBottom: '0.75rem'
        }}
      >
        {Array.from({ length: columns }).map((_, colIndex) => (
          <SkeletonBase key={colIndex} style={{ height: '1rem' }} />
        ))}
      </div>
    ))}
  </div>
)

// Form skeleton
export const SkeletonForm = ({ fields = 4, className = '', style = {} }) => (
  <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', ...style }}>
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index}>
        <SkeletonBase style={{ height: '1rem', width: '30%', marginBottom: '0.5rem' }} />
        <SkeletonBase style={{ height: '2.5rem', borderRadius: '6px' }} />
      </div>
    ))}
    <SkeletonBase style={{ height: '2.5rem', borderRadius: '6px', marginTop: '1rem' }} />
  </div>
)

// Map skeleton
export const SkeletonMap = ({ className = '', style = {} }) => (
  <SkeletonBase
    className={className}
    style={{
      height: '400px',
      borderRadius: '12px',
      border: '1px solid var(--border)',
      ...style
    }}
  />
)

// Avatar skeleton
export const SkeletonAvatar = ({ size = '40px', className = '', style = {} }) => (
  <SkeletonBase
    className={className}
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      ...style
    }}
  />
)

// Button skeleton
export const SkeletonButton = ({ width = '100px', height = '2.5rem', className = '', style = {} }) => (
  <SkeletonBase
    className={className}
    style={{
      width,
      height,
      borderRadius: '6px',
      ...style
    }}
  />
)

// List skeleton
export const SkeletonList = ({ items = 5, className = '', style = {} }) => (
  <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', ...style }}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <SkeletonAvatar size="40px" />
        <div style={{ flex: 1 }}>
          <SkeletonText lines={1} height="1rem" style={{ marginBottom: '0.25rem' }} />
          <SkeletonText lines={1} height="0.75rem" style={{ width: '60%' }} />
        </div>
      </div>
    ))}
  </div>
)

// Grid skeleton
export const SkeletonGrid = ({ items = 6, columns = 3, className = '', style = {} }) => (
  <div
    className={className}
    style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: '1rem',
      ...style
    }}
  >
    {Array.from({ length: items }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
)

// Page skeleton
export const SkeletonPage = ({ className = '', style = {} }) => (
  <div className={className} style={{ padding: '2rem', ...style }}>
    {/* Header */}
    <SkeletonText lines={1} height="2rem" style={{ marginBottom: '0.5rem' }} />
    <SkeletonText lines={1} height="1rem" style={{ width: '60%', marginBottom: '2rem' }} />
    
    {/* Content */}
    <SkeletonGrid items={6} columns={3} />
  </div>
)

// Add CSS animation
const style = document.createElement('style')
style.textContent = `
  @keyframes skeleton-loading {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  
  .skeleton {
    position: relative;
    overflow: hidden;
  }
  
  .skeleton::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    animation: skeleton-shimmer 1.5s infinite;
  }
  
  @keyframes skeleton-shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`
document.head.appendChild(style)

export default SkeletonBase
