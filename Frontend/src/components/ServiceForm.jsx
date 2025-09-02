import React, { useState } from 'react';
import CategorySelector from './CategorySelector';
import './ServiceForm.css';

const ServiceForm = ({ service, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: service?.title || '',
    description: service?.description || '',
    price: service?.price || '',
    mainCategory: service?.mainCategory || '',
    subcategory: service?.subcategory || '',
    customCategory: service?.customCategory || '',
    status: service?.status || 'AVAILABLE',
    isActive: service?.isActive ?? true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="service-form">
      <div className="form-group">
        <label htmlFor="title">Service Title *</label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
          placeholder="Enter service title"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows="3"
          placeholder="Describe your service"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="price">Price (₱)</label>
        <input
          type="number"
          id="price"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          step="0.01"
          min="0"
          placeholder="0.00"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}
        >
          <option value="AVAILABLE">Available</option>
          <option value="NOT_AVAILABLE">Not Available</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Category</label>
        <CategorySelector
          value={{
            mainCategory: formData.mainCategory,
            subcategory: formData.subcategory,
            customCategory: formData.customCategory
          }}
          onChange={(categoryData) => {
            setFormData({
              ...formData,
              mainCategory: categoryData.mainCategory || '',
              subcategory: categoryData.subcategory || '',
              customCategory: categoryData.customCategory || ''
            });
          }}
          placeholder="Select service category"
          showSubcategories={true}
          allowCustom={true}
        />
      </div>
      
      <div className="form-actions">
        <button type="submit" className="submit-btn">
          {service ? 'Update Service' : 'Create Service'}
        </button>
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ServiceForm;
