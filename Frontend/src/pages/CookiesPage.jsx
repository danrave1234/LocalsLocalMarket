import React from 'react';

const CookiesPage = () => {
  return (
    <main className="cookies-container">
      {/* Hero Section */}
      <section className="cookies-hero">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="hero-content">
          <div className="hero-header">
            <div className="hero-logo">
              <svg className="hero-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="hero-title">Cookie Policy</span>
            </div>
            <h1 className="hero-heading">Cookie Management</h1>
            <p className="hero-subtitle">
              Learn about how we use cookies and similar technologies to enhance your experience.
            </p>
            <div className="hero-meta">
              <span className="last-updated">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Cookies Content */}
      <section className="cookies-content">
        <div className="content-wrapper">
          {/* Introduction */}
          <div className="cookies-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  What Are Cookies?
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  Cookies are small text files that are stored on your device (computer, tablet, or mobile) 
                  when you visit our website. They help us provide you with a better experience by remembering 
                  your preferences and analyzing how you use our site.
                </p>
                <p className="content-text">
                  This Cookie Policy explains what cookies we use, why we use them, and how you can control them.
                </p>
              </div>
            </div>
          </div>

          {/* Types of Cookies */}
          <div className="cookies-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Types of Cookies We Use
                </h2>
              </div>
              <div className="card-content">
                <div className="cookie-types-grid">
                  <div className="cookie-type-card">
                    <div className="type-header">
                      <svg className="type-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <h3 className="type-title">Essential Cookies</h3>
                    </div>
                    <p className="type-description">
                      These cookies are necessary for the website to function properly. They enable basic 
                      functions like page navigation, access to secure areas, and form submissions.
                    </p>
                    <ul className="type-list">
                      <li>Authentication cookies to keep you logged in</li>
                      <li>Security cookies to protect against fraud</li>
                      <li>Session cookies to maintain your browsing session</li>
                    </ul>
                  </div>

                  <div className="cookie-type-card">
                    <div className="type-header">
                      <svg className="type-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 19V13C9 12.4696 9.21071 11.9609 9.58579 11.5858C9.96086 11.2107 10.4696 11 11 11H13C13.5304 11 14.0391 11.2107 14.4142 11.5858C14.7893 11.9609 15 12.4696 15 13V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5 19V13C5 12.4696 5.21071 11.9609 5.58579 11.5858C5.96086 11.2107 6.46957 11 7 11H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M13 19V13C13 12.4696 13.2107 11.9609 13.5858 11.5858C13.9609 11.2107 14.4696 11 15 11H17C17.5304 11 18.0391 11.2107 18.4142 11.5858C18.7893 11.9609 19 12.4696 19 13V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 19H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h3 className="type-title">Performance Cookies</h3>
                    </div>
                    <p className="type-description">
                      These cookies help us understand how visitors interact with our website by collecting 
                      and reporting information anonymously.
                    </p>
                    <ul className="type-list">
                      <li>Google Analytics cookies to track page views and user behavior</li>
                      <li>Performance monitoring cookies to identify and fix issues</li>
                      <li>Error tracking cookies to improve site reliability</li>
                    </ul>
                  </div>

                  <div className="cookie-type-card">
                    <div className="type-header">
                      <svg className="type-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h3 className="type-title">Functional Cookies</h3>
                    </div>
                    <p className="type-description">
                      These cookies enable enhanced functionality and personalization, such as remembering 
                      your preferences and settings.
                    </p>
                    <ul className="type-list">
                      <li>Language preference cookies</li>
                      <li>Theme and display preference cookies</li>
                      <li>Form auto-fill cookies</li>
                    </ul>
                  </div>

                  <div className="cookie-type-card">
                    <div className="type-header">
                      <svg className="type-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                        <path d="M22 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18 16L22 12L18 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h3 className="type-title">Marketing Cookies</h3>
                    </div>
                    <p className="type-description">
                      These cookies are used to track visitors across websites to display relevant and 
                      engaging advertisements.
                    </p>
                    <ul className="type-list">
                      <li>Social media cookies for sharing and integration</li>
                      <li>Advertising cookies to show relevant ads</li>
                      <li>Retargeting cookies to remind you of our services</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Specific Cookies */}
          <div className="cookies-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Specific Cookies We Use
                </h2>
              </div>
              <div className="card-content">
                <div className="cookies-table-container">
                  <table className="cookies-table">
                    <thead>
                      <tr>
                        <th>Cookie Name</th>
                        <th>Purpose</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code>session_id</code></td>
                        <td>Maintains your login session</td>
                        <td>Session</td>
                      </tr>
                      <tr>
                        <td><code>_ga</code></td>
                        <td>Google Analytics tracking</td>
                        <td>2 years</td>
                      </tr>
                      <tr>
                        <td><code>_gid</code></td>
                        <td>Google Analytics session tracking</td>
                        <td>24 hours</td>
                      </tr>
                      <tr>
                        <td><code>language_pref</code></td>
                        <td>Remembers your language preference</td>
                        <td>1 year</td>
                      </tr>
                      <tr>
                        <td><code>theme_pref</code></td>
                        <td>Remembers your theme preference</td>
                        <td>1 year</td>
                      </tr>
                      <tr>
                        <td><code>cookie_consent</code></td>
                        <td>Remembers your cookie preferences</td>
                        <td>1 year</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Third-Party Cookies */}
          <div className="cookies-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 16V8A2 2 0 0 0 19 6H5A2 2 0 0 0 3 8V16A2 2 0 0 0 5 18H19A2 2 0 0 0 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Third-Party Cookies
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  We may use third-party services that place cookies on your device. These services include:
                </p>
                
                <div className="third-party-grid">
                  <div className="third-party-card">
                    <div className="party-header">
                      <svg className="party-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 19V13C9 12.4696 9.21071 11.9609 9.58579 11.5858C9.96086 11.2107 10.4696 11 11 11H13C13.5304 11 14.0391 11.2107 14.4142 11.5858C14.7893 11.9609 15 12.4696 15 13V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5 19V13C5 12.4696 5.21071 11.9609 5.58579 11.5858C5.96086 11.2107 6.46957 11 7 11H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M13 19V13C13 12.4696 13.2107 11.9609 13.5858 11.5858C13.9609 11.2107 14.4696 11 15 11H17C17.5304 11 18.0391 11.2107 18.4142 11.5858C18.7893 11.9609 19 12.4696 19 13V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 19H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h3 className="party-title">Google Analytics</h3>
                    </div>
                    <p className="party-description">
                      We use Google Analytics to understand how visitors use our website. Google Analytics 
                      uses cookies to collect information about your use of our site, including your IP address. 
                      This information is transmitted to and stored by Google on servers in the United States.
                    </p>
                  </div>

                  <div className="third-party-card">
                    <div className="party-header">
                      <svg className="party-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 2H15A5 5 0 0 0 10 7V8H7A5 5 0 0 0 2 13V16A5 5 0 0 0 7 21H18A5 5 0 0 0 23 16V7A5 5 0 0 0 18 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 8V7A5 5 0 0 1 15 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h3 className="party-title">Social Media Platforms</h3>
                    </div>
                    <p className="party-description">
                      Our website may include social media features (like Facebook, Twitter, or LinkedIn buttons) 
                      that may place cookies on your device. These cookies are controlled by the respective 
                      social media platforms.
                    </p>
                  </div>

                  <div className="third-party-card">
                    <div className="party-header">
                      <svg className="party-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                        <line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <h3 className="party-title">Payment Processors</h3>
                    </div>
                    <p className="party-description">
                      When you make payments through our platform, our payment processors (like Stripe) may 
                      place cookies to ensure secure transactions and prevent fraud.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Managing Cookies */}
          <div className="cookies-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Managing Your Cookie Preferences
                </h2>
              </div>
              <div className="card-content">
                <div className="management-grid">
                  <div className="management-card">
                    <div className="management-header">
                      <svg className="management-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h3 className="management-title">Browser Settings</h3>
                    </div>
                    <p className="management-description">
                      Most web browsers allow you to control cookies through their settings. You can:
                    </p>
                    <ul className="management-list">
                      <li>View and delete existing cookies</li>
                      <li>Block cookies from being set</li>
                      <li>Set preferences for different types of cookies</li>
                      <li>Clear cookies when you close your browser</li>
                    </ul>
                    <p className="management-note">
                      Note: Disabling certain cookies may affect the functionality of our website.
                    </p>
                  </div>

                  <div className="management-card">
                    <div className="management-header">
                      <svg className="management-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <h3 className="management-title">Cookie Consent</h3>
                    </div>
                    <p className="management-description">
                      When you first visit our website, you'll see a cookie consent banner that allows you to:
                    </p>
                    <ul className="management-list">
                      <li>Accept all cookies</li>
                      <li>Reject non-essential cookies</li>
                      <li>Customize your cookie preferences</li>
                    </ul>
                    <p className="management-description">
                      You can change your cookie preferences at any time by clicking the "Cookie Settings" 
                      link in our footer.
                    </p>
                  </div>

                  <div className="management-card">
                    <div className="management-header">
                      <svg className="management-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 13A5 5 0 0 0 20 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 13H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 13H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M13 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M13 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 6L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 8L8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 18L14 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 16L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h3 className="management-title">Opt-Out Links</h3>
                    </div>
                    <p className="management-description">
                      For third-party cookies, you can opt out directly through the service providers:
                    </p>
                    <ul className="management-list">
                      <li><a href="https://tools.google.com/dlpage/gaoptout" className="opt-out-link">Google Analytics Opt-out</a></li>
                      <li><a href="https://www.facebook.com/help/cookies" className="opt-out-link">Facebook Cookie Settings</a></li>
                      <li><a href="https://help.twitter.com/en/rules-and-policies/twitter-cookies" className="opt-out-link">Twitter Cookie Settings</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Updates to Policy */}
          <div className="cookies-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Updates to This Cookie Policy
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  We may update this Cookie Policy from time to time to reflect changes in our practices 
                  or for other operational, legal, or regulatory reasons. We will notify you of any material 
                  changes by:
                </p>
                <ul className="content-list">
                  <li>Posting the updated policy on our website</li>
                  <li>Updating the "Last updated" date</li>
                  <li>Sending email notifications to registered users (for significant changes)</li>
                </ul>
                <p className="content-text">
                  We encourage you to review this Cookie Policy periodically to stay informed about how 
                  we use cookies.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="cookies-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Contact Us
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  If you have any questions about our use of cookies or this Cookie Policy, please contact us:
                </p>
                <div className="contact-info">
                  <div className="contact-item">
                    <svg className="contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span><strong>Email:</strong> privacy@localslocalmarket.com</span>
                  </div>
                  <div className="contact-item">
                    <svg className="contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span><strong>Address:</strong> 123 Main Street, Suite 100, New York, NY 10001</span>
                  </div>
                  <div className="contact-item">
                    <svg className="contact-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1469 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0973 21.9452 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3146 6.72533 15.2661 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.09477 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65182C2.82196 2.44695 3.0498 2.28335 3.30379 2.17149C3.55778 2.05963 3.83233 2.00189 4.10999 2H7.10999C7.59522 1.99522 8.06574 2.16708 8.43376 2.48353C8.80178 2.79999 9.042 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97348 7.27675 9.89399 7.653C9.81449 8.02925 9.62984 8.37425 9.35999 8.65L8.08999 9.92C9.51355 12.4135 11.5865 14.4865 14.08 15.91L15.35 14.64C15.6258 14.3702 15.9708 14.1855 16.347 14.106C16.7233 14.0265 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7635 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span><strong>Phone:</strong> +1 (555) 123-4567</span>
                  </div>
                </div>
                <p className="content-text">
                  We will respond to your inquiry within 30 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CookiesPage;
