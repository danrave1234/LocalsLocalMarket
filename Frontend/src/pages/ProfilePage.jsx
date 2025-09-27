import { useEffect, useState, memo, useCallback, useMemo } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import Modal from '../components/Modal.jsx'
import { ResponsiveAd } from '../components/GoogleAds.jsx'
import { SkeletonText, SkeletonAvatar, SkeletonButton, SkeletonForm } from '../components/Skeleton.jsx'
import { useFormErrorHandler } from '../hooks/useErrorHandler.js'
import { useFocusManagement } from '../hooks/useFocusManagement.js'
import { validationPatterns } from '../utils/codeDuplication.jsx'
import '../profile.css'
import { getEmailVerificationStatus, sendEmailVerification, verifyEmailCode } from '../api/auth.js'

function ProfilePage() {
  const { user, updateProfile, changePassword, token } = useAuth()
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [profileData, setProfileData] = useState({
    name: user?.name || ''
  })
  const [verStatus, setVerStatus] = useState({ emailVerified: !!user?.emailVerified, emailVerifiedAt: user?.emailVerifiedAt || null })
  const [verCodeDigits, setVerCodeDigits] = useState(['', '', '', '', '', ''])
  const [verMsg, setVerMsg] = useState('')
  const [cooldown, setCooldown] = useState(0)
  
  // Enhanced error handling
  const { 
    fieldErrors, 
    submissionError, 
    handleValidationError,
    handleSubmissionError, 
    clearAllErrors 
  } = useFormErrorHandler()
  
  // Focus management for modals
  const { containerRef: changePasswordRef } = useFocusManagement({
    isOpen: showChangePassword,
    trapFocus: true,
    restoreFocus: true
  })
  
  const { containerRef: editProfileRef } = useFocusManagement({
    isOpen: showEditProfile,
    trapFocus: true,
    restoreFocus: true
  })

  useEffect(() => {
    if (!cooldown) return
    const t = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [cooldown])

  const codeString = verCodeDigits.join('')
  const inputRefs = Array.from({ length: 6 }, () => ({ current: null }))

  const handleDigitChange = (idx, val) => {
    const d = val.replace(/\D/g, '').slice(0, 1)
    setVerMsg('')
    setVerCodeDigits((prev) => {
      const next = [...prev]
      next[idx] = d
      return next
    })
    // focus next
    if (d && idx < 5 && inputRefs[idx + 1].current) {
      inputRefs[idx + 1].current.focus()
    }
  }

  const handleDigitKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !verCodeDigits[idx] && idx > 0) {
      if (inputRefs[idx - 1].current) inputRefs[idx - 1].current.focus()
    }
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && idx > 0) {
      e.preventDefault(); if (inputRefs[idx - 1].current) inputRefs[idx - 1].current.focus()
    }
    if ((e.key === 'ArrowRight' || e.key === 'ArrowDown') && idx < 5) {
      e.preventDefault(); if (inputRefs[idx + 1].current) inputRefs[idx + 1].current.focus()
    }
  }

  const handlePaste = (e) => {
    const text = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6)
    if (!text) return
    e.preventDefault()
    const arr = text.split('')
    setVerCodeDigits(['', '', '', '', '', ''].map((_, i) => arr[i] || ''))
  }

  useEffect(() => {
    if (codeString.length === 6) {
      (async () => {
        setVerMsg('')
        try {
          await verifyEmailCode(codeString, token)
          setVerMsg('Email verified successfully!')
          setVerStatus({ emailVerified: true, emailVerifiedAt: new Date().toISOString() })
        } catch (e) {
          setVerMsg(e.message || 'Invalid or expired code')
        }
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeString])

  useEffect(() => {
    const load = async () => {
      try {
        if (!token) return
        const s = await getEmailVerificationStatus(token)
        setVerStatus({ emailVerified: !!s.emailVerified, emailVerifiedAt: s.emailVerifiedAt || null })
      } catch {}
    }
    load()
  }, [token])

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
    setPasswordError('')
    setPasswordSuccess('')
  }

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    })
    setProfileError('')
    setProfileSuccess('')
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')
    if (isChangingPassword) return

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match.')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.')
      return
    }

    setIsChangingPassword(true)
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword)
      setPasswordSuccess('Password changed successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setShowChangePassword(false)
    } catch (error) {
      setPasswordError(error.message || 'Failed to change password.')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileError('')
    setProfileSuccess('')
    if (isUpdatingProfile) return

    if (!profileData.name.trim()) {
      setProfileError('Name is required.')
      return
    }

    setIsUpdatingProfile(true)
    try {
      await updateProfile(profileData)
      setProfileSuccess('Profile updated successfully!')
      setShowEditProfile(false)
    } catch (error) {
      setProfileError(error.message || 'Failed to update profile.')
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  if (!user) {
    return (
      <main className="container profile-page-container">
        {/* Profile Header Skeleton */}
        <div className="profile-header">
          <SkeletonAvatar size="120px" style={{ marginBottom: '1rem' }} />
          <SkeletonText lines={1} height="1.5rem" style={{ marginBottom: '0.5rem' }} />
          <SkeletonText lines={1} height="1rem" style={{ width: '40%', marginBottom: '2rem' }} />
        </div>

        {/* Profile Content Skeleton */}
        <div className="profile-content">
          <div className="profile-section">
            <SkeletonText lines={1} height="1.2rem" style={{ marginBottom: '1rem' }} />
            <SkeletonForm fields={3} />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="container profile-page-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              <svg className="avatar-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="5" fill="currentColor"/>
                <path d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{user.name}</h1>
              <p className="profile-email">{user.email}</p>
              <div className="profile-status">
              {verStatus.emailVerified ? (
                <span className="status-badge verified">
                  <svg className="status-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Email Verified
                </span>
              ) : (
                <button className="status-badge action" onClick={() => setShowVerifyModal(true)}>
                  <svg className="status-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="17" r="1" fill="currentColor"/>
                  </svg>
                  Verify Email
                </button>
              )}
              </div>
            </div>
          </div>
          <div className="profile-actions">
            <button 
              className="edit-profile-btn"
              onClick={() => setShowEditProfile(true)}
            >
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content Grid */}
      <div className="profile-content">
        {/* Personal Information Card */}
        <div className="profile-card">
          <div className="card-header">
            <h2 className="card-title">
              <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Personal Information
            </h2>
          </div>
          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Full Name</div>
                <div className="info-value">{user.name}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Email Address</div>
                <div className="info-value">{user.email}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Member Since</div>
                <div className="info-value">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">Account Type</div>
                <div className="info-value">
                  <span className="account-type-badge">Seller</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Security Card */}
        <div className="profile-card">
          <div className="card-header">
            <h2 className="card-title">
              <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Account Security
            </h2>
          </div>
          <div className="card-content">
            <div className="security-info">
              <div className="security-status">
                <div className="security-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="security-text">
                  <h3>Password Security</h3>
                  <p>Your account is protected with a strong password</p>
                </div>
              </div>
              <button 
                className="change-password-btn"
                onClick={() => setShowChangePassword(true)}
              >
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 7H18C18.5304 7 19.0391 7.21071 19.4142 7.58579C19.7893 7.96086 20 8.46957 20 9V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21H6C5.46957 21 4.96086 20.7893 4.58579 20.4142C4.21071 20.0391 4 19.5304 4 19V9C4 8.46957 4.21071 7.96086 4.58579 7.58579C4.96086 7.21071 5.46957 7 6 7H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 12V15M12 15L15 12M12 15L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Account Actions Card */}
        <div className="profile-card">
          <div className="card-header">
            <h2 className="card-title">
              <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 20H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16.5 3.5C16.8978 3.10217 17.4374 2.87868 18 2.87868C18.5626 2.87868 19.1022 3.10217 19.5 3.5C19.8978 3.89782 20.1213 4.43739 20.1213 5C20.1213 5.56261 19.8978 6.10217 19.5 6.5L12 14L6 8L12 2L16.5 3.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Account Actions
            </h2>
          </div>
          <div className="card-content">
            <div className="actions-list">
              <button 
                className="action-btn"
                onClick={() => setShowEditProfile(true)}
              >
                <svg className="action-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="action-content">
                  <span className="action-title">Edit Profile</span>
                  <span className="action-description">Update your personal information</span>
                </div>
                <svg className="action-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <button className="action-btn danger">
                <svg className="action-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <div className="action-content">
                  <span className="action-title">Delete Account</span>
                  <span className="action-description">Permanently remove your account and data</span>
                </div>
                <svg className="action-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal 
        isOpen={showChangePassword} 
        onClose={() => {
          setShowChangePassword(false)
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
          setPasswordError('')
          setPasswordSuccess('')
        }}
        title="Change Password"
        size="medium"
      >
        <form onSubmit={handlePasswordSubmit} className="modal-form" aria-busy={isChangingPassword}>
          <div className="form-group">
            <label htmlFor="currentPassword" className="form-label">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              className="input"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
              autoComplete="current-password"
              disabled={isChangingPassword}
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              className="input"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              autoComplete="new-password"
              disabled={isChangingPassword}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="input"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
              autoComplete="new-password"
              disabled={isChangingPassword}
            />
          </div>
          {passwordError && (
            <div className="form-error">
              <svg className="error-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="form-success">
              <svg className="success-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {passwordSuccess}
            </div>
          )}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isChangingPassword} aria-disabled={isChangingPassword}>
              {isChangingPassword ? 'Updating...' : 'Update Password'}
            </button>
            <button 
              type="button" 
              className="btn cancel-btn" 
              onClick={() => {
                setShowChangePassword(false)
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                setPasswordError('')
                setPasswordSuccess('')
              }}
              disabled={isChangingPassword}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal 
        isOpen={showEditProfile} 
        onClose={() => {
          setShowEditProfile(false)
          setProfileData({ name: user.name })
          setProfileError('')
          setProfileSuccess('')
        }}
        title="Edit Profile"
        size="medium"
      >
        <form onSubmit={handleProfileSubmit} className="modal-form" aria-busy={isUpdatingProfile}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="input"
              value={profileData.name}
              onChange={handleProfileChange}
              required
              autoComplete="name"
              disabled={isUpdatingProfile}
            />
          </div>
          {profileError && (
            <div className="form-error">
              <svg className="error-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {profileError}
            </div>
          )}
          {profileSuccess && (
            <div className="form-success">
              <svg className="success-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {profileSuccess}
            </div>
          )}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isUpdatingProfile} aria-disabled={isUpdatingProfile}>
              {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
            </button>
            <button 
              type="button" 
              className="btn cancel-btn" 
              onClick={() => {
                setShowEditProfile(false)
                setProfileData({ name: user.name })
                setProfileError('')
                setProfileSuccess('')
              }}
              disabled={isUpdatingProfile}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Verify Email Modal */}
      <Modal
        isOpen={showVerifyModal}
        onClose={() => { setShowVerifyModal(false); setVerMsg(''); setVerCode('') }}
        title="Verify Email"
        size="small"
      >
        <div className="modal-form">
          <p style={{ marginBottom: '0.75rem' }}>
            We’ll send a 6-digit code to <strong>{user.email}</strong>. Enter it below to verify your email.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <button className="btn btn-tonal" disabled={cooldown > 0} onClick={async () => {
              setVerMsg('')
              try {
                await sendEmailVerification(token)
                setVerMsg('Verification code sent. Please check your inbox.')
                setCooldown(90)
              } catch (e) {
                setVerMsg(e.message || 'Failed to send code')
              }
            }}>{cooldown > 0 ? `Resend in ${cooldown}s` : 'Send Code'}</button>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="ver-code-0">Enter Code</label>
            <div className="otp-inputs" style={{justifyContent:'center'}} onPaste={handlePaste}>
              {verCodeDigits.map((digit, i) => (
                <input
                  key={i}
                  id={`ver-code-${i}`}
                  ref={(el) => (inputRefs[i].current = el)}
                  className="otp-cell"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleDigitKeyDown(i, e)}
                />
              ))}
            </div>
          </div>
          {verMsg && (
            <div className="message" role="status" style={{ marginTop: '0.5rem' }}>{verMsg}</div>
          )}
          <div className="form-actions">
            <button className="btn btn-tonal" onClick={async () => {
              setVerMsg('')
              try {
                const code = codeString
                if (!code || code.length !== 6) { setVerMsg('Enter the 6-digit code.'); return }
                await verifyEmailCode(code, token)
                setVerMsg('Email verified successfully!')
                setVerStatus({ emailVerified: true, emailVerifiedAt: new Date().toISOString() })
              } catch (e) {
                setVerMsg(e.message || 'Invalid or expired code')
              }
            }}>Verify</button>
            <button className="btn cancel-btn" onClick={() => setShowVerifyModal(false)}>Close</button>
          </div>
        </div>
      </Modal>

      {/* Bottom ad */}
      <div className="profile-ad">
        <ResponsiveAd />
      </div>
    </main>
  )
}
