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
    'donate': 'Donate'
  }

  const breadcrumbs = pathnames.map((name, index) => {
    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
    const isLast = index === pathnames.length - 1
    const displayName = breadcrumbMap[name] || name

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
