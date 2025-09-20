import React, { useState, useEffect } from 'react';
import { 
  fetchServicesByShopId,
  createService,
  updateService,
  deleteService
} from '../api/services.js'
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
      const data = await fetchServicesByShopId(shopId);
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
      await createService({ ...serviceData, shopId }, localStorage.getItem('token'))
      await loadServices();
      setShowAddService(false);
    } catch (error) {
      console.error('Failed to create service:', error);
      setError('Failed to create service. Please try again.');
    }
  };

  const handleEditService = async (serviceData) => {
    try {
      await updateService(editingService.id, serviceData, localStorage.getItem('token'))
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
      await deleteService(serviceId, localStorage.getItem('token'))
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
