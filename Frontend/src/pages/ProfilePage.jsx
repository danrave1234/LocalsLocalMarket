import { useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import Modal from '../components/Modal.jsx'
import { ResponsiveAd } from '../components/GoogleAds.jsx'

export default function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth()
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [profileData, setProfileData] = useState({
    name: user?.name || ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')

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

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match.')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.')
      return
    }

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
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileError('')
    setProfileSuccess('')

    if (!profileData.name.trim()) {
      setProfileError('Name is required.')
      return
    }

    try {
      await updateProfile(profileData)
      setProfileSuccess('Profile updated successfully!')
      setShowEditProfile(false)
    } catch (error) {
      setProfileError(error.message || 'Failed to update profile.')
    }
  }

  return (
    <main className="container" style={{ display: 'grid', placeItems: 'center', paddingTop: '1rem' }}>
      <section className="card" style={{ width: '100%', maxWidth: 640, padding: '1.25rem' }}>
        <h2 style={{ margin: 0 }}>My Profile</h2>
        {user ? (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Personal Information</h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--card-bg)', borderRadius: '8px' }}>
                  <span className="muted">Name</span>
                  <span style={{ fontWeight: 500 }}>{user.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--card-bg)', borderRadius: '8px' }}>
                  <span className="muted">Email</span>
                  <span style={{ fontWeight: 500 }}>{user.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--card-bg)', borderRadius: '8px' }}>
                  <span className="muted">Member Since</span>
                  <span style={{ fontWeight: 500 }}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--card-bg)', borderRadius: '8px' }}>
                  <span className="muted">Account Status</span>
                  <span style={{ color: 'var(--success)', fontWeight: 500 }}>Active</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Account Security</h3>
              <button 
                className="btn" 
                onClick={() => setShowChangePassword(!showChangePassword)}
                style={{ justifyContent: 'flex-start' }}
              >
                Change Password
              </button>
              
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
                <form onSubmit={handlePasswordSubmit} style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label htmlFor="currentPassword" className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      className="input"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      autoComplete="current-password"
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      className="input"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="input"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                  {passwordError && <p style={{ color: 'var(--error)', margin: 0 }}>{passwordError}</p>}
                  {passwordSuccess && <p style={{ color: 'var(--success)', margin: 0 }}>{passwordSuccess}</p>}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="submit" className="btn btn-primary">Update Password</button>
                    <button 
                      type="button" 
                      className="btn" 
                      onClick={() => {
                        setShowChangePassword(false)
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                        setPasswordError('')
                        setPasswordSuccess('')
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Modal>
            </div>

            <div>
              <h3 style={{ marginBottom: '1rem' }}>Account Actions</h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <button 
                  className="btn" 
                  onClick={() => setShowEditProfile(!showEditProfile)}
                  style={{ justifyContent: 'flex-start' }}
                >
                  Edit Profile
                </button>
                <button className="btn" style={{ justifyContent: 'flex-start', color: 'var(--error)' }}>Delete Account</button>
              </div>

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
                <form onSubmit={handleProfileSubmit} style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label htmlFor="name" className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="input"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      required
                      autoComplete="name"
                    />
                  </div>
                  {profileError && <p style={{ color: 'var(--error)', margin: 0 }}>{profileError}</p>}
                  {profileSuccess && <p style={{ color: 'var(--success)', margin: 0 }}>{profileSuccess}</p>}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="submit" className="btn btn-primary">Update Profile</button>
                    <button 
                      type="button" 
                      className="btn" 
                      onClick={() => {
                        setShowEditProfile(false)
                        setProfileData({ name: user.name })
                        setProfileError('')
                        setProfileSuccess('')
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Modal>
                         </div>
           </div>
         ) : (
           <p className="muted">Loading...</p>
         )}
       </section>
       
       {/* Bottom ad */}
       <div style={{ marginTop: '2rem', padding: '1rem 0', borderTop: '1px solid var(--border)' }}>
         <ResponsiveAd />
       </div>
     </main>
   )
 }
