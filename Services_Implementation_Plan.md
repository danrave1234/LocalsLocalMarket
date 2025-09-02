# Services Implementation Plan for LocalsLocalMarket

## 🎯 Overview

This document outlines the plan to add **Services** functionality alongside the existing **Products** system in LocalsLocalMarket. Shops can showcase their available services (e.g., consultations, repairs, installations, etc.) for customers to browse and discover, similar to how products are displayed.

## 📋 Current State Analysis

### Existing Product System
- **Model**: `Product.java` with fields like title, description, price, stockCount, categories
- **API**: RESTful endpoints for CRUD operations
- **Frontend**: Product management, display, and search functionality
- **Categories**: Hierarchical category system (main/sub/custom)

### What We Need to Add
- **Services Model**: New entity for service offerings
- **Service Categories**: Specialized categories for services
- **Service Management**: CRUD operations for services
- **Service Display**: Frontend components for service listings
- **Service Integration**: Add services to existing shop pages

## 🏗️ Backend Implementation Plan

### 1. Database Schema Design

#### New Table Required:
```sql
-- Services table
CREATE TABLE services (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    shop_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    duration_minutes INT, -- Service duration (optional)
    main_category VARCHAR(100),
    subcategory VARCHAR(100),
    custom_category VARCHAR(100),
    status ENUM('AVAILABLE', 'NOT_AVAILABLE') DEFAULT 'AVAILABLE',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shops(id)
);

-- Indexes for performance
CREATE INDEX idx_services_shop_id ON services(shop_id);
CREATE INDEX idx_services_category ON services(main_category);
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_services_active ON services(is_active);
```

### 2. Java Models

#### Service.java
```java
@Entity
@Table(name = "services")
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "shop_id")
    private Shop shop;
    
    private String title;
    private String description;
    private BigDecimal price;
    private Integer durationMinutes; // Optional
    private String mainCategory;
    private String subcategory;
    private String customCategory;
    
    @Enumerated(EnumType.STRING)
    private ServiceStatus status;
    
    private Boolean isActive;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters and setters
}

// Service Status Enum
public enum ServiceStatus {
    AVAILABLE,
    NOT_AVAILABLE
}
```

### 3. Repository Layer

#### ServiceRepository.java
```java
@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByShopIdAndIsActiveTrue(Long shopId);
    List<Service> findByShopIdAndStatusAndIsActiveTrue(Long shopId, ServiceStatus status);
    List<Service> findByMainCategoryAndIsActiveTrue(String mainCategory);
    List<Service> findByMainCategoryAndStatusAndIsActiveTrue(String mainCategory, ServiceStatus status);
    List<Service> findByShopIdAndMainCategoryAndIsActiveTrue(Long shopId, String mainCategory);
    List<Service> findByShopIdAndMainCategoryAndStatusAndIsActiveTrue(Long shopId, String mainCategory, ServiceStatus status);
    Page<Service> findByIsActiveTrue(Pageable pageable);
    Page<Service> findByStatusAndIsActiveTrue(ServiceStatus status, Pageable pageable);
    List<Service> findByTitleContainingIgnoreCaseAndIsActiveTrue(String title);
    List<Service> findByShopIdAndTitleContainingIgnoreCaseAndIsActiveTrue(Long shopId, String title);
}
```

### 4. Service Layer

#### ServiceService.java
```java
@Service
public class ServiceService {
    
    @Autowired
    private ServiceRepository serviceRepository;
    
    public List<Service> getServicesByShop(Long shopId) {
        return serviceRepository.findByShopIdAndIsActiveTrue(shopId);
    }
    
    public List<Service> getServicesByShopAndStatus(Long shopId, ServiceStatus status) {
        return serviceRepository.findByShopIdAndStatusAndIsActiveTrue(shopId, status);
    }
    
    public List<Service> getServicesByCategory(String category) {
        return serviceRepository.findByMainCategoryAndIsActiveTrue(category);
    }
    
    public List<Service> getServicesByCategoryAndStatus(String category, ServiceStatus status) {
        return serviceRepository.findByMainCategoryAndStatusAndIsActiveTrue(category, status);
    }
    
    public Service createService(Service service) {
        return serviceRepository.save(service);
    }
    
    public Service updateService(Long id, Service serviceDetails) {
        Service service = serviceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Service not found"));
        
        service.setTitle(serviceDetails.getTitle());
        service.setDescription(serviceDetails.getDescription());
        service.setPrice(serviceDetails.getPrice());
        service.setDurationMinutes(serviceDetails.getDurationMinutes());
        service.setMainCategory(serviceDetails.getMainCategory());
        service.setSubcategory(serviceDetails.getSubcategory());
        service.setCustomCategory(serviceDetails.getCustomCategory());
        service.setStatus(serviceDetails.getStatus());
        service.setIsActive(serviceDetails.getIsActive());
        
        return serviceRepository.save(service);
    }
    
    public void deleteService(Long id) {
        Service service = serviceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Service not found"));
        service.setIsActive(false);
        serviceRepository.save(service);
    }
    
    public Service getServiceById(Long id) {
        return serviceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Service not found"));
    }
}
```

### 5. Controller Layer

#### ServiceController.java
```java
@RestController
@RequestMapping("/api/services")
public class ServiceController {
    
    @Autowired
    private ServiceService serviceService;
    
    @GetMapping
    public ResponseEntity<List<Service>> getAllServices(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        
        List<Service> services;
        if (category != null && status != null) {
            ServiceStatus serviceStatus = ServiceStatus.valueOf(status.toUpperCase());
            services = serviceService.getServicesByCategoryAndStatus(category, serviceStatus);
        } else if (category != null) {
            services = serviceService.getServicesByCategory(category);
        } else if (status != null) {
            ServiceStatus serviceStatus = ServiceStatus.valueOf(status.toUpperCase());
            services = serviceService.getServicesByStatus(serviceStatus);
        } else {
            services = serviceService.getAllServices();
        }
        
        return ResponseEntity.ok(services);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable Long id) {
        Service service = serviceService.getServiceById(id);
        return ResponseEntity.ok(service);
    }
    
    @GetMapping("/shop/{shopId}")
    public ResponseEntity<List<Service>> getServicesByShop(
            @PathVariable Long shopId,
            @RequestParam(required = false) String status) {
        
        List<Service> services;
        if (status != null) {
            ServiceStatus serviceStatus = ServiceStatus.valueOf(status.toUpperCase());
            services = serviceService.getServicesByShopAndStatus(shopId, serviceStatus);
        } else {
            services = serviceService.getServicesByShop(shopId);
        }
        
        return ResponseEntity.ok(services);
    }
    
    @PostMapping
    public ResponseEntity<Service> createService(@RequestBody Service service, 
                                                @RequestHeader("Authorization") String token) {
        // Validate shop ownership
        Service createdService = serviceService.createService(service);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdService);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Service> updateService(@PathVariable Long id, 
                                               @RequestBody Service serviceDetails,
                                               @RequestHeader("Authorization") String token) {
        // Validate shop ownership
        Service updatedService = serviceService.updateService(id, serviceDetails);
        return ResponseEntity.ok(updatedService);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id,
                                         @RequestHeader("Authorization") String token) {
        // Validate shop ownership
        serviceService.deleteService(id);
        return ResponseEntity.ok().build();
    }
}
```

## 🎨 Frontend Implementation Plan

### 1. New Components

#### ServiceCard.jsx
```jsx
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
        {service.durationMinutes && (
          <span className="duration">⏱️ {service.durationMinutes} min</span>
        )}
        <span className="category">{service.mainCategory}</span>
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
```

#### ServiceForm.jsx
```jsx
const ServiceForm = ({ service, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: service?.title || '',
    description: service?.description || '',
    price: service?.price || '',
    durationMinutes: service?.durationMinutes || '',
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
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows="3"
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">Price (₱)</label>
          <input
            type="number"
            id="price"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            step="0.01"
            min="0"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="durationMinutes">Duration (minutes)</label>
          <input
            type="number"
            id="durationMinutes"
            value={formData.durationMinutes}
            onChange={(e) => setFormData({...formData, durationMinutes: e.target.value})}
            min="0"
          />
        </div>
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
```

#### ServiceManagement.jsx
```jsx
const ServiceManagement = ({ shopId }) => {
  const [services, setServices] = useState([]);
  const [showAddService, setShowAddService] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, [shopId]);

  const loadServices = async () => {
    try {
      const response = await fetch(`/api/services/shop/${shopId}`);
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Failed to load services:', error);
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
      
      if (response.ok) {
        await loadServices();
        setShowAddService(false);
      }
    } catch (error) {
      console.error('Failed to create service:', error);
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
      
      if (response.ok) {
        await loadServices();
        setEditingService(null);
      }
    } catch (error) {
      console.error('Failed to update service:', error);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const response = await fetch(`/api/services/${serviceId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          await loadServices();
        }
      } catch (error) {
        console.error('Failed to delete service:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading services...</div>;
  }

  return (
    <div className="service-management">
      <div className="service-header">
        <h2>Service Management</h2>
        <button onClick={() => setShowAddService(true)} className="add-service-btn">
          Add Service
        </button>
      </div>
      
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
```

### 2. Updated Existing Components

#### ShopPage.jsx
- Add services tab alongside products tab
- Service listing with ServiceCard components
- Service filtering and search (reuse existing search logic)

#### DashboardPage.jsx
- Add services management section
- Quick stats for services (count, categories)
- Quick actions for service management

#### CategorySelector.jsx
- Extend to support service categories
- Add service-specific category options

### 3. New Pages

#### ServiceDetailsPage.jsx
```jsx
const ServiceDetailsPage = ({ serviceId }) => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadService();
  }, [serviceId]);

  const loadService = async () => {
    try {
      const response = await fetch(`/api/services/${serviceId}`);
      const data = await response.json();
      setService(data);
    } catch (error) {
      console.error('Failed to load service:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading service details...</div>;
  }

  if (!service) {
    return <div className="error">Service not found</div>;
  }

  return (
    <div className="service-details">
      <div className="service-info">
        <div className="service-header">
          <h1>{service.title}</h1>
          <div className="service-header-right">
            <p className="price">₱{service.price}</p>
            <span className={`service-status ${service.status.toLowerCase()}`}>
              {service.status === 'AVAILABLE' ? 'Available' : 'Not Available'}
            </span>
          </div>
        </div>
        <p className="description">{service.description}</p>
        <div className="service-meta">
          {service.durationMinutes && (
            <span>Duration: {service.durationMinutes} minutes</span>
          )}
          <span>Category: {service.mainCategory}</span>
          {service.subcategory && (
            <span>Subcategory: {service.subcategory}</span>
          )}
        </div>
      </div>
      
      <div className="shop-info">
        <h3>Offered by: {service.shop.name}</h3>
        <p>{service.shop.description}</p>
        <Link to={`/shop/${service.shop.id}`} className="view-shop-btn">
          View Shop
        </Link>
      </div>
      
      {service.status === 'NOT_AVAILABLE' && (
        <div className="unavailable-notice">
          <p>⚠️ This service is currently not available. Please check back later or contact the shop for more information.</p>
        </div>
      )}
    </div>
  );
};
```

## 🎯 Service Categories

### Predefined Service Categories:
1. **Professional Services**
   - Legal Services
   - Accounting & Tax
   - Consulting
   - Design Services

2. **Health & Wellness**
   - Medical Consultations
   - Massage Therapy
   - Fitness Training
   - Mental Health Services

3. **Home Services**
   - Cleaning Services
   - Repairs & Maintenance
   - Installation Services
   - Pest Control

4. **Beauty & Personal Care**
   - Hair Styling
   - Nail Services
   - Makeup Services
   - Spa Treatments

5. **Education & Training**
   - Tutoring
   - Language Classes
   - Skill Training
   - Workshops

6. **Technology Services**
   - IT Support
   - Software Development
   - Digital Marketing
   - Web Design

## 🔧 Technical Implementation Details

### 1. API Endpoints

#### Services
```
GET    /api/services                    # List all services
GET    /api/services?status=available   # List available services only
GET    /api/services?status=not_available # List unavailable services only
GET    /api/services/{id}               # Get service details
GET    /api/services/shop/{shopId}     # Get shop services
GET    /api/services/shop/{shopId}?status=available # Get available shop services
GET    /api/services/category/{category} # Get services by category
POST   /api/services                   # Create service
PUT    /api/services/{id}              # Update service
DELETE /api/services/{id}              # Delete service
```

### 2. Database Migration

#### Migration: Create Services Table
```sql
CREATE TABLE services (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    shop_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    duration_minutes INT,
    main_category VARCHAR(100),
    subcategory VARCHAR(100),
    custom_category VARCHAR(100),
    status ENUM('AVAILABLE', 'NOT_AVAILABLE') DEFAULT 'AVAILABLE',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shops(id)
);

CREATE INDEX idx_services_shop_id ON services(shop_id);
CREATE INDEX idx_services_category ON services(main_category);
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_services_active ON services(is_active);
```

### 3. Security Considerations

- **Authentication**: All service management requires shop owner authentication
- **Authorization**: Users can only manage their own services
- **Input Validation**: Comprehensive validation for all service data
- **Data Privacy**: Secure handling of service information

### 4. Performance Optimizations

- **Caching**: Cache service listings
- **Pagination**: Implement pagination for large service lists
- **Indexing**: Proper database indexing for fast queries
- **Lazy Loading**: Load service details on demand

## 🎨 UI/UX Design Considerations

### 1. Visual Design
- **Service Cards**: Clean, informative cards similar to product cards
- **Consistent Styling**: Match existing product card design
- **Category Indicators**: Clear visual category identification
- **Price Display**: Prominent price display

### 2. User Experience
- **Mobile-First**: Responsive design for mobile browsing
- **Progressive Disclosure**: Show essential info first, details on demand
- **Error Handling**: Clear error messages and recovery options
- **Loading States**: Proper loading indicators throughout

### 3. Accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG compliant color schemes
- **Focus Management**: Proper focus handling in modals

## 📊 Analytics & Monitoring

### 1. Key Metrics to Track
- Service creation rates
- Popular service categories
- Service view rates
- Shop engagement with services

### 2. Monitoring
- API response times
- Error rates and types
- Database query performance
- User engagement metrics

## 🚀 Implementation Phases

### Phase 1: Core Backend (Week 1)
- [ ] Database schema design and migration
- [ ] Service model and repository
- [ ] Service service layer
- [ ] Basic CRUD API endpoints

### Phase 2: Basic Frontend (Week 2)
- [ ] Service management components
- [ ] Service listing and display
- [ ] Service form for creation/editing
- [ ] Integration with existing shop pages

### Phase 3: Polish & Testing (Week 3)
- [ ] UI/UX refinements
- [ ] Service categories integration
- [ ] Performance optimizations
- [ ] Comprehensive testing

## 🧪 Testing Strategy

### 1. Unit Tests
- Service model validation
- API endpoint functionality
- Service business logic

### 2. Integration Tests
- Service creation and management flow
- Service display and filtering
- Shop integration

### 3. End-to-End Tests
- Complete service management workflow
- Service browsing experience
- User experience scenarios

## 📚 Documentation

### 1. API Documentation
- Complete API reference
- Request/response examples
- Error codes and handling

### 2. User Guides
- Shop owner service management guide
- Customer service browsing guide

### 3. Technical Documentation
- Database schema documentation
- Component architecture
- Deployment and configuration

## 🎯 Success Metrics

### 1. Business Metrics
- 15% increase in shop engagement
- 10% increase in average session duration
- 25% increase in shop discovery

### 2. Technical Metrics
- < 200ms API response times
- < 1% error rate
- 99.9% uptime

### 3. User Experience Metrics
- > 80% service view completion rate
- < 3 clicks to view service details
- > 4/5 average user satisfaction

## 🔮 Future Enhancements

### 1. Advanced Features
- Service images/gallery
- Service packages/bundles
- Service recommendations
- Service search and filtering

### 2. Integration Opportunities
- Service reviews and ratings
- Service availability indicators
- Service pricing tiers
- Service comparison tools

### 3. AI/ML Features
- Service recommendations
- Popular service suggestions
- Service category optimization
- Service description enhancement

---

This simplified implementation plan focuses on **displaying services** without any booking functionality. The approach is much more straightforward and can be implemented quickly while providing significant value to both shops and customers.
