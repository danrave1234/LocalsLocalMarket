import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchShops } from '../api/shops.js'
import { generateShopUrl } from '../utils/slugUtils.js'
import { MapPin } from 'lucide-react'

const RelatedShops = ({ currentShop, limit = 4 }) => {
  const [relatedShops, setRelatedShops] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRelatedShops = async () => {
      try {
        setLoading(true)
        const response = await fetchShops({ 
          limit: limit + 1, // Get one extra to exclude current shop
          q: currentShop?.addressLine?.split(',')[0] || undefined // Search by city/area
        })
        
        const shops = Array.isArray(response) ? response : (response.content || [])
        
        // Filter out current shop and limit results
        const filtered = shops
          .filter(shop => shop.id !== currentShop?.id)
          .slice(0, limit)
        
        setRelatedShops(filtered)
      } catch (error) {
        console.error('Failed to load related shops:', error)
        setRelatedShops([])
      } finally {
        setLoading(false)
      }
    }

    if (currentShop) {
      loadRelatedShops()
    }
  }, [currentShop, limit])

  if (loading) {
    return (
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Related Shops</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ 
              height: '120px', 
              background: 'var(--card)', 
              borderRadius: '8px',
              animation: 'pulse 2s infinite'
            }} />
          ))}
        </div>
      </div>
    )
  }

  if (relatedShops.length === 0) {
    return null
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ marginBottom: '1rem' }}>Related Shops</h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem' 
      }}>
        {relatedShops.map(shop => (
          <Link
            key={shop.id}
            to={generateShopUrl(shop.name, shop.id)}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'block'
            }}
          >
            <div className="card" style={{ 
              padding: '0.75rem',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = 'none'
            }}
            >
              <h4 style={{ 
                margin: 0, 
                marginBottom: '0.5rem', 
                fontSize: '0.9rem',
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {shop.name}
              </h4>
              
              {shop.addressLine && (
                <p className="muted" style={{ 
                  margin: 0, 
                  fontSize: '0.75rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  <MapPin size={14} /> {shop.addressLine}
                </p>
              )}
              
              <div style={{ 
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                color: 'var(--primary)',
                fontWeight: 500
              }}>
                View Shop →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RelatedShops
