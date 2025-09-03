import { useEffect, useMemo, useState, useRef } from "react"
import { useSearchParams, Link } from "react-router-dom"
import Avatar from "../components/Avatar.jsx"
import SEOHead from "../components/SEOHead.jsx"
import SocialSharing from "../components/SocialSharing.jsx"
import FAQ from "../components/FAQ.jsx"
import SearchOptimization from "../components/SearchOptimization.jsx"
import { fetchAllShops } from "../api/shops.js"
import { generateShopUrl } from "../utils/slugUtils.js"
import { InContentAd, ResponsiveAd } from "../components/GoogleAds.jsx"
import { loadLeaflet, isLeafletLoaded } from "../utils/leafletLoader.js"
import { getImageUrl } from '../utils/imageUtils.js'
import { handleApiError } from '../utils/errorHandler.js'
import { SkeletonShopCard, SkeletonMap, SkeletonText } from "../components/Skeleton.jsx"
import ErrorDisplay from "../components/ErrorDisplay.jsx"
import { LoadingSpinner, LoadingCard, LoadingOverlay } from "../components/Loading.jsx"
import '../landing-page.css'

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
function UserIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.width || 20} height={props.height || 20} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
function PinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.width || 20} height={props.height || 20} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}
function StoreIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.width || 20} height={props.height || 20} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M2 3h20v14H2z" />
      <path d="M2 17h20v4H2z" />
      <path d="M6 7h4" />
      <path d="M6 11h4" />
      <path d="M14 7h4" />
      <path d="M14 11h4" />
    </svg>
  )
}
function LightbulbIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.width || 20} height={props.height || 20} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.5 2.5c-2.12-2.12-5.66-2.12-7.78 0C6.72 4.34 6 6.82 6 9.3c0 5.4 3.8 9.8 6 9.8 2.2 0 6-4.4 6-9.8 0-2.48-.72-4.96-1.72-6.8z" />
    </svg>
  )
}
function RefreshIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.width || 20} height={props.height || 20} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
      <path d="M3 21v-5h5"/>
    </svg>
  )
}
function MapIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width={props.width || 20} height={props.height || 20} fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z"/>
      <path d="M9 4v13"/>
      <path d="M15 7v13"/>
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

// Helper function to extract shops from paginated response

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
  const [clientQuery, setClientQuery] = useState("")
  const [coords, setCoords] = useState(null)
  const [pinnedLocation, setPinnedLocation] = useState(null)
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mapInstance, setMapInstance] = useState(null)
  const [mapMarkers, setMapMarkers] = useState([])
  const [isMapExpanded, setIsMapExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)
  const [mapContainerReady, setMapContainerReady] = useState(false)
  const [showTip, setShowTip] = useState(true)
  const mapRef = useRef(null)

  useEffect(() => {
    // Restore persisted tip visibility
    try {
      const tipClosed = localStorage.getItem('landing_map_tip_closed')
      if (tipClosed === '1') {
        setShowTip(false)
      }
    } catch (e) {
      // Ignore storage errors
    }
    const saved = localStorage.getItem("user_location")
    if (saved) setCoords(JSON.parse(saved))
  }, [])

  // Load shops only once on component mount
  useEffect(() => {
    const loadShops = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await fetchAllShops()
        const shopsData = extractShopsFromResponse(response)
        setShops(shopsData)
      } catch (err) {
        console.error('Failed to fetch shops:', err)
        const errorInfo = handleApiError(err)
        setError(errorInfo.message)
        setShops([])
      } finally {
        setLoading(false)
      }
    }

    loadShops()
  }, [])

  // Handle client-side search
  const handleSearchChange = (searchTerm) => {
    setClientQuery(searchTerm)
  }

  const sortedShops = useMemo(() => {
    let copy = [...shops]
    
    // Client-side filtering - comprehensive search across multiple fields
    if (clientQuery.trim()) {
      const searchTerm = clientQuery.toLowerCase().trim()
      copy = copy.filter(shop => 
        shop.name.toLowerCase().includes(searchTerm) ||
        (shop.description && shop.description.toLowerCase().includes(searchTerm)) ||
        (shop.addressLine && shop.addressLine.toLowerCase().includes(searchTerm)) ||
        (shop.category && shop.category.toLowerCase().includes(searchTerm)) ||
        (shop.phone && shop.phone.toLowerCase().includes(searchTerm)) ||
        (shop.email && shop.email.toLowerCase().includes(searchTerm))
      )
    }
    
    // Use pinned location for sorting if available, otherwise use user coords
    const referenceLocation = pinnedLocation || coords
    if (referenceLocation) {
      copy.sort((a, b) => haversineDistanceKm(referenceLocation, a) - haversineDistanceKm(referenceLocation, b))
    }
    return copy
  }, [shops, coords, pinnedLocation, clientQuery])

  // Load Leaflet CSS and JS
  useEffect(() => {
    const loadMap = async () => {
      try {
        await loadLeaflet()
        // Only initialize map once after Leaflet loads
        if (!mapInstance) {
          setTimeout(() => {
            setMapContainerReady(true)
          }, 300)
        }
      } catch (error) {
        console.error('Failed to load Leaflet:', error)
      }
    }
    loadMap()
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
          scrollWheelZoom: !isMobile, // Disable scroll wheel zoom on mobile for better UX
          doubleClickZoom: !isMobile, // Disable double-click zoom on mobile
          boxZoom: !isMobile, // Disable box zoom on mobile
          keyboard: true,
          // Mobile-optimized settings
          tap: true, // Enable tap events
          tapTolerance: 15, // Increase tap tolerance for mobile
          bounceAtZoomLimits: false, // Prevent bounce effect on mobile
          // Better mobile performance
          preferCanvas: isMobile, // Use canvas renderer on mobile for better performance
          zoomSnap: 0.5, // Snap to zoom levels for smoother mobile experience
          zoomDelta: 0.5 // Smaller zoom increments for mobile
        }).setView(center, 12) // Start with a balanced zoom level

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

        // Force map to invalidate size with multiple attempts
        const invalidateSize = () => {
          if (map && map.invalidateSize) {
            map.invalidateSize()
            // Try again after a short delay to ensure it works
            setTimeout(() => {
              if (map && map.invalidateSize) {
                map.invalidateSize()
              }
            }, 50)
          }
        }
        
        // Call invalidateSize multiple times to ensure it works
        setTimeout(invalidateSize, 100)
        setTimeout(invalidateSize, 300)
        setTimeout(invalidateSize, 500)

      } catch (err) {
        console.error('Error initializing map:', err)
        // Retry initialization after error
        setTimeout(initializeMap, 1000)
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

  // Handle window resize for map
  useEffect(() => {
    const handleResize = () => {
      if (mapInstance && mapInstance.invalidateSize) {
        setTimeout(() => {
          mapInstance.invalidateSize()
        }, 100)
      }
      setIsMobile(window.innerWidth <= 900)
    }

    window.addEventListener('resize', handleResize)
    // initialize value
    setIsMobile(window.innerWidth <= 900)
    return () => window.removeEventListener('resize', handleResize)
  }, [mapInstance])

  // Update map center when coords change (without reinitializing)
  useEffect(() => {
    if (mapInstance && coords) {
      // Use a more zoomed out view when updating center
      const currentZoom = mapInstance.getZoom()
      const newZoom = Math.min(currentZoom, 12) // Don't zoom in too much
      mapInstance.setView([coords.lat, coords.lng], newZoom)
    }
  }, [coords, mapInstance])

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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
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
                    onerror="this.style.display='none'; this.parentElement.innerHTML='<svg width=\\"20\\" height=\\"20\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" strokeWidth=\\"2\\"><path d=\\"M2 3h20v14H2z\\" /><path d=\\"M2 17h20v4H2z\\" /><path d=\\"M6 7h4\\" /><path d=\\"M6 11h4\\" /><path d=\\"M14 7h4\\" /><path d=\\"M14 11h4\\" /></svg>'; this.parentElement.style.background='#6366f1';"
                  />` : 
                  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h20v14H2z" /><path d="M2 17h20v4H2z" /><path d="M6 7h4" /><path d="M6 11h4" /><path d="M14 7h4" /><path d="M14 11h4" /></svg>'
                }
              </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
          })

          const marker = L.marker([shop.lat, shop.lng], { icon: shopIcon })
            .addTo(mapInstance)
            .bindPopup(`
              <div style="min-width: ${isMobile ? '280px' : '200px'}; max-width: ${isMobile ? '320px' : '250px'};">
                <h4 style="margin: 0 0 0.5rem 0; color: #6366f1; font-size: ${isMobile ? '1rem' : '0.875rem'};">${shop.name}</h4>
                ${shop.addressLine ? `<p style="margin: 0 0 0.5rem 0; font-size: ${isMobile ? '0.9rem' : '0.875rem'}; color: #666; line-height: 1.4;">${shop.addressLine}</p>` : ''}
                <a href="/shops/${shop.id}" style="
                  display: inline-block;
                  background: #6366f1;
                  color: white;
                  padding: ${isMobile ? '0.75rem 1.25rem' : '0.5rem 1rem'};
                  text-decoration: none;
                  border-radius: ${isMobile ? '8px' : '6px'};
                  font-size: ${isMobile ? '0.9rem' : '0.875rem'};
                  font-weight: 500;
                  text-align: center;
                  width: ${isMobile ? '100%' : 'auto'};
                  box-sizing: border-box;
                  transition: background-color 0.2s;
                " onmouseover="this.style.background='#4f46e5'" onmouseout="this.style.background='#6366f1'">View Shop</a>
              </div>
            `, {
              // Mobile-optimized popup options
              maxWidth: isMobile ? 320 : 250,
              className: isMobile ? 'mobile-popup' : '',
              closeButton: true,
              autoClose: false,
              closeOnClick: false,
              // Better mobile positioning
              offset: isMobile ? [0, -10] : [0, 0]
            })
          
          newMarkers.push(marker)
        } catch (error) {
          console.error(`Error adding marker for shop ${shop.name}:`, error)
        }
      }
    })

    setMapMarkers(newMarkers)

    // Fit bounds to show all markers with better zoom level
    if (newMarkers.length > 0) {
      try {
        const group = L.featureGroup(newMarkers)
        const bounds = group.getBounds()
        
        // Check if we have search results (filtered shops)
        const hasSearchResults = clientQuery.trim().length > 0
        
                  if (hasSearchResults) {
            // For search results, show a closer view with less padding
            const paddedBounds = bounds.pad(0.02) // Very minimal padding for search results
            mapInstance.fitBounds(paddedBounds, {
              maxZoom: 15, // Allow even closer zoom for search results
              animate: true
            })
          } else {
            // For all shops, use moderate padding
            const paddedBounds = bounds.pad(0.1)
            mapInstance.fitBounds(paddedBounds, {
              maxZoom: 13, // Good detail for browsing all shops
              animate: true
            })
          }
      } catch (error) {
        console.error('Error fitting map bounds:', error)
        // Fallback: set a default view if bounds fitting fails
        const center = coords ? [coords.lat, coords.lng] : [10.3157, 123.8854]
        mapInstance.setView(center, 12)
      }
    } else {
      // Set default view if no markers
      const center = coords ? [coords.lat, coords.lng] : [10.3157, 123.8854]
      mapInstance.setView(center, 12)
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

  const openMapModal = () => {
    setIsMapModalOpen(true)
    setTimeout(() => {
      if (mapInstance) mapInstance.invalidateSize()
    }, 250)
  }
  const closeMapModal = () => {
    setIsMapModalOpen(false)
    setTimeout(() => {
      if (mapInstance) mapInstance.invalidateSize()
    }, 250)
  }

  const clearPinnedLocation = () => {
    setPinnedLocation(null)
  }

  const forceMapRefresh = () => {
    if (mapInstance) {
      try {
        mapInstance.remove()
      } catch (error) {
        console.log('Map already removed')
      }
      setMapInstance(null)
    }
    // Only refresh if map is not already ready
    if (!mapContainerReady) {
      setMapContainerReady(true)
    }
  }

  if (loading) {
    return (
      <>
        <SEOHead 
          title="Explore Local Shops"
          description="Discover amazing local shops and businesses in your community. Find unique products, fresh goods, and support local entrepreneurs on LocalsLocalMarket."
          keywords="local shops, local businesses, community shopping, local products, neighborhood stores, shop local, local market"
        />
        <main className="container landing-page-container">
          {/* Header */}
          <section style={{ marginBottom: "2rem" }}>
            <SkeletonText lines={1} height="1.5rem" style={{ marginBottom: "0.5rem" }} />
            <SkeletonText lines={1} height="1rem" style={{ width: "60%" }} />
          </section>

          {/* Search Bar */}
          <section style={{ marginBottom: "2rem" }}>
            <SkeletonText lines={1} height="3rem" style={{ borderRadius: "8px" }} />
          </section>

          {/* Main Content - Shops List and Map Side by Side */}
          <div className="landing-layout">
            {/* Left Side - Shops List */}
            <div>
              <div style={{ marginBottom: "1rem" }}>
                <SkeletonText lines={1} height="1.2rem" style={{ marginBottom: "0.25rem" }} />
                <SkeletonText lines={1} height="0.875rem" style={{ width: "40%" }} />
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: "1rem",
              }}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonShopCard key={index} />
                ))}
              </div>
            </div>

            {/* Right Side - Map */}
            <div style={{ 
              height: 'calc(60vh - 2rem)', // Increased from 42vh to 60vh for taller map
              minHeight: '400px', // Increased minHeight from 300px to 400px
              position: 'sticky',
              top: 'calc(70px + 1rem)',
              zIndex: 10
            }}>
              <SkeletonMap style={{ height: '100%' }} />
            </div>
          </div>
        </main>
      </>
    )
  }

  if (error) {
    return (
      <>
        <SEOHead 
          title="Error - LocalsLocalMarket"
          description="We encountered an issue loading the shops. Please try again."
        />
        <main className="container landing-page-container" style={{ padding: '2rem' }}>
          <ErrorDisplay 
            error={error}
            title="Unable to Load Shops"
          />
        </main>
      </>
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
      <main className="container landing-page-container">
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
        <SearchOptimization 
          onClearFilters={clearPinnedLocation} 
          onSearchChange={handleSearchChange}
        />
      </section>

      {/* Main Content - Shops List and Map Side by Side */}
      <div className={`landing-layout ${isMapExpanded ? 'expanded' : ''}`}>
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
              <div style={{ marginBottom: '1rem' }}>
                <StoreIcon width={48} height={48} style={{ color: "var(--muted)" }} />
              </div>
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
                    {clientQuery ? `Showing results for "${clientQuery}"` : 'All available shops'}
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


              
              <div className="shops-grid">
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
                          <StoreIcon width={24} height={24} style={{ color: "var(--muted)" }} />
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
        {!isMobile && (
        <div 
          className="map-sticky-container"
          style={{ 
            height: isMapExpanded ? 'calc(100vh - 90px)' : 'calc(60vh - 2rem)', // Increased from 42vh to 60vh for taller map
            minHeight: isMapExpanded ? '600px' : '400px', // Increased minHeight from 300px to 400px
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
                  width: isMobile ? '48px' : '40px', // Larger touch target on mobile
                  height: isMobile ? '48px' : '40px',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: isMobile ? '12px' : '8px', // Larger radius on mobile
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  // Mobile-optimized touch feedback
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent'
                }}
                title={isMapExpanded ? 'Minimize Map' : 'Expand Map'}
              >
                {isMapExpanded ? <Minimize width={isMobile ? 20 : 16} height={isMobile ? 20 : 16} /> : <Expand width={isMobile ? 20 : 16} height={isMobile ? 20 : 16} />}
              </button>
              
              <button
                onClick={forceMapRefresh}
                className="btn"
                style={{
                  width: isMobile ? '48px' : '40px', // Larger touch target on mobile
                  height: isMobile ? '48px' : '40px',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: isMobile ? '12px' : '8px', // Larger radius on mobile
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  // Mobile-optimized touch feedback
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent'
                }}
                title="Refresh Map"
              >
                <RefreshIcon width={isMobile ? 20 : 16} height={isMobile ? 20 : 16} />
              </button>
            </div>

            {/* Map Instructions */}
            {showTip && (
              <div 
                className={isMobile ? 'map-tip mobile-tip' : 'map-tip'}
                style={{
                  position: 'absolute',
                  bottom: isMobile ? '0.5rem' : '1rem',
                  left: isMobile ? '0.5rem' : '1rem',
                  right: isMobile ? '0.5rem' : '1rem',
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: isMobile ? '12px' : '8px',
                  padding: isMobile ? '0.5rem' : '0.75rem',
                  fontSize: isMobile ? '0.8rem' : '0.875rem',
                  color: 'var(--muted)',
                  zIndex: 1000,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <LightbulbIcon width={16} height={16} style={{ color: "var(--muted)" }} />
                  <strong>Tip:</strong>
                </div>
                  <button
                    onClick={() => {
                      setShowTip(false)
                      try {
                        localStorage.setItem('landing_map_tip_closed', '1')
                      } catch (e) {
                        // Ignore storage errors
                      }
                    }}
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
        )}
      </div>

      <>
        <button 
          className="floating-map-btn" 
          onClick={openMapModal} 
          title="Open map"
          style={{
            // Mobile-optimized touch target
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            // Prevent text selection on mobile
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}
        >
          <MapIcon width="20" height="20" />
        </button>

        {isMapModalOpen && (
          <div className="map-modal-overlay" onClick={closeMapModal}>
            <div className="map-modal" onClick={(e) => e.stopPropagation()}>
              <div className="map-modal-header">
                <span>Map</span>
                <button onClick={closeMapModal} className="map-modal-close">×</button>
              </div>
              <div className="map-modal-body">
                <div 
                  ref={(el) => {
                    mapRef.current = el
                    if (el) setMapContainerReady(true)
                  }}
                  style={{ width: '100%', height: '100%', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}
                />
              </div>
            </div>
          </div>
        )}
      </>

      {/* Bottom Ad - Placed at the very bottom of the page */}
      <div style={{ marginTop: '3rem', padding: '2rem 0', borderTop: '1px solid var(--border)' }}>
        <ResponsiveAd />
      </div>
      </main>
    </>
  )
}
