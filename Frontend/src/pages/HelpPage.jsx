import SEOHead from "../components/SEOHead.jsx"
import SocialSharing from "../components/SocialSharing.jsx"
import FAQ from "../components/FAQ.jsx"

export default function HelpPage() {
  return (
    <>
      <SEOHead 
        title="Help & FAQ"
        description="Share LocalsLocalMarket with friends and find answers to frequently asked questions."
      />
      <main className="help-container">
        {/* Hero Section */}
        <section className="help-hero">
          <div className="hero-background">
            <div className="hero-pattern"></div>
          </div>
          <div className="hero-content">
            <div className="hero-header">
              <div className="hero-logo">
                <svg className="hero-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9.09 9C9.3251 8.33167 9.78918 7.76811 10.4 7.40921C11.0108 7.0503 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.30197 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="hero-title">Help & Support</span>
              </div>
              <h1 className="hero-heading">How Can We Help You?</h1>
              <p className="hero-subtitle">
                Find answers to frequently asked questions and learn how to make the most of LocalsLocalMarket
              </p>
            </div>
          </div>
        </section>

        {/* Help Content */}
        <section className="help-content">
          <div className="content-grid">
            {/* Share Section */}
            <div className="share-section">
              <div className="share-card">
                <div className="card-header">
                  <h2 className="card-title">
                    <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Share LocalsLocalMarket
                  </h2>
                  <p className="card-subtitle">
                    Help others discover local businesses in their community
                  </p>
                </div>
                <div className="share-content">
                  <SocialSharing 
                    title="LocalsLocalMarket - Connect with Local Businesses"
                    description="Discover and connect with local businesses in your community. Find products, services, and support local entrepreneurs."
                  />
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="faq-section">
              <div className="faq-card">
                <div className="card-header">
                  <h2 className="card-title">
                    <svg className="card-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M9.09 9C9.3251 8.33167 9.78918 7.76811 10.4 7.40921C11.0108 7.0503 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.30197 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Frequently Asked Questions
                  </h2>
                  <p className="card-subtitle">
                    Find quick answers to common questions about using LocalsLocalMarket
                  </p>
                </div>
                <div className="faq-content">
                  <FAQ />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
