import React from 'react';
import SEOHead from '../components/SEOHead.jsx';
import '../cookie.css';

const CookiePage = () => {
  return (
    <>
      <SEOHead 
        title="Cookie Policy - LocalsLocalMarket"
        description="Learn how LocalsLocalMarket uses cookies and similar technologies to enhance your experience on our local business marketplace platform."
        keywords="cookie policy, privacy, local business marketplace, data protection, cookies, tracking, analytics"
        url="https://localslocalmarket.com/cookies"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Cookie Policy - LocalsLocalMarket",
          "description": "Information about how we use cookies on our local business marketplace platform",
          "url": "https://localslocalmarket.com/cookies"
        }}
      />
      <main className="cookie-container">
      {/* Hero Section */}
      <section className="cookie-header">
        <h1 className="cookie-title">Cookie Policy</h1>
        <p className="cookie-subtitle">
          Learn how LocalsLocalMarket uses cookies and similar technologies to enhance your experience on our local business marketplace platform.
        </p>
      </section>

      {/* Cookie Content */}
      <section className="cookie-content">
        <div className="cookie-section">
          <h2 className="section-title">What Are Cookies?</h2>
          <div className="section-content">
            <p>
              Cookies are small text files that are stored on your device when you visit LocalsLocalMarket. 
              They help us provide you with a better experience by remembering your preferences, 
              analyzing how you use our local business marketplace, and personalizing content and business recommendations.
            </p>
          </div>
        </div>

        <div className="cookie-section">
          <h2 className="section-title">How We Use Cookies</h2>
          <div className="section-content">
            <p>
              LocalsLocalMarket uses cookies for several purposes to enhance our local business marketplace:
            </p>
            <ul className="cookie-list">
              <li><strong>Essential Cookies:</strong> Required for basic marketplace functionality, user authentication, and business listing management</li>
              <li><strong>Performance Cookies:</strong> Help us understand how users interact with our local business marketplace</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences, location settings, and business search history</li>
              <li><strong>Marketing Cookies:</strong> Deliver relevant local business advertisements and promotions</li>
            </ul>
          </div>
        </div>

        <div className="cookie-section">
          <h2 className="section-title">Types of Cookies We Use</h2>
          <div className="section-content">
            <div className="cookie-type">
              <h3 className="cookie-type-title">Essential Cookies</h3>
              <p className="cookie-type-description">
                These cookies are necessary for LocalsLocalMarket to function properly. They enable basic functions 
                like user authentication, business listing management, secure marketplace interactions, and form submissions. 
                The platform cannot function properly without these cookies.
              </p>
              <div className="cookie-examples">
                <strong>Examples:</strong> User authentication, business listing management, secure transactions, marketplace security
              </div>
            </div>

            <div className="cookie-type">
              <h3 className="cookie-type-title">Performance Cookies</h3>
              <p className="cookie-type-description">
                These cookies help us understand how users interact with our local business marketplace by collecting and 
                reporting information anonymously. This helps us improve our platform, business listings, and user experience.
              </p>
              <div className="cookie-examples">
                <strong>Examples:</strong> Google Analytics, page load times, business search patterns, marketplace usage statistics
              </div>
            </div>

            <div className="cookie-type">
              <h3 className="cookie-type-title">Functional Cookies</h3>
              <p className="cookie-type-description">
                These cookies enable enhanced functionality and personalization for our marketplace, such as remembering your 
                location preferences, favorite businesses, search history, and account settings.
              </p>
              <div className="cookie-examples">
                <strong>Examples:</strong> Location preferences, favorite businesses, search history, business listing preferences, login status
              </div>
            </div>

            <div className="cookie-type">
              <h3 className="cookie-type-title">Marketing Cookies</h3>
              <p className="cookie-type-description">
                These cookies are used to track visitors across websites to display relevant local business 
                advertisements and promotions. They help us show you businesses and services that match your interests 
                and location.
              </p>
              <div className="cookie-examples">
                <strong>Examples:</strong> Social media pixels, advertising networks, local business remarketing, location-based promotions
              </div>
            </div>
          </div>
        </div>

        <div className="cookie-section">
          <h2 className="section-title">Third-Party Cookies</h2>
          <div className="section-content">
            <p>
              LocalsLocalMarket may use third-party services that place cookies on your device to enhance our 
              local business marketplace functionality:
            </p>
            <ul className="cookie-list">
              <li><strong>Analytics Services:</strong> Google Analytics, Facebook Pixel for marketplace insights</li>
              <li><strong>Advertising Networks:</strong> Google Ads, Facebook Ads for local business promotions</li>
              <li><strong>Social Media:</strong> Facebook, Twitter, Instagram for business sharing and reviews</li>
              <li><strong>Maps & Location:</strong> Google Maps for business locations and directions</li>
            </ul>
            <p>
              These third-party services have their own privacy policies and cookie practices. 
              We encourage you to review their policies.
            </p>
          </div>
        </div>

        <div className="cookie-section">
          <h2 className="section-title">Managing Your Cookie Preferences</h2>
          <div className="section-content">
            <p>
              You have several options for managing cookies:
            </p>
            <ul className="cookie-list">
              <li><strong>Browser Settings:</strong> Most browsers allow you to control cookies through settings</li>
              <li><strong>Cookie Consent:</strong> Use our cookie consent banner to manage preferences</li>
              <li><strong>Opt-Out Tools:</strong> Use industry opt-out tools for advertising cookies</li>
            </ul>
            <div className="cookie-highlight">
              <h3 className="highlight-title">Important Note</h3>
              <p className="highlight-content">
                Disabling certain cookies may affect the functionality of our website. Essential cookies 
                cannot be disabled as they are necessary for basic site operation.
              </p>
            </div>
          </div>
        </div>

        <div className="cookie-section">
          <h2 className="section-title">Cookie Retention</h2>
          <div className="section-content">
            <p>
              Different types of cookies have different retention periods:
            </p>
            <ul className="cookie-list">
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain on your device for a set period</li>
              <li><strong>Analytics Cookies:</strong> Typically retained for 2 years</li>
              <li><strong>Marketing Cookies:</strong> Usually retained for 1-2 years</li>
            </ul>
          </div>
        </div>

        <div className="cookie-section">
          <h2 className="section-title">Updates to This Policy</h2>
          <div className="section-content">
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices 
              or applicable laws. We will notify you of any material changes by:
            </p>
            <ul className="cookie-list">
              <li>Posting the updated policy on our website</li>
              <li>Sending email notifications to registered users</li>
              <li>Displaying a prominent notice on our platform</li>
            </ul>
            <p>
              Your continued use of our platform after such changes constitutes acceptance of the updated policy.
            </p>
          </div>
        </div>

        <div className="cookie-section">
          <h2 className="section-title">Contact Us</h2>
          <div className="section-content">
            <p>
              If you have any questions about our use of cookies, please contact us:
            </p>
            <div className="cookie-highlight">
              <h3 className="highlight-title">Contact Information</h3>
              <p className="highlight-content">
                Email: danrave.keh@localslocalmarket.com<br />
                <br />
                This is a personal project developed by Danrave Keh. For questions about cookies 
                and privacy on our local business marketplace platform, please contact the developer directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cookie Settings */}
      <section className="cookie-settings">
        <h2 className="settings-title">Cookie Settings</h2>
        <p className="settings-description">
          Manage your cookie preferences below. You can change these settings at any time.
        </p>
        
        <div className="settings-options">
          <div className="setting-option">
            <div className="setting-header">
              <h3 className="setting-title">Essential Cookies</h3>
              <div className="setting-toggle">
                <input type="checkbox" id="essential" checked disabled />
                <label htmlFor="essential" className="toggle-label">Always Active</label>
              </div>
            </div>
            <p className="setting-description">
              These cookies are necessary for the website to function and cannot be disabled.
            </p>
          </div>

          <div className="setting-option">
            <div className="setting-header">
              <h3 className="setting-title">Performance Cookies</h3>
              <div className="setting-toggle">
                <input type="checkbox" id="performance" defaultChecked />
                <label htmlFor="performance" className="toggle-label">Active</label>
              </div>
            </div>
            <p className="setting-description">
              Help us understand how visitors use our website to improve performance.
            </p>
          </div>

          <div className="setting-option">
            <div className="setting-header">
              <h3 className="setting-title">Functional Cookies</h3>
              <div className="setting-toggle">
                <input type="checkbox" id="functional" defaultChecked />
                <label htmlFor="functional" className="toggle-label">Active</label>
              </div>
            </div>
            <p className="setting-description">
              Remember your preferences and provide enhanced functionality.
            </p>
          </div>

          <div className="setting-option">
            <div className="setting-header">
              <h3 className="setting-title">Marketing Cookies</h3>
              <div className="setting-toggle">
                <input type="checkbox" id="marketing" />
                <label htmlFor="marketing" className="toggle-label">Inactive</label>
              </div>
            </div>
            <p className="setting-description">
              Used to deliver relevant advertisements and track marketing campaigns.
            </p>
          </div>
        </div>

        <div className="settings-actions">
          <button className="save-settings">Save Settings</button>
          <button className="accept-all">Accept All Cookies</button>
        </div>
      </section>

      {/* Contact Section */}
      <section className="cookie-contact">
        <h2 className="contact-title">Questions About Cookies?</h2>
        <p className="contact-description">
          The developer is here to help with any questions about our cookie policy on LocalsLocalMarket.
        </p>
        <a href="/contact" className="contact-button">
          Contact Developer
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </section>

      {/* Last Updated */}
      <div className="last-updated">
        <p>Last updated: December 2024</p>
      </div>
    </main>
    </>
  );
};

export default CookiePage;
