import React, { useState, useEffect } from 'react';
import ServiceCard from './ServiceCard';
import ServiceForm from './ServiceForm';
import Modal from './Modal';
import './ServiceManagement.css';

const ServiceManagement = ({ shopId }) => {
  const [services, setServices] = useState([]);
  const [showAddService, setShowAddService] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadServices();
  }, [shopId]);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/services/shop/${shopId}`);
      if (!response.ok) {
        throw new Error('Failed to load services');
      }
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Failed to load services:', error);
      setError('Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (serviceData) => {
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...serviceData, shopId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create service');
      }
      
      await loadServices();
      setShowAddService(false);
    } catch (error) {
      console.error('Failed to create service:', error);
      setError('Failed to create service. Please try again.');
    }
  };

  const handleEditService = async (serviceData) => {
    try {
      const response = await fetch(`/api/services/${editingService.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(serviceData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update service');
      }
      
      await loadServices();
      setEditingService(null);
    } catch (error) {
      console.error('Failed to update service:', error);
      setError('Failed to update service. Please try again.');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete service');
      }
      
      await loadServices();
    } catch (error) {
      console.error('Failed to delete service:', error);
      setError('Failed to delete service. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="service-management">
        <div className="loading">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="service-management">
      <div className="service-header">
        <h2>Service Management</h2>
        <button onClick={() => setShowAddService(true)} className="add-service-btn">
          Add Service
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="dismiss-error">×</button>
        </div>
      )}
      
      {services.length === 0 ? (
        <div className="no-services">
          <p>No services found. Create your first service to get started!</p>
        </div>
      ) : (
        <div className="services-grid">
          {services.map(service => (
            <ServiceCard 
              key={service.id}
              service={service}
              isOwner={true}
              onEdit={() => setEditingService(service)}
              onDelete={handleDeleteService}
            />
          ))}
        </div>
      )}
      
      {showAddService && (
        <Modal onClose={() => setShowAddService(false)}>
          <ServiceForm 
            onSubmit={handleAddService}
            onCancel={() => setShowAddService(false)}
          />
        </Modal>
      )}
      
      {editingService && (
        <Modal onClose={() => setEditingService(null)}>
          <ServiceForm 
            service={editingService}
            onSubmit={handleEditService}
            onCancel={() => setEditingService(null)}
          />
        </Modal>
      )}
    </div>
  );
};

export default ServiceManagement;
