import React from 'react';

const GDPRPage = () => {
  return (
    <main className="gdpr-container">
      {/* Hero Section */}
      <section className="gdpr-hero">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="hero-content">
          <div className="hero-header">
            <div className="hero-logo">
              <svg className="hero-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="hero-title">GDPR Compliance</span>
            </div>
            <h1 className="hero-heading">Data Protection Rights</h1>
            <p className="hero-subtitle">
              Your data protection rights under the General Data Protection Regulation (GDPR).
            </p>
            <div className="hero-meta">
              <span className="last-updated">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* GDPR Content */}
      <section className="gdpr-content">
        <div className="content-wrapper">
          {/* Introduction */}
          <div className="gdpr-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  What is GDPR?
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  The General Data Protection Regulation (GDPR) is a comprehensive data protection law that 
                  came into effect on May 25, 2018. It applies to all organizations operating within the EU 
                  and those that offer goods or services to individuals in the EU, regardless of where the 
                  organization is based.
                </p>
                <p className="content-text">
                  At LocalsLocalMarket, we are committed to protecting your privacy and ensuring compliance 
                  with GDPR requirements. This page explains your rights and how we handle your personal data.
                </p>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="gdpr-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Your GDPR Rights
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  Under GDPR, you have the following rights regarding your personal data:
                </p>
            
                <div className="rights-grid">
                  <div className="right-card">
                    <div className="right-header">
                      <svg className="right-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h3 className="right-title">1. Right to Access</h3>
                    </div>
                    <p className="right-description">
                      You have the right to request access to your personal data and receive information about:
                    </p>
                    <ul className="right-list">
                      <li>What personal data we hold about you</li>
                      <li>How we use your data</li>
                      <li>Who we share your data with</li>
                      <li>How long we keep your data</li>
                    </ul>
                  </div>

                  <div className="right-card">
                    <div className="right-header">
                      <svg className="right-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h3 className="right-title">2. Right to Rectification</h3>
                    </div>
                    <p className="right-description">
                      You have the right to request that we correct any inaccurate or incomplete personal 
                      data we hold about you. You can update most of your information directly through 
                      your account settings.
                    </p>
                  </div>

                  <div className="right-card">
                    <div className="right-header">
                      <svg className="right-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h3 className="right-title">3. Right to Erasure (Right to be Forgotten)</h3>
                    </div>
                    <p className="right-description">
                      You have the right to request that we delete your personal data in certain circumstances, 
                      such as when the data is no longer necessary for the purpose it was collected.
                    </p>
                  </div>

                  <div className="right-card">
                    <div className="right-header">
                      <svg className="right-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h3 className="right-title">4. Right to Restrict Processing</h3>
                    </div>
                    <p className="right-description">
                      You have the right to request that we restrict the processing of your personal data 
                      in certain circumstances, such as when you contest the accuracy of the data.
                    </p>
                  </div>

                  <div className="right-card">
                    <div className="right-header">
                      <svg className="right-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h3 className="right-title">5. Right to Data Portability</h3>
                    </div>
                    <p className="right-description">
                      You have the right to receive your personal data in a structured, commonly used, 
                      and machine-readable format, and to transmit that data to another controller.
                    </p>
                  </div>

                  <div className="right-card">
                    <div className="right-header">
                      <svg className="right-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.29 3.86L1.82 18A2 2 0 0 0 3.61 21H20.4A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h3 className="right-title">6. Right to Object</h3>
                    </div>
                    <p className="right-description">
                      You have the right to object to the processing of your personal data in certain 
                      circumstances, including direct marketing communications.
                    </p>
                  </div>

                  <div className="right-card">
                    <div className="right-header">
                      <svg className="right-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <h3 className="right-title">7. Rights Related to Automated Decision Making</h3>
                    </div>
                    <p className="right-description">
                      You have the right not to be subject to decisions based solely on automated processing, 
                      including profiling, that produce legal effects concerning you.
                    </p>
                  </div>

                  <div className="right-card">
                    <div className="right-header">
                      <svg className="right-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h3 className="right-title">8. Right to Withdraw Consent</h3>
                    </div>
                    <p className="right-description">
                      Where we rely on your consent to process your personal data, you have the right to 
                      withdraw that consent at any time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How to Exercise Your Rights */}
          <div className="gdpr-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 11.08V12A10 10 0 1 1 5.68 3.57" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  How to Exercise Your Rights
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  To exercise any of your GDPR rights, you can:
                </p>
                
                <div className="contact-methods">
                  <div className="method-item">
                    <h3 className="method-title">Contact Us Directly</h3>
                    <p className="method-description">
                      Email us at privacy@localslocalmarket.com with your request. Please include:
                    </p>
                    <ul className="method-list">
                      <li>Your full name and email address</li>
                      <li>The specific right you want to exercise</li>
                      <li>Any relevant details about your request</li>
                    </ul>
                  </div>

                  <div className="method-item">
                    <h3 className="method-title">Account Settings</h3>
                    <p className="method-description">
                      You can update most of your personal information directly through your account settings 
                      in your dashboard.
                    </p>
                  </div>

                  <div className="method-item">
                    <h3 className="method-title">Response Time</h3>
                    <p className="method-description">
                      We will respond to your request within 30 days. If we need more time, we will notify 
                      you and explain why.
                    </p>
                  </div>

                  <div className="method-item">
                    <h3 className="method-title">Verification</h3>
                    <p className="method-description">
                      We may need to verify your identity before processing your request to ensure the 
                      security of your personal data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Processing */}
          <div className="gdpr-section">
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
                  How We Process Your Data
                </h2>
              </div>
              <div className="card-content">
                <div className="processing-info">
                  <div className="info-item">
                    <h3 className="info-title">Legal Basis for Processing</h3>
                    <p className="info-description">
                      We process your personal data based on the following legal grounds:
                    </p>
                    <ul className="info-list">
                      <li><strong>Consent:</strong> When you explicitly agree to the processing</li>
                      <li><strong>Contract:</strong> When processing is necessary to fulfill our contract with you</li>
                      <li><strong>Legitimate Interest:</strong> When processing is necessary for our legitimate business interests</li>
                      <li><strong>Legal Obligation:</strong> When processing is required by law</li>
                    </ul>
                  </div>

                  <div className="info-item">
                    <h3 className="info-title">Data Retention</h3>
                    <p className="info-description">
                      We retain your personal data only for as long as necessary to:
                    </p>
                    <ul className="info-list">
                      <li>Provide our services to you</li>
                      <li>Comply with legal obligations</li>
                      <li>Resolve disputes and enforce agreements</li>
                      <li>Protect against fraud and abuse</li>
                    </ul>
                    <p className="info-description">
                      When we no longer need your data, we will securely delete or anonymize it.
                    </p>
                  </div>

                  <div className="info-item">
                    <h3 className="info-title">Data Transfers</h3>
                    <p className="info-description">
                      Your personal data may be transferred to and processed in countries outside the European 
                      Economic Area (EEA). We ensure that such transfers comply with GDPR requirements and 
                      implement appropriate safeguards, such as Standard Contractual Clauses or adequacy 
                      decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Protection Officer */}
          <div className="gdpr-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Data Protection Officer
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  We have appointed a Data Protection Officer (DPO) to oversee our data protection practices 
                  and ensure GDPR compliance. You can contact our DPO at:
                </p>
                <div className="contact-details">
                  <p><strong>Email:</strong> dpo@localslocalmarket.com</p>
                  <p><strong>Address:</strong> 123 Main Street, Suite 100, New York, NY 10001</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>

          {/* Complaints */}
          <div className="gdpr-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.29 3.86L1.82 18A2 2 0 0 0 3.61 21H20.4A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Lodging a Complaint
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  If you believe that we have not properly addressed your GDPR rights or have concerns 
                  about how we process your personal data, you have the right to lodge a complaint with 
                  your local data protection authority.
                </p>
                <p className="content-text">
                  We encourage you to contact us first to resolve any issues, but you can also contact 
                  your local supervisory authority directly. You can find your local authority at: 
                  <a href="https://edpb.europa.eu/about-edpb/board/members_en" className="external-link">
                    European Data Protection Board
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Updates */}
          <div className="gdpr-section">
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
                  Updates to This Policy
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  We may update this GDPR information from time to time to reflect changes in our practices 
                  or legal requirements. We will notify you of any material changes by:
                </p>
                <ul className="update-list">
                  <li>Posting the updated information on our website</li>
                  <li>Sending email notifications to registered users</li>
                  <li>Updating the "Last updated" date</li>
                </ul>
                <p className="content-text">
                  We encourage you to review this information periodically to stay informed about your 
                  GDPR rights.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="gdpr-section">
            <div className="section-card">
              <div className="card-header">
                <h2 className="card-title">
                  <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Contact Us
                </h2>
              </div>
              <div className="card-content">
                <p className="content-text">
                  If you have any questions about your GDPR rights or our data protection practices, 
                  please contact us:
                </p>
                <div className="contact-details">
                  <p><strong>Email:</strong> privacy@localslocalmarket.com</p>
                  <p><strong>Data Protection Officer:</strong> dpo@localslocalmarket.com</p>
                  <p><strong>Address:</strong> 123 Main Street, Suite 100, New York, NY 10001</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
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

export default GDPRPage;
