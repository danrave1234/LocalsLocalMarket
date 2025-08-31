import { useEffect, useMemo, useState, useRef } from "react"
import { useSearchParams, Link } from "react-router-dom"
import Avatar from "../components/Avatar.jsx"
import SEOHead from "../components/SEOHead.jsx"
import SocialSharing from "../components/SocialSharing.jsx"
import FAQ from "../components/FAQ.jsx"
import SearchOptimization from "../components/SearchOptimization.jsx"
import { fetchShops } from "../api/shops.js"
import { generateShopUrl } from "../utils/slugUtils.js"
// import { InContentAd, ResponsiveAd } from "../components/GoogleAds.jsx"
import { loadLeaflet, isLeafletLoaded } from "../utils/leafletLoader.js"

// Inline icon components to avoid external dependencies
function MapPin(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.width || 20} height={props.height || 20} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 21s-7-6-7-11a7 7 0 1 1 14 0c0 5-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2" />
    </svg>
  )
}
function Search(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.width || 20} height={props.height || 20} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}
function Star(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.width || 16} height={props.height || 16} fill="#facc15" stroke="#facc15" strokeWidth="0" {...props}>
      <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.4 8.171L12 18.896 4.666 23.167l1.4-8.171L.132 9.21l8.2-1.192L12 .587z" />
    </svg>
  )
}
function Expand(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.width || 20} height={props.height || 20} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  )
}
function Minimize(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.width || 20} height={props.height || 20} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
    </svg>
  )
}

function haversineDistanceKm(a, b) {
  if (!a || !b) return Number.POSITIVE_INFINITY
  const toRad = (x) => (x * Math.PI) / 180
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const s1 = Math.sin(dLat / 2)
  const s2 = Math.sin(dLon / 2)
  const c = s1 * s1 + Math.cos(lat1) * Math.cos(lat2) * s2 * s2
  return 2 * R * Math.asin(Math.sqrt(c))
}

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

// Helper function to extract shops from paginated response
function extractShopsFromResponse(response) {
  if (Array.isArray(response)) {
    return response
  }
  if (response && response.content && Array.isArray(response.content)) {
    return response.content
  }
  return []
}

export default function LandingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = (searchParams.get("q") || "").trim().toLowerCase()
  const [coords, setCoords] = useState(null)
  const [pinnedLocation, setPinnedLocation] = useState(null)
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mapInstance, setMapInstance] = useState(null)
  const [mapMarkers, setMapMarkers] = useState([])
  const [isMapExpanded, setIsMapExpanded] = useState(false)
  const [mapContainerReady, setMapContainerReady] = useState(false)
  const [showTip, setShowTip] = useState(true)
  const mapRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem("user_location")
    if (saved) setCoords(JSON.parse(saved))
  }, [])

  useEffect(() => {
    const loadShops = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await fetchShops({ 
          q: query || undefined
        })
        const shopsData = extractShopsFromResponse(response)
        setShops(shopsData)
      } catch (err) {
        console.error('Failed to fetch shops:', err)
        setError('Failed to load shops. Please try again.')
        setShops([])
      } finally {
        setLoading(false)
      }
    }

    loadShops()
    
    // Clear pinned location when search query changes
    if (pinnedLocation) {
      setPinnedLocation(null)
    }
  }, [query])

  const sortedShops = useMemo(() => {
    const copy = [...shops]
    // Use pinned location for sorting if available, otherwise use user coords
    const referenceLocation = pinnedLocation || coords
    if (referenceLocation) {
      copy.sort((a, b) => haversineDistanceKm(referenceLocation, a) - haversineDistanceKm(referenceLocation, b))
    }
    return copy
  }, [shops, coords, pinnedLocation])

  // Load Leaflet CSS and JS
  useEffect(() => {
    loadLeaflet().catch(console.error)
  }, [])



  // Initialize map when Leaflet is loaded and container is ready
  useEffect(() => {
    if (!isLeafletLoaded() || !mapContainerReady) {
      return
    }

    const initializeMap = () => {
      try {
        console.log('Initializing map...')
        const L = window.L

        // Remove existing map
        if (mapInstance) {
          try {
            mapInstance.remove()
          } catch (error) {
            console.log('Map already removed')
          }
        }

        // Ensure container has proper dimensions
        if (!mapRef.current || mapRef.current.offsetWidth === 0 || mapRef.current.offsetHeight === 0) {
          console.log('Container not ready, retrying...')
          setTimeout(initializeMap, 200)
          return
        }

        // Create map
        const center = coords ? [coords.lat, coords.lng] : [10.3157, 123.8854] // Cebu City
        
        const map = L.map(mapRef.current, {
          zoomControl: true,
          attributionControl: true,
          dragging: true,
          touchZoom: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          keyboard: true
        }).setView(center, 13)

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          minZoom: 1
        }).addTo(map)

        // Add click handler to pin location
        map.on('click', (e) => {
          const { lat, lng } = e.latlng
          // Clear any existing pinned location and set the new one
          setPinnedLocation({ lat, lng })
        })

        setMapInstance(map)

        // Force map to invalidate size
        setTimeout(() => {
          if (map) {
            map.invalidateSize()
          }
        }, 100)

      } catch (err) {
        console.error('Error initializing map:', err)
      }
    }

    // Use a delay to ensure DOM is ready
    const timer = setTimeout(initializeMap, 200)
    
    return () => {
      clearTimeout(timer)
      if (mapInstance) {
        try {
          mapInstance.remove()
        } catch (error) {
          console.log('Map already removed')
        }
        setMapInstance(null)
      }
    }
  }, [mapContainerReady]) // Only reinitialize when container readiness changes

  // Update markers when shops or pinned location changes
  useEffect(() => {
    if (!mapInstance || !isLeafletLoaded()) {
      return
    }

    const L = window.L
    
    // Clear existing markers
    mapMarkers.forEach(marker => {
      try {
        marker.remove()
      } catch (error) {
        console.log('Error removing marker:', error)
      }
    })
    const newMarkers = []

    // Add user location marker
    if (coords) {
      const userIcon = L.divIcon({
        className: 'user-marker',
        html: `
          <div style="
            width: 24px;
            height: 24px;
            background: #10b981;
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            color: white;
            font-size: 12px;
            font-weight: bold;
          ">
            👤
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })

      const userMarker = L.marker([coords.lat, coords.lng], { icon: userIcon })
        .addTo(mapInstance)
        .bindPopup('Your Location')
      
      newMarkers.push(userMarker)
    }

    // Add pinned location marker
    if (pinnedLocation) {
      const pinnedIcon = L.divIcon({
        className: 'pinned-marker',
        html: `
          <div style="
            width: 28px;
            height: 28px;
            background: #f59e0b;
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            color: white;
            font-size: 14px;
            font-weight: bold;
          ">
            📌
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      })

      const pinnedMarker = L.marker([pinnedLocation.lat, pinnedLocation.lng], { icon: pinnedIcon })
        .addTo(mapInstance)
        .bindPopup('Pinned Location')
      
      newMarkers.push(pinnedMarker)
    }

    // Add shop markers
    sortedShops.forEach((shop, index) => {
      if (shop.lat && shop.lng) {
        try {
          const shopIcon = L.divIcon({
            className: 'shop-marker',
            html: `
              <div style="
                width: 40px;
                height: 40px;
                background: ${shop.logoPath ? 'white' : '#6366f1'};
                border: 3px solid white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                overflow: hidden;
                color: white;
                font-size: 18px;
              ">
                ${shop.logoPath ? 
                  `<img 
                    src="${getImageUrl(shop.logoPath)}" 
                    alt="${shop.name}" 
                    style="
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                      border-radius: 50%;
                    "
                    onerror="this.style.display='none'; this.parentElement.innerHTML='🏪'; this.parentElement.style.background='#6366f1';"
                  />` : 
                  '🏪'
                }
              </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
          })

          const marker = L.marker([shop.lat, shop.lng], { icon: shopIcon })
            .addTo(mapInstance)
            .bindPopup(`
              <div style="min-width: 200px;">
                <h4 style="margin: 0 0 0.5rem 0; color: #6366f1;">${shop.name}</h4>
                ${shop.addressLine ? `<p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: #666;">${shop.addressLine}</p>` : ''}
                <a href="/shops/${shop.id}" style="
                  display: inline-block;
                  background: #6366f1;
                  color: white;
                  padding: 0.5rem 1rem;
                  text-decoration: none;
                  border-radius: 6px;
                  font-size: 0.875rem;
                ">View Shop</a>
              </div>
            `)
          
          newMarkers.push(marker)
        } catch (error) {
          console.error(`Error adding marker for shop ${shop.name}:`, error)
        }
      }
    })

    setMapMarkers(newMarkers)

    // Fit bounds to show all markers
    if (newMarkers.length > 0) {
      try {
        const group = L.featureGroup(newMarkers)
        const bounds = group.getBounds()
        mapInstance.fitBounds(bounds.pad(0.1))
      } catch (error) {
        console.error('Error fitting map bounds:', error)
        // Fallback: set a default view if bounds fitting fails
        const center = coords ? [coords.lat, coords.lng] : [10.3157, 123.8854]
        mapInstance.setView(center, 13)
      }
    } else {
      // Set default view if no markers
      const center = coords ? [coords.lat, coords.lng] : [10.3157, 123.8854]
      mapInstance.setView(center, 13)
    }

  }, [mapInstance, sortedShops, coords, pinnedLocation])

  // Handle map resize when component updates or window resizes
  useEffect(() => {
    if (mapInstance) {
      const handleResize = () => {
        if (mapInstance) {
          mapInstance.invalidateSize()
        }
      }
      
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [mapInstance])

  const toggleMapSize = () => {
    setIsMapExpanded(!isMapExpanded)
    // Force map resize after toggle
    setTimeout(() => {
      if (mapInstance) {
        mapInstance.invalidateSize()
      }
    }, 100)
  }

  const clearPinnedLocation = () => {
    setPinnedLocation(null)
  }

  if (loading) {
    return (
      <main className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="muted">Loading shops...</div>
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

  return (
    <>
      <SEOHead 
        title="Explore Local Shops"
        description="Discover amazing local shops and businesses in your community. Find unique products, fresh goods, and support local entrepreneurs on LocalsLocalMarket."
        keywords="local shops, local businesses, community shopping, local products, neighborhood stores, shop local, local market"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Local Shops",
          "description": "Discover local shops and businesses in your community",
          "url": "https://localslocalmarket.com",
          "numberOfItems": sortedShops.length,
          "itemListElement": sortedShops.slice(0, 10).map((shop, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "LocalBusiness",
              "name": shop.name,
              "description": shop.description || `Local shop: ${shop.name}`,
              "url": `https://localslocalmarket.com/shops/${shop.id}`,
              "address": shop.addressLine ? {
                "@type": "PostalAddress",
                "streetAddress": shop.addressLine
              } : undefined
            }
          }))
        }}
      />
      <main className="container">
        {/* Header */}
        <section style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            margin: 0,
            marginBottom: "0.5rem",
            fontSize: "1.5rem",
            fontWeight: 600,
          }}
        >
          Explore Local Shops
        </h2>
        <p className="muted" style={{ margin: 0 }}>
          Discover amazing shops from all areas
        </p>
      </section>

      {/* Search Bar */}
      <section style={{ marginBottom: "2rem" }}>
        <SearchOptimization onClearFilters={clearPinnedLocation} />
      </section>

      {/* Main Content - Shops List and Map Side by Side */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMapExpanded ? '1fr 2fr' : '2fr 1fr',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Left Side - Shops List */}
        <div>
          {sortedShops.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              backgroundColor: 'var(--card-2)',
              borderRadius: '12px',
              border: '2px dashed var(--border)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏪</div>
              <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>No shops found</h3>
              <p className="muted" style={{ margin: 0 }}>
                {query ? `No shops match "${query}"` : 'No shops available yet'}
              </p>
            </div>
          ) : (
                          <div>
                <div style={{ marginBottom: "1rem" }}>
                  <h3 style={{ margin: 0, marginBottom: "0.25rem" }}>
                    {sortedShops.length} shop{sortedShops.length !== 1 ? 's' : ''} found
                    {(coords || pinnedLocation) && (
                      <span style={{ color: "var(--primary)", fontSize: "0.875rem", fontWeight: "normal" }}> 
                        (sorted by distance{pinnedLocation ? ' from pinned location' : ''})
                      </span>
                    )}
                  </h3>
                  <p className="muted" style={{ margin: 0, fontSize: "0.875rem" }}>
                    {query ? `Showing results for "${query}"` : 'All available shops'}
                  </p>
                  {pinnedLocation && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      marginTop: '0.5rem',
                      fontSize: '0.875rem',
                      color: 'var(--primary)'
                    }}>
                      <span>📍 Pinned location active</span>
                      <button 
                        onClick={clearPinnedLocation}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--error)',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          textDecoration: 'underline'
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>


              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: "1rem",
              }}>
                {sortedShops.map((shop) => (
                  <div key={shop.id} className="card" style={{ 
                    padding: 0, 
                    overflow: "hidden",
                    borderRadius: "16px",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                  onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                  >
                    {/* Shop Image */}
                    <div style={{ 
                      height: "120px", 
                      background: !shop.coverPath 
                        ? "linear-gradient(135deg, var(--surface) 0%, var(--card) 100%)"
                        : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--muted)",
                      fontSize: "0.875rem",
                      position: "relative",
                      overflow: "hidden"
                    }}>
                      {shop.coverPath ? (
                        <img 
                          src={getImageUrl(shop.coverPath)} 
                          alt={`${shop.name} shop view`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center"
                          }}
                          onError={(e) => {
                            console.error('Shop view image failed to load:', e.target.src)
                            e.target.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div style={{ 
                          display: "flex", 
                          flexDirection: "column", 
                          alignItems: "center", 
                          gap: "0.5rem" 
                        }}>
                          <div style={{ fontSize: "1.5rem" }}>🏪</div>
                          <span>Shop View</span>
                        </div>
                      )}
                    </div>

                    {/* Shop Details */}
                    <div style={{ padding: "0.75rem", position: "relative" }}>
                      {/* Shop Logo Overlay */}
                      {shop.logoPath && (
                        <div style={{
                          position: "absolute",
                          top: "-30px",
                          left: "20px",
                          width: "60px",
                          height: "60px",
                          borderRadius: "50%",
                          border: "3px solid var(--card)",
                          overflow: "hidden",
                          backgroundColor: "var(--card)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                          zIndex: 10
                        }}>
                          <img 
                            src={getImageUrl(shop.logoPath)} 
                            alt={`${shop.name} logo`} 
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover"
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Shop Name */}
                      <h3
                        style={{
                          margin: 0,
                          marginBottom: "0.375rem",
                          fontSize: "0.95rem",
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          marginLeft: shop.logoPath ? "80px" : "0"
                        }}
                      >
                        {shop.name}
                      </h3>
                      
                      {/* Location */}
                      {shop.addressLine && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontSize: "0.75rem",
                            color: "var(--muted)",
                            marginBottom: "0.375rem",
                          }}
                        >
                          <MapPin width={12} height={12} />
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {shop.addressLine}
                          </span>
                        </div>
                      )}

                      {/* Rating */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          fontSize: "0.75rem",
                          color: "var(--muted)",
                          marginBottom: "0.375rem",
                        }}
                      >
                        <Star width={12} height={12} />
                        <span style={{ fontWeight: 500 }}>4.5</span>
                        <span>(12 reviews)</span>
                      </div>

                      {/* Distance */}
                      {(coords || pinnedLocation) && shop.lat && shop.lng && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontSize: "0.75rem",
                            color: "var(--muted)",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <MapPin width={12} height={12} style={{ color: "#ec4899" }} />
                          <span>
                            ~{haversineDistanceKm(pinnedLocation || coords, shop).toFixed(1)} km away
                          </span>
                        </div>
                      )}

                      {/* Category Tags */}
                      <div style={{ display: "flex", gap: "0.375rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                        <span className="pill" style={{ fontSize: "0.7rem", padding: "0.2rem 0.4rem" }}>#local</span>
                        <span className="pill" style={{ fontSize: "0.7rem", padding: "0.2rem 0.4rem" }}>#fresh</span>
                        {shop.addressLine && <span className="pill" style={{ fontSize: "0.7rem", padding: "0.2rem 0.4rem" }}>#{shop.addressLine.split(',')[0].trim().toLowerCase()}</span>}
                      </div>

                      {/* View Shop Details Button */}
                      <Link
                        to={generateShopUrl(shop.name, shop.id)}
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                          display: "block",
                        }}
                      >
                        <button
                          className="btn btn-primary"
                          style={{
                            width: "100%",
                            padding: "0.4rem",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                          }}
                        >
                          View Shop Details
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Map */}
        <div 
          className="map-sticky-container"
          style={{ 
            height: isMapExpanded ? 'calc(100vh - 90px)' : 'calc(42vh - 2rem)', // Adjust for header height (70px + 20px padding)
            minHeight: isMapExpanded ? '600px' : '300px',
            position: 'sticky',
            top: 'calc(70px + 1rem)',
            zIndex: 10
          }}
        >
          <div style={{ 
            position: 'relative',
            height: '100%'
          }}>
            <div 
              ref={(el) => {
                mapRef.current = el
                if (el) {
                  setMapContainerReady(true)
                }
              }}
              style={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: '12px',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                position: 'relative',
                zIndex: 1,
                minWidth: '300px',
                minHeight: '300px',
                backgroundColor: 'transparent'
              }}
            />
            
            {/* Map Controls */}
            <div 
              className="map-controls"
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <button
                onClick={toggleMapSize}
                className="btn"
                style={{
                  width: '40px',
                  height: '40px',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                title={isMapExpanded ? 'Minimize Map' : 'Expand Map'}
              >
                {isMapExpanded ? <Minimize width={16} height={16} /> : <Expand width={16} height={16} />}
              </button>
            </div>

            {/* Map Instructions */}
            {showTip && (
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                right: '1rem',
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.875rem',
                color: 'var(--muted)',
                zIndex: 1000,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1rem' }}>💡</span>
                    <strong>Tip:</strong>
                  </div>
                  <button
                    onClick={() => setShowTip(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--muted)',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      padding: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--border)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    title="Close tip"
                  >
                    ×
                  </button>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem' }}>
                  Click anywhere on the map to pin a location. Shops will be sorted by distance from the pinned location.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Ad - Placed at the very bottom of the page - DISABLED */}
      {/* <div style={{ marginTop: '3rem', padding: '2rem 0', borderTop: '1px solid var(--border)' }}>
        <ResponsiveAd />
      </div> */}
      </main>
    </>
  )
}
