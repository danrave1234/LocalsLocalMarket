import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Package, 
  Wrench, 
  Search, 
  Filter, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Settings,
  BarChart3,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import Modal from '../components/Modal.jsx'
import ItemCard from '../components/ItemCard.jsx'
import ItemForm from '../components/ItemForm.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import { useTutorial } from '../contexts/TutorialContext.jsx'
import { shopManagementTutorialSteps } from '../components/TutorialSteps.js'
import { extractShopIdFromSlug } from '../utils/slugUtils.js'
import { 
  fetchProductsByShopId, 
  fetchProductsByShopIdPaginated,
  createProduct, 
  updateProduct, 
  deleteProduct,
  updateProductStock
} from '../api/products.js'
import { 
  fetchServicesByShopId, 
  fetchServicesByShopIdLegacy,
  createService, 
  updateService, 
  deleteService 
} from '../api/services.js'
import { uploadImage } from '../api/products.js'
import { getImageUrl } from '../utils/imageUtils.js'
import { SkeletonShopManagement } from '../components/Skeleton.jsx'
import './ShopManagementPage.css'

export default function ShopManagementPage() {
  const { shopId: shopSlug } = useParams()
  const navigate = useNavigate()
  const { token, user } = useAuth()
  const { setTutorialSteps } = useTutorial()
  
  // Extract shop ID from slug
  const shopId = extractShopIdFromSlug(shopSlug)
  
  // State management
  const [activeTab, setActiveTab] = useState('products') // 'products' or 'services'
  const [products, setProducts] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [totalItems, setTotalItems] = useState(0)
  
  // Stock management
  const [savingStock, setSavingStock] = useState({})

  // Load data when component mounts or dependencies change
  useEffect(() => {
    // Set tutorial steps for shop management
    setTutorialSteps(shopManagementTutorialSteps)
    
    if (shopId && token) {
      loadData()
    } else if (!shopId) {
      setError('Invalid shop URL')
      setLoading(false)
    } else if (!token) {
      setError('Authentication required')
      setLoading(false)
    }
  }, [shopId, token, shopSlug, setTutorialSteps])


  // Update items per page based on screen size
  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth
      if (width < 640) { // Mobile
        setItemsPerPage(8)
      } else if (width < 1024) { // Tablet
        setItemsPerPage(12)
      } else if (width < 1440) { // Laptop
        setItemsPerPage(16)
      } else { // Big monitor
        setItemsPerPage(20)
      }
    }

    updateItemsPerPage()
    window.addEventListener('resize', updateItemsPerPage)
    return () => window.removeEventListener('resize', updateItemsPerPage)
  }, [])

  // Load data function
  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      // Basic mobile detection
      const isMobile = typeof window !== 'undefined' && (
        window.navigator.userAgent.includes('Mobile') ||
        window.navigator.userAgent.includes('Android') ||
        window.navigator.userAgent.includes('iPhone')
      )

      // PRODUCTS: try paginated, fallback to non-paginated shape
      let productsData = []
      try {
        const productsResponse = await fetchProductsByShopIdPaginated(shopId, 0, 100)
        if (productsResponse && productsResponse.content) {
          productsData = productsResponse.content
        } else if (Array.isArray(productsResponse)) {
          productsData = productsResponse
        }
      } catch (prodErr) {
        console.error('ShopManagement: Failed to load products:', prodErr)
        if (!isMobile) {
          throw prodErr
        }
      }

      // SERVICES: try paginated, fallback to legacy; on mobile, do not fail page
      let servicesData = []
      try {
        const servicesResponse = await fetchServicesByShopId(shopId, { page: 0, size: 100 })
        if (servicesResponse && servicesResponse.content) {
          servicesData = servicesResponse.content
        } else if (Array.isArray(servicesResponse)) {
          servicesData = servicesResponse
        } else {
          // fallback to legacy
          try {
            const legacy = await fetchServicesByShopIdLegacy(shopId)
            servicesData = Array.isArray(legacy) ? legacy : []
          } catch (legacyErr) {
            console.error('ShopManagement: Legacy services API failed:', legacyErr)
            if (!isMobile) {
              throw legacyErr
            }
          }
        }
      } catch (svcErr) {
        console.error('ShopManagement: Services fetch failed:', svcErr)
        // On mobile, continue without services
        if (!isMobile) {
          throw svcErr
        }
      }

      setProducts(productsData)
      setServices(servicesData)
      setTotalItems((productsData?.length || 0) + (servicesData?.length || 0))
    } catch (error) {
      console.error('Failed to load data:', error)
      setError('Failed to load shop data: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Get current items based on active tab
  const getCurrentItems = () => {
    return activeTab === 'products' ? products : services
  }

  // Filter and sort items
  const getFilteredAndSortedItems = useCallback(() => {
    let items = [...getCurrentItems()]
    
    // Apply search filter
    if (searchQuery.trim()) {
      items = items.filter(item => 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mainCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subcategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customCategory?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      items = items.filter(item => 
        item.mainCategory === categoryFilter ||
        item.subcategory === categoryFilter ||
        item.customCategory === categoryFilter
      )
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      if (activeTab === 'products') {
        items = items.filter(item => {
          if (statusFilter === 'in-stock') return item.stockCount > 0
          if (statusFilter === 'out-of-stock') return item.stockCount <= 0
          return true
        })
      } else {
        items = items.filter(item => item.status === statusFilter.toUpperCase())
      }
    }
    
    // Apply sorting
    items.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt)
        case 'oldest':
          return new Date(a.createdAt || a.updatedAt) - new Date(b.createdAt || b.updatedAt)
        case 'name-asc':
          return (a.title || '').localeCompare(b.title || '')
        case 'name-desc':
          return (b.title || '').localeCompare(a.title || '')
        case 'price-asc':
          return (a.price || 0) - (b.price || 0)
        case 'price-desc':
          return (b.price || 0) - (a.price || 0)
        default:
          return 0
      }
    })
    
    return items
  }, [getCurrentItems, searchQuery, categoryFilter, statusFilter, sortBy, activeTab])

  // Get paginated items
  const getPaginatedItems = () => {
    const filteredItems = getFilteredAndSortedItems()
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredItems.slice(startIndex, endIndex)
  }

  // Get unique categories from current items
  const getUniqueCategories = () => {
    const items = getCurrentItems()
    const categories = new Set()
    items.forEach(item => {
      if (item.mainCategory) categories.add(item.mainCategory)
      if (item.subcategory) categories.add(item.subcategory)
      if (item.customCategory) categories.add(item.customCategory)
    })
    return Array.from(categories).sort()
  }

  // Handle item creation
  const handleCreateItem = async (itemData) => {
    try {
      setModalLoading(true)
      
      if (activeTab === 'products') {
        const productData = {
          ...itemData,
          shopId: shopId
        }
        const newProduct = await createProduct(productData, token)
        setProducts(prev => [...prev, newProduct])
      } else {
        const serviceData = {
          ...itemData,
          shopId: shopId
        }
        const newService = await createService(serviceData, token)
        setServices(prev => [...prev, newService])
      }
      
      setShowAddModal(false)
      setTotalItems(prev => prev + 1)
    } catch (error) {
      console.error('Failed to create item:', error)
      setError('Failed to create item: ' + error.message)
    } finally {
      setModalLoading(false)
    }
  }

  // Handle item update
  const handleUpdateItem = async (itemData) => {
    try {
      setModalLoading(true)
      
      if (activeTab === 'products') {
        const updatedProduct = await updateProduct(editingItem.id, itemData, token)
        setProducts(prev => prev.map(p => p.id === editingItem.id ? updatedProduct : p))
      } else {
        const updatedService = await updateService(editingItem.id, itemData, token)
        setServices(prev => prev.map(s => s.id === editingItem.id ? updatedService : s))
      }
      
      setShowEditModal(false)
      setEditingItem(null)
    } catch (error) {
      console.error('Failed to update item:', error)
      setError('Failed to update item: ' + error.message)
    } finally {
      setModalLoading(false)
    }
  }

  // Handle item deletion
  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return
    }
    
    try {
      if (activeTab === 'products') {
        await deleteProduct(itemId, token)
        setProducts(prev => prev.filter(p => p.id !== itemId))
      } else {
        await deleteService(itemId, token)
        setServices(prev => prev.filter(s => s.id !== itemId))
      }
      
      setTotalItems(prev => prev - 1)
    } catch (error) {
      console.error('Failed to delete item:', error)
      setError('Failed to delete item: ' + error.message)
    }
  }

  // Handle stock update
  const handleUpdateStock = async (itemId, newStock) => {
    try {
      setSavingStock(prev => ({ ...prev, [itemId]: true }))
      const updatedProduct = await updateProductStock(itemId, newStock, token)
      setProducts(prev => prev.map(p => p.id === itemId ? updatedProduct : p))
    } catch (error) {
      console.error('Failed to update stock:', error)
      setError('Failed to update stock: ' + error.message)
    } finally {
      setSavingStock(prev => ({ ...prev, [itemId]: false }))
    }
  }

  // Handle image update from ItemForm
  const handleImageUpdate = (itemId, type, imageData) => {
    if (type === 'product') {
      setProducts(prev => prev.map(p => 
        p.id === itemId 
          ? { ...p, imagePathsJson: imageData.imagePathsJson, imageUrl: imageData.imageUrl }
          : p
      ))
    } else if (type === 'service') {
      setServices(prev => prev.map(s => 
        s.id === itemId 
          ? { ...s, imageUrl: imageData.imageUrl }
          : s
      ))
    }
  }

  // Handle edit item
  const handleEditItem = (item) => {
    setEditingItem(item)
    setShowEditModal(true)
  }

  // Handle view item details
  const handleViewItemDetails = (item) => {
    // Navigate to item details page or show details modal
    console.log('View item details:', item)
  }

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, categoryFilter, statusFilter, sortBy, activeTab])

  // Calculate pagination info
  const filteredItems = getFilteredAndSortedItems()
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const paginatedItems = getPaginatedItems()

  if (loading) {
    return <SkeletonShopManagement />
  }

  if (error) {
    return (
      <div className="shop-management-page">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={loadData} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="shop-management-page">
      {/* Main Container */}
      <div className="management-container">
        {/* Header Section */}
        <div className="management-header" data-tutorial="management-header">
          <div className="header-info">
            <h1>Manage Shop</h1>
            <p className="header-description">
              Organize and manage your products and services
            </p>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-outline"
              onClick={() => navigate(`/shops/${shopSlug}`)}
            >
              <Eye size={16} />
              View Shop
            </button>
            <button 
              className="btn btn-primary"
              data-tutorial="add-item-btn"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} />
              Add {activeTab === 'products' ? 'Product' : 'Service'}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation" data-tutorial="tab-navigation">
          <div className="tab-list">
            <button
              className={`tab-item ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <Package size={18} />
              <span>Products</span>
              <span className="tab-count">{products.length}</span>
            </button>
            <button
              className={`tab-item ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => setActiveTab('services')}
            >
              <Wrench size={18} />
              <span>Services</span>
              <span className="tab-count">{services.length}</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="search-filters-section" data-tutorial="search-filters">
          <div className="search-container">
            <div className="search-input-wrapper">
              <Search size={18} />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="filters-container">
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                {getUniqueCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                {activeTab === 'products' ? (
                  <>
                    <option value="in-stock">In Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </>
                ) : (
                  <>
                    <option value="available">Available</option>
                    <option value="not_available">Not Available</option>
                  </>
                )}
              </select>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-asc">Price Low-High</option>
                <option value="price-desc">Price High-Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="content-section">
          {filteredItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-content">
                <div className="empty-icon">
                  {activeTab === 'products' ? <Package size={64} /> : <Wrench size={64} />}
                </div>
                <h3>No {activeTab} found</h3>
                <p className="empty-description">
                  {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all' 
                    ? 'Try adjusting your filters to see more results.'
                    : `You haven't added any ${activeTab} yet. Start by adding your first ${activeTab.slice(0, -1)}.`
                  }
                </p>
                {!searchQuery && categoryFilter === 'all' && statusFilter === 'all' && (
                  <button 
                    className="btn btn-primary btn-large"
                    onClick={() => setShowAddModal(true)}
                  >
                    <Plus size={20} />
                    Add Your First {activeTab === 'products' ? 'Product' : 'Service'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="items-header">
                <div className="items-count">
                  <h3>{activeTab === 'products' ? 'Products' : 'Services'}</h3>
                  <span className="count-badge">
                    {filteredItems.length} of {getCurrentItems().length}
                  </span>
                </div>
              </div>

              <div className="items-grid" data-tutorial="item-cards">
                {paginatedItems.map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    type={activeTab.slice(0, -1)} // Remove 's' from 'products'/'services'
                    isOwner={true}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                    onViewDetails={handleViewItemDetails}
                    onUpdateStock={activeTab === 'products' ? handleUpdateStock : undefined}
                    savingStock={savingStock[item.id] || false}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  
                  <div className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </div>
                  
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      <Modal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={`Add ${activeTab === 'products' ? 'Product' : 'Service'}`}
        size="large"
      >
        <ItemForm
          type={activeTab.slice(0, -1)}
          onSubmit={handleCreateItem}
          onCancel={() => setShowAddModal(false)}
          onImageUpdate={handleImageUpdate}
          loading={modalLoading}
          token={token}
        />
      </Modal>

      {/* Edit Item Modal */}
      <Modal 
        isOpen={showEditModal && !!editingItem}
        onClose={() => {
          setShowEditModal(false)
          setEditingItem(null)
        }}
        title={`Edit ${activeTab === 'products' ? 'Product' : 'Service'}`}
        size="large"
      >
        <ItemForm
          item={editingItem}
          type={activeTab.slice(0, -1)}
          onSubmit={handleUpdateItem}
          onCancel={() => {
            setShowEditModal(false)
            setEditingItem(null)
          }}
          onImageUpdate={handleImageUpdate}
          loading={modalLoading}
          token={token}
        />
      </Modal>
    </div>
  )
}
