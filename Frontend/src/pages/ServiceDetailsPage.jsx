import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sanitizeText } from '../utils/sanitize.js'
import { generateShopSlug } from '../utils/slugUtils.js';
import { fetchServiceById } from '../api/services.js'
import SEOHead from '../components/SEOHead.jsx'
import './ServiceDetailsPage.css';

const ServiceDetailsPage = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadService();
  }, [serviceId]);

  const loadService = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchServiceById(serviceId);
      setService(data);
    } catch (error) {
      console.error('Failed to load service:', error);
      setError('Failed to load service details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="service-details-page">
        <div className="loading">Loading service details...</div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="service-details-page">
        <div className="error">
          <h2>Service Not Found</h2>
          <p>{error || 'The service you are looking for does not exist.'}</p>
          <Link to="/" className="back-home-btn">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={sanitizeText(service.title)}
        description={sanitizeText(service.description?.slice(0, 150) || 'Service details')}
        url={`https://localslocalmarket.com/services/${service.id}`}
        image={service.imageUrl || undefined}
        type="product"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": sanitizeText(service.title),
          "description": sanitizeText(service.description),
          "image": service.imageUrl || undefined,
          "offers": {
            "@type": "Offer",
            "price": service.price,
            "priceCurrency": "PHP",
            "availability": service.status === 'AVAILABLE' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
          }
        }}
      />
    <div className="service-details-page">
      <div className="service-details">
        <div className="service-info">
          <div className="service-header">
            <h1>{sanitizeText(service.title)}</h1>
            <div className="service-header-right">
              <p className="price">₱{service.price}</p>
              <span className={`service-status ${service.status.toLowerCase()}`}>
                {service.status === 'AVAILABLE' ? 'Available' : 'Not Available'}
              </span>
            </div>
          </div>
          
          <p className="description">{sanitizeText(service.description)}</p>
          
          <div className="service-meta">
            <div className="meta-item">
              <span className="meta-label">Category:</span>
              <span className="meta-value">{service.mainCategory}</span>
            </div>
            {service.subcategory && (
              <div className="meta-item">
                <span className="meta-label">Subcategory:</span>
                <span className="meta-value">{service.subcategory}</span>
              </div>
            )}
            {service.customCategory && (
              <div className="meta-item">
                <span className="meta-label">Custom Category:</span>
                <span className="meta-value">{service.customCategory}</span>
              </div>
            )}
          </div>
        </div>
        
        {service.shop && (
          <div className="shop-info">
            <h3>Offered by: {sanitizeText(service.shop.name)}</h3>
            <p>{sanitizeText(service.shop.description)}</p>
            <Link to={`/shops/${generateShopSlug(service.shop.name, service.shop.id)}`} className="view-shop-btn">
              View Shop
            </Link>
          </div>
        )}
        
        {service.status === 'NOT_AVAILABLE' && (
          <div className="unavailable-notice">
            <p>⚠️ This service is currently not available. Please check back later or contact the shop for more information.</p>
          </div>
        )}
        
        <div className="service-actions">
          <Link to="/" className="back-btn">← Back to Browse</Link>
          {service.shop && (
            <Link to={`/shops/${generateShopSlug(service.shop.name, service.shop.id)}`} className="browse-shop-btn">
              Browse More from This Shop
            </Link>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default ServiceDetailsPage;
