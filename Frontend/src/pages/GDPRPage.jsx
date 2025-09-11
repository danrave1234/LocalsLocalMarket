import React from 'react';
import SEOHead from '../components/SEOHead.jsx'
import '../gdpr.css';

const GDPRPage = () => {
  return (
    <>
      <SEOHead 
        title="GDPR Compliance - LocalsLocalMarket"
        description="Your GDPR rights and how LocalsLocalMarket protects your privacy and personal data in our local business marketplace platform."
        url="https://localslocalmarket.com/gdpr"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "GDPR Compliance - LocalsLocalMarket",
          "description": "Information about GDPR rights and our data protection practices.",
          "url": "https://localslocalmarket.com/gdpr"
        }}
      />
      <main className="gdpr-container">
      {/* Hero Section */}
      <section className="gdpr-header">
        <h1 className="gdpr-title">GDPR Compliance</h1>
        <p className="gdpr-subtitle">
          Your data protection rights under the General Data Protection Regulation (GDPR) and how we protect your privacy on our local business marketplace platform.
        </p>
      </section>

      {/* GDPR Content */}
      <section className="gdpr-content">
        <div className="gdpr-section">
          <h2 className="section-title">What is GDPR?</h2>
          <div className="section-content">
            <p>
              The General Data Protection Regulation (GDPR) is a comprehensive data protection law that gives 
              individuals in the European Union greater control over their personal data and requires organizations 
              to protect that data. LocalsLocalMarket, as a local business marketplace platform, is committed to 
              full GDPR compliance in handling user data, business listings, and marketplace interactions.
            </p>
          </div>
        </div>

        <div className="gdpr-section">
          <h2 className="section-title">Your Rights Under GDPR</h2>
          <div className="section-content">
            <p>
              As a user of LocalsLocalMarket, whether you're a customer browsing local businesses or a business owner 
              listing your services, you have the following rights regarding your personal data:
            </p>
            <div className="rights-grid">
              <div className="right-item">
                <h3 className="right-title">Right to Access</h3>
                <p className="right-description">
                  You have the right to request a copy of the personal data we hold about you, including your 
                  account information, business listings, reviews, and marketplace interactions.
                </p>
              </div>

              <div className="right-item">
                <h3 className="right-title">Right to Rectification</h3>
                <p className="right-description">
                  You can request that we correct any inaccurate or incomplete personal data, including your 
                  business information, contact details, or profile settings.
                </p>
              </div>

              <div className="right-item">
                <h3 className="right-title">Right to Erasure</h3>
                <p className="right-description">
                  You can request that we delete your personal data, including your account, business listings, 
                  and marketplace interactions, in certain circumstances (right to be forgotten).
                </p>
              </div>

              <div className="right-item">
                <h3 className="right-title">Right to Restrict Processing</h3>
                <p className="right-description">
                  You can request that we limit how we use your personal data, such as restricting 
                  marketing communications or data processing for specific purposes.
                </p>
              </div>

              <div className="right-item">
                <h3 className="right-title">Right to Data Portability</h3>
                <p className="right-description">
                  You can request a copy of your personal data, including your business listings and 
                  marketplace data, in a structured, machine-readable format for transfer to another platform.
                </p>
              </div>

              <div className="right-item">
                <h3 className="right-title">Right to Object</h3>
                <p className="right-description">
                  You can object to our processing of your personal data for marketing purposes or 
                  other specific uses related to the marketplace platform.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="gdpr-section">
          <h2 className="section-title">How We Process Your Data</h2>
          <div className="section-content">
            <p>
              LocalsLocalMarket processes your personal data based on the following legal grounds:
            </p>
            <ul className="gdpr-list">
              <li><strong>Consent:</strong> When you create an account, list your business, or subscribe to marketing communications</li>
              <li><strong>Contract:</strong> When processing is necessary to provide our marketplace services and facilitate business transactions</li>
              <li><strong>Legitimate Interest:</strong> When processing is necessary for platform security, fraud prevention, and improving our marketplace services</li>
              <li><strong>Legal Obligation:</strong> When processing is required by law, such as tax reporting or regulatory compliance</li>
            </ul>
          </div>
        </div>

        <div className="gdpr-section">
          <h2 className="section-title">Data Protection Measures</h2>
          <div className="section-content">
            <p>
              LocalsLocalMarket implements comprehensive data protection measures to ensure your personal data 
              and business information are secure on our marketplace platform:
            </p>
            <div className="measures-grid">
              <div className="measure-item">
                <h3 className="measure-title">Encryption</h3>
                <p className="measure-description">
                  All personal data, business listings, and marketplace interactions are encrypted both 
                  in transit and at rest using industry-standard protocols.
                </p>
              </div>

              <div className="measure-item">
                <h3 className="measure-title">Access Controls</h3>
                <p className="measure-description">
                  Strict access controls ensure only authorized personnel can access personal data 
                  and business information on our platform.
                </p>
              </div>

              <div className="measure-item">
                <h3 className="measure-title">Regular Audits</h3>
                <p className="measure-description">
                  We conduct regular security audits and assessments to maintain data protection 
                  standards for our marketplace platform.
                </p>
              </div>

              <div className="measure-item">
                <h3 className="measure-title">Data Minimization</h3>
                <p className="measure-description">
                  We only collect and process the minimum amount of personal data necessary for 
                  providing our marketplace services and facilitating local business connections.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="gdpr-section">
          <h2 className="section-title">Data Transfers</h2>
          <div className="section-content">
            <p>
              Your personal data may be transferred to and processed in countries outside the European Economic Area (EEA). 
              When such transfers occur, we ensure they are protected by appropriate safeguards:
            </p>
            <ul className="gdpr-list">
              <li>Adequacy decisions by the European Commission</li>
              <li>Standard contractual clauses approved by the European Commission</li>
              <li>Binding corporate rules for transfers within our organization</li>
              <li>Other appropriate safeguards as required by GDPR</li>
            </ul>
          </div>
        </div>

        <div className="gdpr-section">
          <h2 className="section-title">Data Retention</h2>
          <div className="section-content">
            <p>
              We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, 
              including for the purposes of satisfying any legal, regulatory, tax, accounting, or reporting requirements.
            </p>
            <div className="gdpr-highlight">
              <h3 className="highlight-title">Retention Periods</h3>
              <p className="highlight-content">
                User account data: Until account deletion<br />
                Business listings: Until business closure or deletion<br />
                Customer reviews: Until account deletion or business closure<br />
                Marketplace interactions: 2 years<br />
                Analytics data: 2 years<br />
                Marketing data: Until consent withdrawal<br />
                Legal obligations: As required by applicable law
              </p>
            </div>
          </div>
        </div>

        <div className="gdpr-section">
          <h2 className="section-title">Exercising Your Rights</h2>
          <div className="section-content">
            <p>
              To exercise any of your GDPR rights, you can:
            </p>
            <ul className="gdpr-list">
              <li>Use the privacy settings in your account dashboard</li>
              <li>Contact the developer at danrave.keh@localslocalmarket.com</li>
              <li>Submit a request through our GDPR request form below</li>
              <li>Contact us through our general contact channels</li>
            </ul>
            <p>
              We will respond to your request within 30 days, though this may be extended in complex cases.
            </p>
          </div>
        </div>

        <div className="gdpr-section">
          <h2 className="section-title">Data Breach Procedures</h2>
          <div className="section-content">
            <p>
              In the unlikely event of a data breach that affects your personal data or business information 
              on LocalsLocalMarket, we have procedures in place to:
            </p>
            <ul className="gdpr-list">
              <li>Detect and assess the breach within 72 hours</li>
              <li>Notify relevant supervisory authorities as required</li>
              <li>Inform affected individuals when necessary</li>
              <li>Take immediate steps to contain and remediate the breach</li>
              <li>Document all actions taken and lessons learned</li>
            </ul>
          </div>
        </div>

        <div className="gdpr-section">
          <h2 className="section-title">Contact Information</h2>
          <div className="section-content">
            <p>
              For GDPR-related inquiries about your data on LocalsLocalMarket, please contact the developer:
            </p>
            <div className="gdpr-highlight">
              <h3 className="highlight-title">Developer Contact</h3>
              <p className="highlight-content">
                Email: danrave.keh@localslocalmarket.com<br />
                <br />
                This is a personal project developed by Danrave Keh. You can contact the developer directly 
                with any questions about your data protection rights on our local business marketplace platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GDPR Request Form */}
      <section className="gdpr-request">
        <h2 className="request-title">Submit a GDPR Request</h2>
        <p className="request-description">
          Use this form to exercise your GDPR rights. We'll respond to your request within 30 days.
        </p>
        
        <form className="request-form">
          <div className="form-group">
            <label htmlFor="request-type" className="form-label">Request Type *</label>
            <select id="request-type" className="form-select" required>
              <option value="">Select request type</option>
              <option value="access">Right to Access</option>
              <option value="rectification">Right to Rectification</option>
              <option value="erasure">Right to Erasure</option>
              <option value="restrict">Right to Restrict Processing</option>
              <option value="portability">Right to Data Portability</option>
              <option value="object">Right to Object</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="user-email" className="form-label">Email Address *</label>
            <input
              type="email"
              id="user-email"
              className="form-input"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="request-details" className="form-label">Request Details *</label>
            <textarea
              id="request-details"
              className="form-textarea"
              placeholder="Please provide details about your request..."
              rows="6"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="verification" className="form-label">Identity Verification *</label>
            <input
              type="text"
              id="verification"
              className="form-input"
              placeholder="Please provide information to verify your identity"
              required
            />
          </div>

          <button type="submit" className="submit-request">
            Submit Request
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
      </section>

      {/* Contact Section */}
      <section className="gdpr-contact">
        <h2 className="contact-title">Questions About GDPR?</h2>
        <p className="contact-description">
          The developer is here to help with any questions about your GDPR rights.
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

export default GDPRPage;
