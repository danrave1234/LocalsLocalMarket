import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <main className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="hero-content">
          <div className="hero-header">
            <div className="hero-logo">
              <svg className="hero-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span className="hero-title">LocalsLocalMarket</span>
            </div>
            <h1 className="hero-heading">About Our Mission</h1>
            <p className="hero-subtitle">
              Connecting local businesses with their communities through innovative marketplace solutions. 
              Empowering sellers and delighting customers with seamless local commerce experiences.
            </p>
          </div>
          
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="stat-number">500+</div>
              <div className="stat-label">Local Shops</div>
            </div>
            <div className="hero-stat">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="hero-stat">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-section">
        <div className="section-content">
          <div className="mission-grid">
            <div className="mission-content">
              <h2 className="section-title">
                <svg className="section-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Our Mission
              </h2>
              <div className="mission-text">
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
            <div className="mission-card">
              <div className="card-content">
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="card-title">Supporting Local Business</h3>
                <p className="card-description">
                  Every transaction helps keep money in your community and strengthens local economies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-section">
        <div className="section-content">
          <div className="section-header">
            <h2 className="section-title">
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Our Values
            </h2>
            <p className="section-subtitle">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M22 21V19C22 17.9391 21.5786 16.9217 20.8284 16.1716C20.0783 15.4214 19.0609 15 18 15H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 3.13C18.33 3.67 20 5.9 20 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="value-title">Community First</h3>
              <p className="value-description">
                We prioritize the needs of local communities and businesses, ensuring our platform 
                serves as a bridge between neighbors and local entrepreneurs.
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="value-title">Innovation</h3>
              <p className="value-description">
                We continuously develop cutting-edge solutions that make local commerce more 
                accessible, efficient, and enjoyable for everyone involved.
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="value-title">Sustainability</h3>
              <p className="value-description">
                We're committed to building a sustainable ecosystem that supports local economies 
                and reduces environmental impact through local commerce.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-section">
        <div className="section-content">
          <div className="story-grid">
            <div className="story-card">
              <div className="card-content">
                <div className="card-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="card-title">Our Story</h3>
                <p className="card-description">
                  From a small idea to a growing community platform that connects thousands of local businesses.
                </p>
              </div>
            </div>
            
            <div className="story-content">
              <h2 className="section-title">
                <svg className="section-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                How It All Started
              </h2>
              <div className="story-text">
                <p>
                  LocalsLocalMarket was born from a simple observation: local businesses were 
                  struggling to compete in an increasingly digital world, while communities were 
                  losing the personal connections that make local shopping special.
                </p>
                <p>
                  Our founders recognized that technology could be used to strengthen, rather than 
                  replace, these local connections. They set out to create a platform that would 
                  make it easier for local businesses to reach their communities while preserving 
                  the personal touch that makes local commerce unique.
                </p>
                <p>
                  Today, we're proud to serve communities across the country, helping local 
                  businesses thrive and communities stay connected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-section">
        <div className="section-content">
          <div className="section-header">
            <h2 className="section-title">
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M22 21V19C22 17.9391 21.5786 16.9217 20.8284 16.1716C20.0783 15.4214 19.0609 15 18 15H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 3.13C18.33 3.67 20 5.9 20 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Our Team
            </h2>
            <p className="section-subtitle">
              Meet the passionate people behind LocalsLocalMarket
            </p>
          </div>
          
          <div className="team-grid">
            <div className="team-card">
              <div className="team-avatar">
                <div className="avatar-initials">JD</div>
              </div>
              <div className="team-info">
                <h3 className="team-name">John Doe</h3>
                <p className="team-role">CEO & Founder</p>
                <p className="team-description">
                  Passionate about local commerce and community building
                </p>
              </div>
            </div>
            
            <div className="team-card">
              <div className="team-avatar">
                <div className="avatar-initials">JS</div>
              </div>
              <div className="team-info">
                <h3 className="team-name">Jane Smith</h3>
                <p className="team-role">CTO</p>
                <p className="team-description">
                  Technology enthusiast focused on scalable solutions
                </p>
              </div>
            </div>
            
            <div className="team-card">
              <div className="team-avatar">
                <div className="avatar-initials">MJ</div>
              </div>
              <div className="team-info">
                <h3 className="team-name">Mike Johnson</h3>
                <p className="team-role">Head of Business Development</p>
                <p className="team-description">
                  Building partnerships and growing our community
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="cta-background">
          <div className="cta-pattern"></div>
        </div>
        <div className="cta-content">
          <h2 className="cta-title">Join Our Community</h2>
          <p className="cta-description">
            Whether you're a local business owner or a community member, 
            we'd love to have you be part of our growing family.
          </p>
          <div className="cta-actions">
            <Link to="/register" className="cta-btn primary">
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Register Your Shop
            </Link>
            <Link to="/contact" className="cta-btn secondary">
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
