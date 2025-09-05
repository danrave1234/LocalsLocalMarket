import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead.jsx';
import '../about-us.css';
import { User, Code, Palette } from 'lucide-react';

const AboutPage = () => {
  return (
    <>
      <SEOHead 
        title="About Us - LocalsLocalMarket"
        description="Learn about LocalsLocalMarket's mission to connect local businesses with their communities. Discover how we're empowering local commerce and building stronger communities through innovative marketplace solutions."
        keywords="about us, local business platform, community marketplace, local commerce, supporting local businesses, marketplace mission, local economy"
        url="https://localslocalmarket.com/about"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About LocalsLocalMarket",
          "description": "Learn about LocalsLocalMarket's mission to connect local businesses with their communities",
          "url": "https://localslocalmarket.com/about",
          "mainEntity": {
            "@type": "Organization",
            "name": "LocalsLocalMarket",
            "description": "A platform connecting local businesses with customers in the community",
            "url": "https://localslocalmarket.com",
            "foundingDate": "2024",
            "mission": "To create a vibrant digital marketplace that strengthens the connection between local businesses and their communities"
          }
        }}
      />
      <main className="about-us-container">
      {/* Hero Section */}
      <section className="about-us-header">
        <h1 className="about-us-title">About Our Mission</h1>
        <p className="about-us-subtitle">
          Connecting local businesses with their communities through innovative marketplace solutions. 
          Empowering sellers and delighting customers with seamless local commerce experiences.
        </p>
      </section>

      {/* Mission Section */}
      <section className="about-us-content">
        <div className="about-us-section about-us-mission">
          <h2 className="about-us-section-title">Our Mission</h2>
          <div className="about-us-section-content">
            <p>
              At LocalsLocalMarket, we believe in the power of local commerce. Our mission is to 
              create a vibrant digital marketplace that strengthens the connection between local 
              businesses and their communities.
            </p>
            <p>
              We provide innovative tools and platforms that help small businesses thrive in the 
              digital age while maintaining the personal touch that makes local shopping special.
            </p>
            <p>
              By fostering these connections, we're not just building a marketplace—we're building 
              stronger, more resilient communities.
            </p>
          </div>
        </div>

        <div className="about-us-section">
          <h2 className="about-us-section-title">Supporting Local Business</h2>
          <div className="about-us-section-content">
            <p>
              Every transaction helps keep money in your community and strengthens local economies.
              We're committed to providing the tools and support that local businesses need to succeed.
            </p>
          </div>
        </div>

        <div className="about-us-section">
          <h2 className="about-us-section-title">Our Values</h2>
          <div className="about-us-section-content">
            <p>
              We believe in transparency, community, and innovation. Our platform is built on these 
              core values, ensuring that every interaction benefits both businesses and customers.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-us-team">
        <h2 className="about-us-section-title">Our Team</h2>
        <div className="team-member">
          <div className="team-member-avatar"><Code size={32} /></div>
          <h3 className="team-member-name">Danrave Keh</h3>
          <p className="team-member-role">Founder & Developer</p>
          <p className="team-member-bio">
            The sole developer behind LocalsLocalMarket, passionate about connecting local businesses 
            with their communities through innovative technology solutions. Building the entire platform 
            from frontend to backend with a focus on user experience and community impact.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-us-stats">
        <div className="stat-item">
          <div className="stat-number">500+</div>
          <div className="stat-label">Local Shops</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">10K+</div>
          <div className="stat-label">Happy Customers</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">24/7</div>
          <div className="stat-label">Support</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">99.9%</div>
          <div className="stat-label">Uptime</div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-us-cta">
        <h2 className="cta-title">Join Our Community</h2>
        <p className="cta-description">
          Ready to be part of the local commerce revolution? Start your journey with us today.
        </p>
        <Link to="/register" className="cta-button">
          Get Started
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </section>
      </main>
    </>
  );
};

export default AboutPage;
