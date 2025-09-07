import { Link, useLocation } from 'react-router-dom'

const Breadcrumbs = () => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  const breadcrumbMap = {
    'login': 'Login',
    'register': 'Register',
    'shops': 'Shops',
    'dashboard': 'Dashboard',
    'profile': 'Profile',
    'settings': 'Settings',
    'donate': 'Donate',
    'shop-management': 'Shop Management',
    'about': 'About Us',
    'contact': 'Contact',
    'support': 'Support',
    'help': 'Help',
    'privacy': 'Privacy Policy',
    'terms': 'Terms of Service',
    'cookies': 'Cookie Policy',
    'gdpr': 'GDPR'
  }

  const breadcrumbs = pathnames.map((name, index) => {
    let routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
    const isLast = index === pathnames.length - 1
    let displayName = breadcrumbMap[name] || name

    // Handle shop slug parameters (for /shops/shop-name-123)
    if (pathnames[index - 1] === 'shops' && name !== 'shops') {
      // Extract shop name from slug (remove the ID part)
      const slugParts = name.split('-')
      if (slugParts.length > 1) {
        const shopName = slugParts.slice(0, -1).join(' ').replace(/\b\w/g, l => l.toUpperCase())
        displayName = shopName
      }
    }

    // Handle product management routes
    if (pathnames[index - 1] === 'product-management' && name !== 'product-management') {
      displayName = 'Product Management'
    }

    // Handle shop management routes - convert slug to shop name
    if (pathnames[index - 1] === 'shop-management' && name !== 'shop-management') {
      const slugParts = name.split('-')
      if (slugParts.length > 1) {
        const shopName = slugParts.slice(0, -1).join(' ').replace(/\b\w/g, l => l.toUpperCase())
        displayName = shopName
      } else {
        displayName = name
      }
    }


    return {
      name: displayName,
      routeTo,
      isLast
    }
  })

  if (breadcrumbs.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" style={{ 
      marginBottom: '0.5rem',
      position: 'sticky',
      top: '70px',
      left: '0',
      right: '0',
      zIndex: 19,
      backgroundColor: 'rgba(10, 11, 15, 0.8)',
      padding: '0.5rem 1rem',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)'
    }}>
             <ol style={{
         display: 'flex',
         alignItems: 'center',
         listStyle: 'none',
         margin: 0,
         padding: 0,
         fontSize: '0.875rem',
         color: 'var(--muted)',
         maxWidth: '100%',
         overflow: 'hidden'
       }}>
        <li>
          <Link 
            to="/" 
            style={{
              color: 'var(--muted)',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}
          >
            Home
          </Link>
        </li>
        
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.routeTo} style={{ 
            display: 'flex', 
            alignItems: 'center',
            flexShrink: 0
          }}>
            <span style={{ 
              margin: '0 0.5rem', 
              color: 'var(--border)',
              flexShrink: 0
            }}>/</span>
            {breadcrumb.isLast ? (
              <span style={{ 
                color: 'var(--text)', 
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {breadcrumb.name}
              </span>
            ) : (
              <Link 
                to={breadcrumb.routeTo}
                style={{
                  color: 'var(--muted)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '150px'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}
              >
                {breadcrumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
