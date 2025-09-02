import React from 'react';
import './ServiceCard.css';

const ServiceCard = ({ service, onViewDetails, isOwner = false, onEdit, onDelete }) => {
  return (
    <div className={`service-card ${service.status === 'NOT_AVAILABLE' ? 'unavailable' : ''}`}>
      <div className="service-header">
        <h3>{service.title}</h3>
        <div className="service-header-right">
          <span className="service-price">₱{service.price}</span>
          <span className={`service-status ${service.status.toLowerCase()}`}>
            {service.status === 'AVAILABLE' ? 'Available' : 'Not Available'}
          </span>
        </div>
      </div>
      <p className="service-description">{service.description}</p>
      <div className="service-meta">
        <span className="category">{service.mainCategory}</span>
        {service.subcategory && (
          <span className="subcategory">• {service.subcategory}</span>
        )}
      </div>
      <div className="service-actions">
        {isOwner ? (
          <>
            <button onClick={() => onEdit(service)} className="edit-btn">Edit</button>
            <button onClick={() => onDelete(service.id)} className="delete-btn">Delete</button>
          </>
        ) : (
          <button 
            onClick={() => onViewDetails(service)} 
            className="view-btn"
            disabled={service.status === 'NOT_AVAILABLE'}
          >
            {service.status === 'AVAILABLE' ? 'View Details' : 'Currently Unavailable'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
