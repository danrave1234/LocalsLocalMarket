import React from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { Home, MessageCircle, Menu, X } from 'lucide-react'
import { useAuth } from '../auth/AuthContext.jsx'
import Logo from './Logo.jsx'
import SearchOptimization from './SearchOptimization.jsx'
import FeedbackButton from './FeedbackButton.jsx'
import ProfileDropdown from './ProfileDropdown.jsx'

export default function Header({ onOpenFeedback }) {
  const { token, user, logout, isLoading } = useAuth()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [showSearch, setShowSearch] = React.useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isSmallScreen, setIsSmallScreen] = React.useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia && window.matchMedia('(max-width: 768px)').matches
  })
  const [isXSmallScreen, setIsXSmallScreen] = React.useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia && window.matchMedia('(max-width: 480px)').matches
  })
  const [isMediumScreen, setIsMediumScreen] = React.useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia && window.matchMedia('(max-width: 992px)').matches
  })
  const isActive = (path) => location.pathname === path
  
  // Get current search state for synchronization
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  
  // Check for pinned location in localStorage
  const [hasPinnedLocation, setHasPinnedLocation] = React.useState(false)
  
  React.useEffect(() => {
    const checkPinnedLocation = () => {
      const pinnedLocation = localStorage.getItem('pinned_location')
      const hasPinned = !!pinnedLocation && pinnedLocation !== 'null'
      setHasPinnedLocation(hasPinned)
    }
    
    // Check initially
    checkPinnedLocation()
    
    // Listen for storage changes (when landing page updates pinned location)
    window.addEventListener('storage', checkPinnedLocation)
    
    // Also check more frequently in case of same-tab updates
    const interval = setInterval(checkPinnedLocation, 500)
    
    return () => {
      window.removeEventListener('storage', checkPinnedLocation)
      clearInterval(interval)
    }
  }, [])
  
  // Check if there are any active filters
  const hasActiveFilters = query || category || hasPinnedLocation

  React.useEffect(() => {
    // Track viewport size to control mobile header search visibility and logo sizing
    if (!window.matchMedia) return
    const mq = window.matchMedia('(max-width: 768px)')
    const mqXs = window.matchMedia('(max-width: 480px)')
    const mqMd = window.matchMedia('(max-width: 992px)')
    const onChange = (e) => setIsSmallScreen(e.matches)
    const onChangeXs = (e) => setIsXSmallScreen(e.matches)
    const onChangeMd = (e) => setIsMediumScreen(e.matches)
    
    // Modern browsers
    if (mq.addEventListener) {
      mq.addEventListener('change', onChange)
      mqXs.addEventListener('change', onChangeXs)
      mqMd.addEventListener('change', onChangeMd)
    } else if (mq.addListener) {
      mq.addListener(onChange)
      mqXs.addListener(onChangeXs)
      mqMd.addListener(onChangeMd)
    }
    setIsSmallScreen(mq.matches)
    setIsXSmallScreen(mqXs.matches)
    setIsMediumScreen(mqMd.matches)
    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener('change', onChange)
        mqXs.removeEventListener('change', onChangeXs)
        mqMd.removeEventListener('change', onChangeMd)
      } else if (mq.removeListener) {
        mq.removeListener(onChange)
        mqXs.removeListener(onChangeXs)
        mqMd.removeListener(onChangeMd)
      }
    }
  }, [])

  React.useEffect(() => {
    if (location.pathname !== '/') {
      setShowSearch(true)
      return
    }

    // Hide initially at top
    setShowSearch(false)

    const sentinel = document.getElementById('landing-hero-sentinel')
    if (!sentinel) {
      // Fallback to viewport-based threshold if sentinel missing
      const onScroll = () => setShowSearch(window.scrollY > window.innerHeight * 0.1)
      window.addEventListener('scroll', onScroll)
      return () => window.removeEventListener('scroll', onScroll)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowSearch(!entry.isIntersecting)
      },
      { root: null, threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [location.pathname])


  const clearFilters = () => {
    // This function is called by SearchOptimization component
    // The actual clearing is handled by SearchOptimization's clearFilters function
  }

  // Responsive logo size using clamp to fluidly scale with viewport
  const logoSize = 'clamp(24px, 6vw, 64px)'

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <header className="modern-header">
        <div className="container header-row">
          <div className="header-left">
            <Link to="/" className="brand-link">
              <Logo size={logoSize} />
            </Link>
            <span className="loading-pill">
              <div className="loading-spinner"></div>
              Loading...
            </span>
          </div>
          {showSearch && (
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
          )}
          <nav className="header-right">
            <span className="muted">Loading...</span>
          </nav>
        </div>
      </header>
    )
  }

  return (
    <header className="modern-header">
      <div className="container header-row">
        <div className="header-left">
          <Link to="/" className="brand-link">
                <Logo size={logoSize} />
          </Link>
        </div>
        
        {(((location.pathname === '/') ? showSearch : (isSmallScreen || showSearch))) && (
          <div className="header-center">
            <SearchOptimization 
              onClearFilters={clearFilters}
              compactFilter={true}
              hasPinnedLocation={hasPinnedLocation}
              navigateOnSubmit={false}
            />
          </div>
        )}
        
        <nav className="header-right">
          <div className="desktop-nav">
            <FeedbackButton 
              variant="ghost" 
              size="md" 
              className="nav-link feedback-link"
              showIcon={true}
              onClick={onOpenFeedback}
            >
              <MessageCircle className="nav-icon" aria-hidden size={18} />
              <span>Feedback</span>
            </FeedbackButton>
            <Link to="/donate" className={`nav-link donate-link${isActive('/donate') ? ' active' : ''}`}>
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 20.02L12 17.77L5.82 20.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 20.02L12 17.77L5.82 20.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Donate</span>
            </Link>
            <Link to="/" className={`nav-link${isActive('/') ? ' active' : ''}`} aria-label="Go to home">
              <Home className="nav-icon" aria-hidden size={18} />
              <span>Home</span>
            </Link>
            {token ? (
              <ProfileDropdown />
            ) : (
              <>
                <Link to="/login" className={`nav-link login-link${isActive('/login') ? ' active' : ''}`}>
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Login</span>
                </Link>
                <Link to="/register" className={`register-btn${isActive('/register') ? ' active' : ''}`}>
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M20 8V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>

          <button
            className="mobile-menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((v) => !v)}
          >
            {isMobileMenuOpen ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          </button>
        </nav>
      </div>

      {/* Mobile dropdown */}
      <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
        <div className="mobile-nav-content">
          <div className="container" style={{padding: '0.5rem 1rem'}}>
            <Link to="/" className="brand-link" onClick={() => setIsMobileMenuOpen(false)}>
              <Logo size={logoSize} />
            </Link>
          </div>
          <button 
            className="mobile-nav-item"
            onClick={onOpenFeedback}
          >
            <span>Feedback</span>
          </button>
          <Link to="/" className={`mobile-nav-item${isActive('/') ? ' active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <span>Home</span>
          </Link>
          <Link to="/donate" className={`mobile-nav-item${isActive('/donate') ? ' active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <span>Donate</span>
          </Link>
          {token ? (
            <ProfileDropdown 
              isMobile={true} 
              onMobileItemClick={() => setIsMobileMenuOpen(false)} 
            />
          ) : (
            <>
              <Link to="/login" className={`mobile-nav-item${isActive('/login') ? ' active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <span>Login</span>
              </Link>
              <Link to="/register" className={`mobile-nav-item${isActive('/register') ? ' active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}


