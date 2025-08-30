import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import SEOHead from '../components/SEOHead.jsx'
import SocialSharing from '../components/SocialSharing.jsx'
import RelatedShops from '../components/RelatedShops.jsx'
import { fetchShopById } from '../api/shops.js'
import { fetchProducts } from '../api/products.js'
import Avatar from '../components/Avatar.jsx'
import Modal from '../components/Modal.jsx'
import { extractShopIdFromSlug } from '../utils/slugUtils.js'
import { ResponsiveAd, InContentAd } from '../components/GoogleAds.jsx'
import { API_BASE } from '../api/client.js'
import './ShopPage.css'

export default function ShopPage() {
  const { id: slug } = useParams()
  const { user, token } = useAuth()
  
  const shopId = extractShopIdFromSlug(slug)
  const [shop, setShop] = useState(null)
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [savingStock, setSavingStock] = useState({})
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    stockCount: ''
  })

  // Utility function to format image paths
  const formatImagePath = (path) => {
    if (!path) return null
    // If path already starts with http/https, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    // If path starts with /uploads, it's already correct
    if (path.startsWith('/uploads/')) {
      return path
    }
    // Otherwise, assume it's a relative path and add /uploads/
    return `/uploads/${path}`
  }

  // Add cache busting to image URLs
  const getImageUrl = (path) => {
    const formattedPath = formatImagePath(path)
    if (!formattedPath) return null
    
    // Get the backend URL - use the same base as API requests
    const backendUrl = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api'
    const baseUrl = backendUrl.replace('/api', '') // Remove /api to get just the base URL
    
    // Construct full URL to backend server
    const fullUrl = `${baseUrl}${formattedPath}`
    
    // Add timestamp to prevent caching issues
    const separator = fullUrl.includes('?') ? '&' : '?'
    return `${fullUrl}${separator}t=${Date.now()}`
  }

  // Debug logging for image paths
  useEffect(() => {
    if (shop && process.env.NODE_ENV === 'development') {
      console.log('Shop data:', shop)
      console.log('Original logoPath:', shop.logoPath)
      console.log('Formatted logoPath:', formatImagePath(shop.logoPath))
      console.log('Original shopViewPath:', shop.coverPath)
      console.log('Formatted shopViewPath:', formatImagePath(shop.coverPath))
    }
  }, [shop])

  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  const isOwner = shop && user && shop.owner && shop.owner.id === user.id

  useEffect(() => {
    const loadShopData = async () => {
      setError('')
      setLoading(true)
      setMapLoaded(false)
      try {
        const shopData = await fetchShopById(shopId)
        setShop(shopData)
        const productsResponse = await fetchProducts({ shopId: shopData.id })
        // Handle both array and paginated response
        const productsData = Array.isArray(productsResponse) ? productsResponse : (productsResponse.content || [])
        setProducts(productsData)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    if (shopId) {
      loadShopData()
    }
  }, [shopId])

  // Initialize map when shop data is loaded
  useEffect(() => {
    if (!shop || !shop.lat || !shop.lng) return

    const initializeMap = async () => {
      // Load Leaflet CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
        link.crossOrigin = ''
        document.head.appendChild(link)
      }

      // Load Leaflet JS
      if (typeof window.L === 'undefined') {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
          script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
          script.crossOrigin = ''
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        })
      }

      // Wait a bit for the script to be fully loaded
      await new Promise(resolve => setTimeout(resolve, 100))

      // Initialize map
      if (mapRef.current && !mapInstanceRef.current && window.L) {
        // Check if container already has a map
        if (mapRef.current._leaflet_id) {
          return
        }

        try {
          mapInstanceRef.current = window.L.map('shop-map').setView([shop.lat, shop.lng], 15)
          
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(mapInstanceRef.current)

          // Add shop marker
          window.L.marker([shop.lat, shop.lng])
            .addTo(mapInstanceRef.current)
            .bindPopup(shop.name)
          
          setMapLoaded(true)
        } catch (error) {
          console.error('Failed to initialize map:', error)
        }
      }
    }

    initializeMap()

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove()
        } catch (error) {
          console.log('Map already removed')
        }
        mapInstanceRef.current = null
      }
      setMapLoaded(false)
    }
  }, [shop])

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      // TODO: Implement product creation API call
      // const newProduct = await createProductRequest({ ...productForm, shopId: id }, token)
      // setProducts([...products, newProduct])
      setShowAddProduct(false)
      setProductForm({
        title: '',
        description: '',
        price: '',
        category: '',
        stockCount: ''
      })
    } catch (error) {
      console.error('Failed to create product:', error)
      setError('Failed to create product: ' + error.message)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }
    
    try {
      // TODO: Implement product deletion API call
      // await deleteProductRequest(productId, token)
      // setProducts(products.filter(p => p.id !== productId))
      console.log('Delete product:', productId)
    } catch (error) {
      console.error('Failed to delete product:', error)
      setError('Failed to delete product: ' + error.message)
    }
  }

  const handleStockChange = async (productId, change) => {
    try {
      const product = products.find(p => p.id === productId)
      if (!product) return
      
      const newStock = Math.max(0, (product.stockCount || 0) + change)
      
      // Update the product in the list immediately for better UX
      setProducts(products.map(p => 
        p.id === productId ? { ...p, stockCount: newStock } : p
      ))
      
      // Make API call to update stock
      const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:8080/api'}/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ stockCount: newStock })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update stock')
      }
    } catch (error) {
      console.error('Failed to update stock:', error)
      setError('Failed to update stock: ' + error.message)
      // Revert the optimistic update
      const originalProducts = await fetchProducts({ shopId: shop.id })
      setProducts(Array.isArray(originalProducts) ? originalProducts : (originalProducts.content || []))
    }
  }

  // Debounce timer for stock input
  const stockDebounceTimers = useRef({})

  const handleStockInputChange = async (productId, value) => {
    const newStock = Math.max(0, parseInt(value) || 0)
    
    // Update the product in the list immediately for better UX
    setProducts(products.map(p => 
      p.id === productId ? { ...p, stockCount: newStock } : p
    ))
    
    // Clear existing timer for this product
    if (stockDebounceTimers.current[productId]) {
      clearTimeout(stockDebounceTimers.current[productId])
    }
    
    // Set new timer for this product
    stockDebounceTimers.current[productId] = setTimeout(async () => {
      try {
        // Show saving state
        setSavingStock(prev => ({ ...prev, [productId]: true }))
        
        // Make API call to update stock
        const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:8080/api'}/products/${productId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ stockCount: newStock })
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to update stock: ${response.status} - ${errorText}`)
        }
        
        // Clear the timer reference and saving state
        delete stockDebounceTimers.current[productId]
        setSavingStock(prev => ({ ...prev, [productId]: false }))
      } catch (error) {
        console.error('Failed to update stock:', error)
        setError('Failed to update stock: ' + error.message)
        // Revert the optimistic update
        const originalProducts = await fetchProducts({ shopId: shop.id })
        setProducts(Array.isArray(originalProducts) ? originalProducts : (originalProducts.content || []))
        // Clear the timer reference and saving state
        delete stockDebounceTimers.current[productId]
        setSavingStock(prev => ({ ...prev, [productId]: false }))
      }
    }, 2000) // 2 second delay
  }

  if (loading) {
    return (
      <main className="container shop-page-container">
        <div className="muted">Loading shop...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container shop-page-container">
        <div style={{ 
          backgroundColor: 'var(--error-bg)', 
          color: 'var(--error)', 
          padding: '0.75rem', 
          borderRadius: '8px',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      </main>
    )
  }

  if (!shop) {
    return (
      <main className="container shop-page-container">
        <div className="muted">Shop not found</div>
      </main>
    )
  }

  return (
    <>
      <SEOHead 
        title={shop.name}
        description={`Visit ${shop.name} - ${shop.addressLine || 'Local shop'}. Discover products, contact information, and location. Support local businesses on LocalsLocalMarket.`}
        keywords={`${shop.name}, local shop, ${shop.addressLine ? shop.addressLine.split(',')[0] : 'local business'}, local products, shop local`}
        url={`https://localslocalmarket.com/shops/${shop.id}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": shop.name,
          "description": shop.description || `Local shop: ${shop.name}`,
          "url": `https://localslocalmarket.com/shops/${shop.id}`,
          "telephone": shop.phone,
          "email": shop.email,
          "address": shop.addressLine ? {
            "@type": "PostalAddress",
            "streetAddress": shop.addressLine
          } : undefined,
          "geo": shop.lat && shop.lng ? {
            "@type": "GeoCoordinates",
            "latitude": shop.lat,
            "longitude": shop.lng
          } : undefined,
                  "image": getImageUrl(shop.coverPath), // Shop view image
        "logo": getImageUrl(shop.logoPath),
          "sameAs": [
            shop.facebook,
            shop.instagram,
            shop.twitter,
            shop.website
          ].filter(Boolean)
        }}
      />
      <main className="container shop-page-container">


      {/* Shop Content - Two Column Layout */}
      <div className="shop-content-layout">
        {/* Left Column - Shop Info Only */}
        <div className="shop-left-column">
          {/* Shop Header */}
          <section className="card shop-header">
            <div className="shop-header-content">
              <div className="shop-info-section">

                <Avatar src={getImageUrl(shop.logoPath)} alt={shop.name} size={200} fallback="🏪" />
                <div className="shop-details">
                  <div className="shop-name-section">
                    <h1 className="shop-name">{shop.name}</h1>
                    {shop.description && (
                      <p className="shop-tagline">
                        {shop.description}
                      </p>
                    )}
                  </div>
                  
                  {shop.addressLine && (
                    <div className="shop-location-section">
                      <div className="location-content-wrapper">
                        <div className="location-info">
                          <div className="location-header">
                            <span className="location-icon">📍</span>
                            <span className="location-label">Location</span>
                          </div>
                          <p className="shop-address">
                            {shop.addressLine}
                          </p>
                        </div>
                        {shop.coverPath && (
                          <div className="shop-view-image">
                            <img 
                              src={getImageUrl(shop.coverPath)} 
                              alt={`${shop.name} shop view`}
                              style={{
                                objectFit: 'cover',
                                borderRadius: '8px'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
                {/* Social Sharing Section */}
                <div className="social-sharing-section">
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Share This Shop</h3>
                    <p className="muted" style={{ marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                        Help others discover {shop.name}
                    </p>
                    <SocialSharing
                        title={`${shop.name} - Local Shop`}
                        description={`Visit ${shop.name} - ${shop.addressLine || 'Local shop'}. Discover products and support local businesses.`}
                        url={`https://localslocalmarket.com/shops/${shop.id}`}
                        image={getImageUrl(shop.coverPath)} // Shop view image
                    />
                </div>
              {isOwner && (
                <div className="shop-owner-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => window.location.href = `/shops/${slug}/edit`}
                  >
                    <span className="btn-icon">✏️</span>
                    Edit Shop
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => window.location.href = '/dashboard'}
                  >
                    <span className="btn-icon">📊</span>
                    Go to Dashboard
                  </button>
                  {process.env.NODE_ENV === 'development' && (
                    <button 
                      className="btn btn-outline"
                      onClick={() => window.location.reload()}
                      style={{fontSize: '0.8rem', padding: '4px 8px'}}
                    >
                      Refresh
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Shop Contact Details and Social Sharing */}
            <div className="shop-contact-sharing-section">
              {/* Contact Details */}
              {(shop.phone || shop.website || shop.email || shop.facebook || shop.instagram || shop.twitter) && (
                <div className="shop-contact-details">
                  {shop.phone && (
                    <div className="contact-item">
                      <span className="contact-icon">📞</span>
                      <a 
                        href={`tel:${shop.phone}`}
                        className="contact-link"
                      >
                        {shop.phone}
                      </a>
                    </div>
                  )}
                  {shop.email && (
                    <div className="contact-item">
                      <span className="contact-icon">✉️</span>
                      <a 
                        href={`mailto:${shop.email}`}
                        className="contact-link"
                      >
                        {shop.email}
                      </a>
                    </div>
                  )}
                  {shop.website && (
                    <div className="contact-item">
                      <span className="contact-icon">🌐</span>
                      <a 
                        href={shop.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="contact-link"
                      >
                        {shop.website}
                      </a>
                    </div>
                  )}
                  {shop.facebook && (
                    <div className="contact-item">
                      <span className="contact-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </span>
                      <a 
                        href={shop.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="contact-link"
                      >
                        Facebook
                      </a>
                    </div>
                  )}
                  {shop.instagram && (
                    <div className="contact-item">
                      <span className="contact-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </span>
                      <a 
                        href={shop.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="contact-link"
                      >
                        Instagram
                      </a>
                    </div>
                  )}
                  {shop.twitter && (
                    <div className="contact-item">
                      <span className="contact-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </span>
                      <a 
                        href={shop.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="contact-link"
                      >
                        X
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column - Map Only */}
        <div className="shop-right-column">
          {/* Shop Location Map */}
          {shop.lat && shop.lng && (
            <section className="card shop-map-section">
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Location</h3>
              <div 
                ref={mapRef}
                id="shop-map"
                className={`shop-map ${mapLoaded ? 'loaded' : ''}`}
              >
                {!mapLoaded && (
                  <div className="map-loading">
                    <div className="map-loading-icon">📍</div>
                    <div>Loading map...</div>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Products Section - Full Width */}
      <section className="products-section-full-width">
        <div className="products-header">
          <div>
            <h3 style={{ margin: 0 }}>Products</h3>
            <p className="muted" style={{ marginTop: 4 }}>
              {(() => {
                const filteredProducts = selectedCategory 
                  ? products.filter(p => p.category === selectedCategory)
                  : products;
                const totalProducts = products.length;
                const filteredCount = filteredProducts.length;
                
                if (!Array.isArray(products) || products.length === 0) {
                  return 'No products yet';
                }
                
                if (selectedCategory) {
                  return `${filteredCount} of ${totalProducts} product${totalProducts !== 1 ? 's' : ''} in ${selectedCategory}`;
                }
                
                return `${totalProducts} product${totalProducts !== 1 ? 's' : ''} available`;
              })()}
            </p>
          </div>
          {isOwner && Array.isArray(products) && products.length > 0 && (
            <button 
              className="btn add-another-product-btn"
              onClick={() => setShowAddProduct(true)}
            >
              Add Another Product
            </button>
          )}
        </div>

        {/* Category Filter */}
        {Array.isArray(products) && products.length > 0 && (() => {
          const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
          if (categories.length > 1) {
            return (
              <div className="category-filter">
                <div className="filter-label">Filter by Category:</div>
                <div className="category-buttons">
                  <button 
                    className={`category-btn ${!selectedCategory ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(null)}
                  >
                    All
                  </button>
                  {categories.map(category => (
                    <button 
                      key={category}
                      className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })()}

        {(!Array.isArray(products) || products.length === 0) ? (
          <div className="card no-products-card">
            <div className="no-products-icon">📦</div>
            <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>No products yet</h3>
            <p className="muted" style={{ marginBottom: '1rem' }}>
              {isOwner ? 'Start selling by adding your first product' : 'This shop hasn\'t added any products yet'}
            </p>
            {isOwner && (
              <button 
                className="btn btn-primary add-first-product-btn"
                onClick={() => setShowAddProduct(true)}
              >
                Add Your First Product
              </button>
            )}
          </div>
        ) : (
          <div className="products-grid-full-width">
            {Array.isArray(products) && products
              .filter(product => !selectedCategory || product.category === selectedCategory)
              .map((product) => (
              <article key={product.id} className="card product-card">
                <div className="product-image-container">
                  {(() => {
                    let imagePaths = [];
                    try {
                      imagePaths = product.imagePathsJson ? JSON.parse(product.imagePathsJson) : [];
                    } catch (e) {
                      imagePaths = [];
                    }
                    
                    if (imagePaths.length > 0) {
                      return (
                        <>
                          <img 
                            src={getImageUrl(imagePaths[0])} 
                            alt={product.title}
                            className="product-image"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="product-image-placeholder" style={{ display: 'none' }}>
                            📷
                          </div>
                        </>
                      );
                    }
                    
                    return (
                      <div className="product-image-placeholder">
                        📷
                      </div>
                    );
                  })()}
                </div>
                <div className="product-content">
                  <div className="product-title">{product.title}</div>
                  <div className="product-price">
                    ₱{Number(product.price).toFixed(2)}
                  </div>
                  {product.category && (
                    <div className="product-category">
                      <span className="category-tag">{product.category}</span>
                    </div>
                  )}
                                      <div className="product-stock">
                      {product.stockCount > 0 ? (
                        <span className="stock-in-stock">In Stock: {product.stockCount}</span>
                      ) : (
                        <span className="stock-out-of-stock">Out of Stock</span>
                      )}
                      {isOwner && (
                        <div className="stock-controls">
                          <button 
                            className="stock-btn stock-minus"
                            onClick={() => handleStockChange(product.id, -1)}
                            title="Decrease stock by 1"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            className={`stock-input ${savingStock[product.id] ? 'saving' : ''}`}
                            value={product.stockCount || 0}
                            onChange={(e) => handleStockInputChange(product.id, e.target.value)}
                            min="0"
                            title={savingStock[product.id] ? "Saving..." : "Edit stock count"}
                          />
                          {savingStock[product.id] && (
                            <div className="stock-saving-indicator">
                              <div className="saving-spinner"></div>
                            </div>
                          )}
                          <button 
                            className="stock-btn stock-plus"
                            onClick={() => handleStockChange(product.id, 1)}
                            title="Increase stock by 1"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  {product.description && (
                    <p className="product-description">
                      {product.description.length > 60 
                        ? product.description.substring(0, 60) + '...' 
                        : product.description
                      }
                    </p>
                  )}
                  <div className="product-actions">
                    <button className="btn view-product-btn">View</button>
                    {isOwner && (
                      <button 
                        className="btn delete-product-btn"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
         
        {/* Bottom ad after products */}
        <div className="bottom-ad">
          <ResponsiveAd />
        </div>
      </section>

      {/* Advertisements Carousel */}
      {shop.adsEnabled && shop.adsImagePathsJson && (()=>{ let imgs=[]; try{ imgs = JSON.parse(shop.adsImagePathsJson)||[] } catch { imgs=[] }
        return imgs.length>0 ? (
          <section className="card" style={{marginBottom:16}}>
            <div style={{display:'flex', overflowX:'auto', gap:8}}>
              {imgs.map((src, idx)=> (
                <div key={idx} style={{minWidth:260}}>
                  <img src={src} alt={`Ad ${idx+1}`} style={{width:'100%', height:160, objectFit:'cover', borderRadius:8}} />
                </div>
              ))}
            </div>
          </section>
        ) : null })()}

      {/* Related Shops */}
      <RelatedShops currentShop={shop} />

      {/* Add Product Modal */}
      <Modal 
        isOpen={showAddProduct} 
        onClose={() => setShowAddProduct(false)}
        title="Add New Product"
        size="xlarge"
      >
        <form onSubmit={handleAddProduct} className="add-product-form">
          <div>
            <label htmlFor="productTitle" className="muted form-label">
              Product Title *
            </label>
            <input
              type="text"
              id="productTitle"
              className="input"
              value={productForm.title}
              onChange={(e) => setProductForm({...productForm, title: e.target.value})}
              required
            />
          </div>

          <div>
            <label htmlFor="productDescription" className="muted form-label">
              Description
            </label>
            <textarea
              id="productDescription"
              className="input"
              value={productForm.description}
              onChange={(e) => setProductForm({...productForm, description: e.target.value})}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-row">
            <div>
              <label htmlFor="productPrice" className="muted form-label">
                Price *
              </label>
              <input
                type="number"
                id="productPrice"
                className="input"
                value={productForm.price}
                onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label htmlFor="productCategory" className="muted form-label">
                Category
              </label>
              <input
                type="text"
                id="productCategory"
                className="input"
                value={productForm.category}
                onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                placeholder="e.g., Electronics, Food, Clothing"
              />
            </div>
            <div>
              <label htmlFor="productStock" className="muted form-label">
                Stock Count *
              </label>
              <input
                type="number"
                id="productStock"
                className="input"
                value={productForm.stockCount}
                onChange={(e) => setProductForm({...productForm, stockCount: e.target.value})}
                min="0"
                required
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn cancel-btn" 
              onClick={() => setShowAddProduct(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary submit-btn">
              Add Product
            </button>
          </div>
        </form>
      </Modal>


      </main>
    </>
  )
}


