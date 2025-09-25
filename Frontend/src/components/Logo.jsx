export default function Logo({ size = 28 }) {
  const resolvedSize = typeof size === 'number' ? `${size}px` : size
  return (
    <img 
      src="/LocalsLocalMarketLogoBig.svg" 
      alt="LocalsLocalMarket Logo"
      style={{
        width: resolvedSize,
        height: 'auto',
        maxHeight: resolvedSize,
        objectFit: 'contain'
      }}
    />
  )
}


