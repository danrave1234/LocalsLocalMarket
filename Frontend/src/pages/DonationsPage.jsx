import { useState } from 'react'
import { Link } from 'react-router-dom'
import './DonationsPage.css'

export default function DonationsPage() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className="donation-page-container">
      <div className="donation-page-grid">
        
        {/* Header Section - Centered at Top */}
        <div className="donation-header">
          <h1 className="donation-title">
            Support LocalsLocalMarket
          </h1>
          <p className="donation-description">
            Help us build a stronger local community by supporting our platform. Your donations help us maintain and improve our services for local businesses and customers.
          </p>
        </div>

        {/* QR Code Section - First in mobile view */}
        <div className="donation-card qr-section">
          <h3 className="qr-title">Scan QR Code</h3>
          <div className="qr-content">
            <div className="gcash-qr-container">
              <img
                src="/gcash.jpg"
                alt="GCash QR Code for LocalsLocalMarket donations"
                className="gcash-qr-image"
                loading="eager"
                decoding="async"
              />
              <button 
                className="fullscreen-button"
                onClick={toggleFullscreen}
                title="View QR code in fullscreen"
              >
                ⛶
              </button>
            </div>
            <div className="gcash-info">
              <p className="gcash-instructions">
                Scan this QR code with your GCash app to make a donation
              </p>
              <div className="gcash-details">
                <p className="recipient">Recipient: Drave</p>
                <p className="mobile">Mobile: +63 999 983....</p>
                <p className="fees">Transfer fees may apply</p>
              </div>
            </div>
          </div>
        </div>

        {/* GCash Section with Why Donate - Second in mobile view */}
        <section aria-labelledby="gcash-heading" className="donation-card gcash-section">
          <h2 id="gcash-heading" className="gcash-title">
            💙 GCash Payment
          </h2>
          
          {/* Why Donate Section Inside GCash Card */}
          <div className="why-donate-section">
            <h3 className="why-donate-title">Why Donate?</h3>
            <ul className="why-donate-list">
              <li className="why-donate-item">
                <span className="why-donate-check">✓</span>
                <span>Support local businesses</span>
              </li>
              <li className="why-donate-item">
                <span className="why-donate-check">✓</span>
                <span>Platform development</span>
              </li>
              <li className="why-donate-item">
                <span className="why-donate-check">✓</span>
                <span>Community features</span>
              </li>
              <li className="why-donate-item">
                <span className="why-donate-check">✓</span>
                <span>Server maintenance</span>
              </li>
              <li className="why-donate-item">
                <span className="why-donate-check">✓</span>
                <span>Customer support</span>
              </li>
            </ul>
          </div>
        </section>
      </div>

      {/* Fullscreen QR Code Modal */}
      {isFullscreen && (
        <div className="qr-fullscreen-modal" onClick={toggleFullscreen}>
          <div className="qr-fullscreen-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-fullscreen-button" onClick={toggleFullscreen}>
              ✕
            </button>
            <div className="qr-fullscreen-container">
              <img
                src="/gcash.jpg"
                alt="GCash QR Code for LocalsLocalMarket donations"
                className="qr-fullscreen-image"
                loading="eager"
                decoding="async"
              />
            </div>
            <div className="qr-fullscreen-info">
              <p className="qr-fullscreen-instructions">
                Scan this QR code with your GCash app to make a donation
              </p>
              <div className="qr-fullscreen-details">
                <p className="recipient">Recipient: Drave</p>
                <p className="mobile">Mobile: +63 999 983....</p>
                <p className="fees">Transfer fees may apply</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to Home Link */}
      <div className="back-link-container">
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
