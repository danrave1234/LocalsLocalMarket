export default function Logo({ size = 28 }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: 8,
      background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#0b1020',
      fontWeight: 900,
      fontSize: size * 0.55,
      boxShadow: '0 4px 14px rgba(122,162,255,0.35)'
    }} aria-label="LocalsLocalMarket temporary logo">
      L
    </div>
  )
}


