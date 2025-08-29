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
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    price: '',
    category: ''
  })

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
        category: ''
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
          "image": shop.coverPath,
          "logo": shop.logoPath,
          "sameAs": [
            shop.facebook,
            shop.instagram,
            shop.twitter,
            shop.website
          ].filter(Boolean)
        }}
      />
      <main className="container shop-page-container">
        {/* Shop Cover Photo */}
       {shop.coverPath && (
         <section className="shop-cover-section">
           <div className="shop-cover-image" style={{
             background: `url(${shop.coverPath})`
           }} />
         </section>
       )}

      {/* Shop Header */}
      <section className="card shop-header">
        <div className="shop-header-content">
          <div className="shop-info-section">
            <Avatar src={shop.logoPath} alt={shop.name} size={80} fallback="🏪" />
            <div className="shop-details">
              <h2 className="shop-name">{shop.name}</h2>
              {shop.addressLine && (
                <p className="muted shop-address">
                  {shop.addressLine}
                </p>
              )}
            </div>
          </div>
          
          {/* Shop Location Map - Responsive */}
          {shop.lat && shop.lng && (
            <div className="shop-map-container">
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
            </div>
          )}
          
          {isOwner && (
            <button 
              className="btn btn-primary add-product-btn"
              onClick={() => setShowAddProduct(true)}
            >
              Add Product
            </button>
          )}
        </div>

        {/* Shop Contact Details - Responsive */}
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
                <span className="contact-icon">📘</span>
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
                <span className="contact-icon">📷</span>
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
                <span className="contact-icon">🐦</span>
                <a 
                  href={shop.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  Twitter
                </a>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="products-header">
          <div>
            <h3 style={{ margin: 0 }}>Products</h3>
            <p className="muted" style={{ marginTop: 4 }}>
              {(!Array.isArray(products) || products.length === 0) ? 'No products yet' : `${products.length} product${products.length !== 1 ? 's' : ''} available`}
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
          <div className="products-grid">
            {Array.isArray(products) && products.map((product) => (
              <article key={product.id} className="card product-card">
                <div className="product-image-placeholder">
                  {product.imagePathsJson ? 'Product Image' : 'No Image'}
                </div>
                <div className="product-content">
                  <div className="product-title">{product.title}</div>
                  <div className="product-price">
                    ₱{Number(product.price).toFixed(2)}
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

      {/* Social Sharing */}
      <section className="social-sharing-section">
        <h3 style={{ marginBottom: '1rem' }}>Share This Shop</h3>
        <p className="muted" style={{ marginBottom: '1rem' }}>
          Help others discover {shop.name}
        </p>
        <SocialSharing 
          title={`${shop.name} - Local Shop`}
          description={`Visit ${shop.name} - ${shop.addressLine || 'Local shop'}. Discover products and support local businesses.`}
          url={`https://localslocalmarket.com/shops/${shop.id}`}
          image={shop.coverPath}
        />
      </section>

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


