export default function Logo({ size = 28 }) {
  return (
    <img 
      src="/LocalsLocalMarketLogoBig.svg" 
      alt="LocalsLocalMarket Logo"
      style={{
        width: size,
        height: size,
        objectFit: 'contain'
      }}
    />
  )
}


