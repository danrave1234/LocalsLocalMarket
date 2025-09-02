import { useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import { SkeletonText, SkeletonButton } from '../components/Skeleton.jsx'

export default function SettingsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState(true)
  const [locationSharing, setLocationSharing] = useState(true)
  const [theme, setTheme] = useState('dark')

  return (
    <main className="container" style={{ display: 'grid', placeItems: 'center', paddingTop: '1rem' }}>
      <section className="card" style={{ width: '100%', maxWidth: 640, padding: '1.25rem' }}>
        <h2 style={{ margin: 0 }}>Settings</h2>
        {user ? (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.75rem' }}>Preferences</h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 500 }}>Push Notifications</p>
                    <p className="muted" style={{ margin: 0, fontSize: '0.875rem' }}>Get notified about new shops and products</p>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
                    <input
                      type="checkbox"
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: notifications ? 'var(--accent)' : 'var(--border)',
                      borderRadius: 24,
                      transition: '0.3s',
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '',
                        height: 18,
                        width: 18,
                        left: 3,
                        bottom: 3,
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        transition: '0.3s',
                        transform: notifications ? 'translateX(20px)' : 'translateX(0)',
                      }} />
                    </span>
                  </label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 500 }}>Location Sharing</p>
                    <p className="muted" style={{ margin: 0, fontSize: '0.875rem' }}>Allow location-based shop recommendations</p>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
                    <input
                      type="checkbox"
                      checked={locationSharing}
                      onChange={(e) => setLocationSharing(e.target.checked)}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: locationSharing ? 'var(--accent)' : 'var(--border)',
                      borderRadius: 24,
                      transition: '0.3s',
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '',
                        height: 18,
                        width: 18,
                        left: 3,
                        bottom: 3,
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        transition: '0.3s',
                        transform: locationSharing ? 'translateX(20px)' : 'translateX(0)',
                      }} />
                    </span>
                  </label>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.75rem' }}>Appearance</h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={theme === 'dark'}
                    onChange={(e) => setTheme(e.target.value)}
                  />
                  <span>Dark Theme</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={theme === 'light'}
                    onChange={(e) => setTheme(e.target.value)}
                  />
                  <span>Light Theme</span>
                </label>
              </div>
            </div>
                         <div>
               <h3 style={{ marginBottom: '0.75rem' }}>Account</h3>
               <div style={{ display: 'grid', gap: '0.5rem' }}>
                 <button className="btn" style={{ justifyContent: 'flex-start' }}>Edit Profile</button>
                 <button className="btn" style={{ justifyContent: 'flex-start' }}>Download My Data</button>
                 <button className="btn" style={{ justifyContent: 'flex-start', color: 'var(--error)' }}>Delete Account</button>
               </div>
             </div>
          </div>
        ) : (
          <div style={{ marginTop: '1rem' }}>
            <SkeletonText lines={1} height="1.5rem" style={{ marginBottom: '1rem' }} />
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <SkeletonText lines={1} height="1.2rem" style={{ marginBottom: '0.5rem' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <SkeletonText lines={1} height="1rem" style={{ marginBottom: '0.25rem' }} />
                    <SkeletonText lines={1} height="0.875rem" style={{ width: '60%' }} />
                  </div>
                  <SkeletonButton width="44px" height="24px" style={{ borderRadius: '24px' }} />
                </div>
              </div>
              <div>
                <SkeletonText lines={1} height="1.2rem" style={{ marginBottom: '0.5rem' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <SkeletonText lines={1} height="1rem" style={{ marginBottom: '0.25rem' }} />
                    <SkeletonText lines={1} height="0.875rem" style={{ width: '60%' }} />
                  </div>
                  <SkeletonButton width="44px" height="24px" style={{ borderRadius: '24px' }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
