import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import SEOHead from '../components/SEOHead.jsx'
import { fetchShopById } from '../api/shops.js'
import { fetchProducts } from '../api/products.js'
import Avatar from '../components/Avatar.jsx'
import Modal from '../components/Modal.jsx'
import { extractShopIdFromSlug } from '../utils/slugUtils.js'
import { ResponsiveAd, InContentAd } from '../components/GoogleAds.jsx'
import { loadLeaflet, isLeafletLoaded } from '../utils/leafletLoader.js'

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
      try {
        // Load Leaflet using shared loader
        const L = await loadLeaflet()

        // Initialize map
        if (mapRef.current && !mapInstanceRef.current) {
          // Check if container already has a map
          if (mapRef.current._leaflet_id) {
            return
          }

          // Ensure container has proper dimensions
          if (mapRef.current.offsetWidth === 0 || mapRef.current.offsetHeight === 0) {
            console.log('Map container has no dimensions, retrying...')
            setTimeout(initializeMap, 100)
            return
          }

          try {
            mapInstanceRef.current = L.map('shop-map', {
              zoomControl: false,
              attributionControl: false,
              dragging: false,
              touchZoom: false,
              scrollWheelZoom: false,
              doubleClickZoom: false,
              boxZoom: false,
              keyboard: false
            }).setView([shop.lat, shop.lng], 15)
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(mapInstanceRef.current)

            // Add shop marker
            L.marker([shop.lat, shop.lng])
              .addTo(mapInstanceRef.current)
              .bindPopup(shop.name)
            
            // Force map to resize and fit properly
            setTimeout(() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.invalidateSize()
              }
            }, 200)
            
            setMapLoaded(true)
          } catch (error) {
            console.error('Failed to initialize map:', error)
          }
        }
      } catch (error) {
        console.error('Error in map initialization:', error)
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

  // Handle map resize when component updates
  useEffect(() => {
    if (mapInstanceRef.current && mapLoaded) {
      const handleResize = () => {
        mapInstanceRef.current.invalidateSize()
      }
      
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [mapLoaded])

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
      <main className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="muted">Loading shop...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container" style={{ padding: '2rem' }}>
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
      <main className="container" style={{ padding: '2rem', textAlign: 'center' }}>
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
      <main className="container" style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
        {/* Shop Cover Photo */}
       {shop.coverPath && (
         <section style={{ marginBottom: '1.5rem' }}>
           <div style={{
             height: '90vh',
             maxHeight: '600px',
             minHeight: '400px',
             background: `url(${shop.coverPath})`,
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             borderRadius: '12px',
             position: 'relative',
             width: '100%'
           }} />
         </section>
       )}

      {/* Shop Header */}
      <section className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
                 <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                     <Avatar src={shop.logoPath} alt={shop.name} size={144} fallback="🏪" />
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, marginBottom: '0.25rem' }}>{shop.name}</h2>
            {shop.addressLine && (
              <p className="muted" style={{ margin: 0, fontSize: '0.875rem' }}>
                {shop.addressLine}
              </p>
            )}
            
            {/* Shop Contact Details */}
            {(shop.phone || shop.website || shop.email || shop.facebook || shop.instagram || shop.twitter) && (
              <div style={{ 
                marginTop: '1rem', 
                paddingTop: '1rem', 
                borderTop: '1px solid var(--border)',
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                {shop.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>📞</span>
                    <a 
                      href={`tel:${shop.phone}`}
                      style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none' }}
                    >
                      {shop.phone}
                    </a>
                  </div>
                )}
                {shop.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>✉️</span>
                    <a 
                      href={`mailto:${shop.email}`}
                      style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none' }}
                    >
                      {shop.email}
                    </a>
                  </div>
                )}
                {shop.website && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>🌐</span>
                    <a 
                      href={shop.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none' }}
                    >
                      {shop.website}
                    </a>
                  </div>
                )}
                {shop.facebook && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>📘</span>
                    <a 
                      href={shop.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none' }}
                    >
                      Facebook
                    </a>
                  </div>
                )}
                {shop.instagram && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>📷</span>
                    <a 
                      href={shop.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none' }}
                    >
                      Instagram
                    </a>
                  </div>
                )}
                {shop.twitter && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>🐦</span>
                    <a 
                      href={shop.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none' }}
                    >
                      Twitter
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
          
                     {/* Shop Location Map - Small square on the right */}
                       {shop.lat && shop.lng && (
              <div style={{ flexShrink: 0 }}>
                <div 
                  ref={mapRef}
                  id="shop-map"
                  style={{ 
                    width: '250px',
                    height: '180px', 
                    borderRadius: '8px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    display: mapLoaded ? 'block' : 'flex',
                    alignItems: mapLoaded ? 'stretch' : 'center',
                    justifyContent: mapLoaded ? 'stretch' : 'center',
                    fontSize: '0.75rem',
                    color: 'var(--muted)',
                    overflow: 'hidden',
                    position: 'relative',
                    minWidth: '250px',
                    minHeight: '180px'
                  }}
                >
                  {!mapLoaded && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📍</div>
                      <div>Loading map...</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          
          {isOwner && (
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddProduct(true)}
            >
              Add Product
            </button>
          )}
        </div>
      </section>

      {/* Products Section */}
      <section>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem' 
        }}>
          <div>
            <h3 style={{ margin: 0 }}>Products</h3>
                       <p className="muted" style={{ marginTop: 4 }}>
             {(!Array.isArray(products) || products.length === 0) ? 'No products yet' : `${products.length} product${products.length !== 1 ? 's' : ''} available`}
           </p>
          </div>
                     {isOwner && Array.isArray(products) && products.length > 0 && (
            <button 
              className="btn"
              onClick={() => setShowAddProduct(true)}
            >
              Add Another Product
            </button>
          )}
        </div>

                 {(!Array.isArray(products) || products.length === 0) ? (
          <div className="card" style={{ 
            textAlign: 'center', 
            padding: '2rem',
            backgroundColor: 'var(--card-2)',
            border: '2px dashed var(--border)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>No products yet</h3>
            <p className="muted" style={{ marginBottom: '1rem' }}>
              {isOwner ? 'Start selling by adding your first product' : 'This shop hasn\'t added any products yet'}
            </p>
            {isOwner && (
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddProduct(true)}
              >
                Add Your First Product
              </button>
            )}
          </div>
        ) : (
                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
             {Array.isArray(products) && products.map((product) => (
              <article key={product.id} className="card" style={{ padding: '0.9rem' }}>
                <div style={{ 
                  height: 140, 
                  borderRadius: 12, 
                  background: 'var(--surface)', 
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--muted)',
                  fontSize: '0.875rem'
                }}>
                  {product.imagePathsJson ? 'Product Image' : 'No Image'}
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{product.title}</div>
                  <div className="muted" style={{ marginBottom: '0.5rem' }}>
                    ₱{Number(product.price).toFixed(2)}
                  </div>
                  {product.description && (
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--muted)', 
                      margin: '0 0 0.5rem 0',
                      lineHeight: 1.4
                    }}>
                      {product.description.length > 60 
                        ? product.description.substring(0, 60) + '...' 
                        : product.description
                      }
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn" style={{ flex: 1 }}>View</button>
                    {isOwner && (
                      <button 
                        className="btn"
                        onClick={() => handleDeleteProduct(product.id)}
                        style={{ 
                          backgroundColor: 'var(--error-bg)', 
                          color: 'var(--error)',
                          border: '1px solid var(--error)',
                          padding: '0.5rem 0.75rem'
                        }}
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
         <div style={{ marginTop: '2rem', padding: '1rem 0', borderTop: '1px solid var(--border)' }}>
           <ResponsiveAd />
         </div>
       </section>

       

       {/* Add Product Modal */}
      <Modal 
        isOpen={showAddProduct} 
        onClose={() => setShowAddProduct(false)}
        title="Add New Product"
        size="large"
      >
        <form onSubmit={handleAddProduct} style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label htmlFor="productTitle" className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
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
            <label htmlFor="productDescription" className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label htmlFor="productPrice" className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
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
              <label htmlFor="productCategory" className="muted" style={{ display: 'block', marginBottom: '0.5rem' }}>
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

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button 
              type="button" 
              className="btn" 
              onClick={() => setShowAddProduct(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Product
            </button>
          </div>
        </form>
      </Modal>
      </main>
    </>
  )
}


