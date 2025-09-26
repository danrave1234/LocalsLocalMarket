import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, LayoutDashboard, LogOut, ChevronDown, MessageCircle } from 'lucide-react'
import { useAuth } from '../auth/AuthContext.jsx'

export default function ProfileDropdown({ isMobile = false, onMobileItemClick, onOpenFeedback }) {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    if (onMobileItemClick) onMobileItemClick()
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleItemClick = () => {
    setIsOpen(false)
    if (onMobileItemClick) onMobileItemClick()
  }

  // Mobile version - render as separate items
  if (isMobile) {
    return (
      <>
        <Link 
          to={user?.role === 'ADMIN' ? "/admin" : "/dashboard"} 
          className="mobile-nav-item"
          onClick={handleItemClick}
        >
          <span>Dashboard</span>
        </Link>
        <Link 
          to="/profile" 
          className="mobile-nav-item"
          onClick={handleItemClick}
        >
          <span>Profile</span>
        </Link>
        <button 
          className="mobile-nav-item"
          onClick={handleLogout}
        >
          <span>Logout</span>
        </button>
      </>
    )
  }

  // Desktop version - render as dropdown
  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button 
        className="profile-dropdown-trigger"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="profile-avatar">
          <User size={18} />
        </div>
        <span className="profile-name">{user?.username || 'Account'}</span>
        <ChevronDown 
          size={16} 
          className={`dropdown-chevron ${isOpen ? 'open' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="profile-dropdown-menu">
          <Link 
            to={user?.role === 'ADMIN' ? "/admin" : "/dashboard"} 
            className="dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/profile" 
            className="dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            <User size={16} />
            <span>Profile</span>
          </Link>
          <button 
            className="dropdown-item"
            onClick={() => {
              setIsOpen(false)
              if (onOpenFeedback) onOpenFeedback()
            }}
          >
            <MessageCircle size={16} />
            <span>Feedback</span>
          </button>
          <button 
            className="dropdown-item logout-item"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  )
}
