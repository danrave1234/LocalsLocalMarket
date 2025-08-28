import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import Logo from './Logo.jsx'

export default function Header() {
  const { token, user, logout, isLoading } = useAuth()

  const handleLogout = () => {
    logout()
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <header style={{ position: 'sticky', top: 0, zIndex: 20, backdropFilter: 'blur(20px)', backgroundColor: 'rgba(10, 11, 15, 0.8)' }}>
        <div className="container header-row">
          <div className="header-left">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 800, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Logo />
              LocalsLocalMarket
            </Link>
            <span className="pill" style={{ whiteSpace: 'nowrap' }}>
              📍 Loading...
            </span>
          </div>
          <div className="header-center">
            <div className="header-search">
              <input
                className="input"
                placeholder="Search products or shops"
                disabled
              />
              <button className="btn" disabled>Search</button>
            </div>
          </div>
          <nav className="header-right" style={{ gap: '0.75rem' }}>
            <span className="muted">Loading...</span>
          </nav>
        </div>
      </header>
    )
  }

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 20, backdropFilter: 'blur(20px)', backgroundColor: 'rgba(10, 11, 15, 0.8)' }}>
      <div className="container header-row">
        <div className="header-left">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 800, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Logo />
            LocalsLocalMarket
          </Link>
        </div>
        
        <div className="header-center">
          <div className="header-search">
            <input
              className="input"
              placeholder="Search products or shops"
            />
            <button className="btn">Search</button>
          </div>
        </div>
        
        <nav className="header-right" style={{ gap: '0.75rem' }}>
          <Link to="/donate" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            textDecoration: 'none',
            color: '#667eea',
            fontWeight: '500'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
            Donate
          </Link>
          {token ? (
            <>
              <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                Dashboard
              </Link>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Profile
              </Link>
              <button onClick={handleLogout} className="btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="muted" style={{ textDecoration: 'none' }}>Login</Link>
              <Link to="/register" style={{
                textDecoration: 'none',
                border: '1px solid var(--border)',
                background: 'linear-gradient(180deg, var(--card), var(--card-2))',
                padding: '0.5rem 0.8rem',
                borderRadius: 8
              }}>Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}


