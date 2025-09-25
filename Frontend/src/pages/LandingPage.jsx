import { useEffect, useMemo, useState, useRef } from "react"
import { useSearchParams, Link } from "react-router-dom"
import Avatar from "../components/Avatar.jsx"
import SEOHead from "../components/SEOHead.jsx"
import SocialSharing from "../components/SocialSharing.jsx"
import FAQ from "../components/FAQ.jsx"
import SearchOptimization from "../components/SearchOptimization.jsx"
import { fetchPaginatedShopsWithRatings } from "../api/shops.js"
import { fetchProducts } from "../api/products.js"
import { searchServices } from "../api/services.js"
import { generateShopUrl, generateShopSlug } from "../utils/slugUtils.js"
import { InContentAd, ResponsiveAd } from "../components/GoogleAds.jsx"
import { ArrowUp } from 'lucide-react'
import { loadLeaflet, isLeafletLoaded, loadMarkerCluster } from "../utils/leafletLoader.js"
import { getImageUrl } from '../utils/imageUtils.js'
import { handleApiError } from '../utils/errorHandler.js'
import { SkeletonShopCard, SkeletonMap, SkeletonText } from "../components/Skeleton.jsx"
import ErrorDisplay from "../components/ErrorDisplay.jsx"
import { LoadingSpinner, LoadingCard, LoadingOverlay } from "../components/Loading.jsx"
import { useTutorial } from "../contexts/TutorialContext.jsx"
import { landingPageTutorialSteps } from "../components/TutorialSteps.js"
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
  const resultType = searchParams.get("type") || "shops"
  const [clientQuery, setClientQuery] = useState("")
  const [coords, setCoords] = useState(null)
  const [pinnedLocation, setPinnedLocation] = useState(null)
  const [shops, setShops] = useState([])
  const [products, setProducts] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mapInstance, setMapInstance] = useState(null)
  const [mapMarkers, setMapMarkers] = useState([])
  const clusterGroupRef = useRef(null)
  const [isMapExpanded, setIsMapExpanded] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)
  const [mapContainerReady, setMapContainerReady] = useState(false)
  const [showTip, setShowTip] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMoreShops, setHasMoreShops] = useState(true)
  const [hasMoreProducts, setHasMoreProducts] = useState(true)
  const [hasMoreServices, setHasMoreServices] = useState(true)
  const mapRef = useRef(null)
  const shopsLoadingRef = useRef(false)

  // Tutorial integration
  const { setTutorialSteps } = useTutorial()

  useEffect(() => {
    // Set tutorial steps for landing page
    setTutorialSteps(landingPageTutorialSteps)
    
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
    
    // Restore pinned location
    const savedPinnedLocation = localStorage.getItem('pinned_location')
    if (savedPinnedLocation) {
      setPinnedLocation(JSON.parse(savedPinnedLocation))
    }
  }, [setTutorialSteps])

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Save pinned location to localStorage whenever it changes
  useEffect(() => {
    if (pinnedLocation) {
      localStorage.setItem('pinned_location', JSON.stringify(pinnedLocation))
    } else {
      localStorage.removeItem('pinned_location')
    }
  }, [pinnedLocation])

  // Listen for storage events to sync with header clear action
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'pinned_location') {
        if (event.newValue === null) {
          // Pinned location was cleared by header
          setPinnedLocation(null)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  // Load data based on current result type - only on mount and when currentPage/resultType changes
  useEffect(() => {
    const loadData = async () => {
      // Prevent multiple simultaneous calls
      if (shopsLoadingRef.current) {
        return
      }
      
      shopsLoadingRef.current = true
      setLoading(true)
      setError('')
      
      try {
        console.log(`LandingPage: Fetching ${resultType} page ${currentPage} from API`)
        
        if (resultType === 'shops') {
          const response = await fetchPaginatedShopsWithRatings(currentPage, 50)
          const shopsData = extractShopsFromResponse(response)
          
          if (currentPage === 0) {
            setShops(shopsData)
          } else {
            setShops(prev => [...prev, ...shopsData])
          }
          
          if (response && response.content && response.content.length < 50) {
            setHasMoreShops(false)
          }
        } else if (resultType === 'products') {
          const response = await fetchProducts({ page: currentPage, size: 50 })
          const productsData = Array.isArray(response) ? response : (response?.content || [])
          
          if (currentPage === 0) {
            setProducts(productsData)
          } else {
            setProducts(prev => [...prev, ...productsData])
          }
          
          if (productsData.length < 50) {
            setHasMoreProducts(false)
          }
        } else {
          // services
          const response = await searchServices({ page: currentPage, size: 50 })
          const servicesData = Array.isArray(response) ? response : (response?.content || [])
          
          if (currentPage === 0) {
            setServices(servicesData)
          } else {
            setServices(prev => [...prev, ...servicesData])
          }
          
          if (servicesData.length < 50) {
            setHasMoreServices(false)
          }
        }
      } catch (err) {
        console.error(`Failed to fetch ${resultType}:`, err)
        const errorInfo = handleApiError(err)
        setError(errorInfo.message)
        if (currentPage === 0) {
          setShops([])
          setProducts([])
          setServices([])
        }
      } finally {
        setLoading(false)
        shopsLoadingRef.current = false
      }
    }

    loadData()
  }, [currentPage, resultType])

  // Reset pagination when result type changes
  useEffect(() => {
    setCurrentPage(0)
    setHasMoreShops(true)
    setHasMoreProducts(true)
    setHasMoreServices(true)
  }, [resultType])

  // Load more data function
  const loadMoreData = () => {
    if (!loading) {
      if ((resultType === 'shops' && hasMoreShops) ||
          (resultType === 'products' && hasMoreProducts) ||
          (resultType === 'services' && hasMoreServices)) {
        setCurrentPage(prev => prev + 1)
      }
    }
  }

  // Handle client-side search
  const handleSearchChange = (searchTerm) => {
    setClientQuery(searchTerm)
  }

  const sortedItems = useMemo(() => {
    let copy = []
    
    // Get the appropriate data based on result type
    if (resultType === 'shops') {
      copy = [...shops]
    } else if (resultType === 'products') {
      copy = [...products]
    } else {
      copy = [...services]
    }
    
    // Client-side filtering - comprehensive search across multiple fields
    if (clientQuery.trim()) {
      const searchTerm = clientQuery.toLowerCase().trim()
      copy = copy.filter(item => {
        if (resultType === 'shops') {
          return item.name.toLowerCase().includes(searchTerm) ||
            (item.description && item.description.toLowerCase().includes(searchTerm)) ||
            (item.addressLine && item.addressLine.toLowerCase().includes(searchTerm)) ||
            (item.category && item.category.toLowerCase().includes(searchTerm)) ||
            (item.phone && item.phone.toLowerCase().includes(searchTerm)) ||
            (item.email && item.email.toLowerCase().includes(searchTerm))
        } else if (resultType === 'products') {
          return item.name.toLowerCase().includes(searchTerm) ||
            (item.description && item.description.toLowerCase().includes(searchTerm)) ||
            (item.category && item.category.toLowerCase().includes(searchTerm)) ||
            (item.mainCategory && item.mainCategory.toLowerCase().includes(searchTerm)) ||
            (item.subcategory && item.subcategory.toLowerCase().includes(searchTerm))
        } else {
          // services
          return item.title.toLowerCase().includes(searchTerm) ||
            (item.description && item.description.toLowerCase().includes(searchTerm)) ||
            (item.category && item.category.toLowerCase().includes(searchTerm)) ||
            (item.mainCategory && item.mainCategory.toLowerCase().includes(searchTerm)) ||
            (item.subcategory && item.subcategory.toLowerCase().includes(searchTerm))
        }
      })
    }
    
    // Use pinned location for sorting if available, otherwise use user coords (only for shops)
    const referenceLocation = pinnedLocation || coords
    if (referenceLocation && resultType === 'shops') {
      copy.sort((a, b) => haversineDistanceKm(referenceLocation, a) - haversineDistanceKm(referenceLocation, b))
    }
    return copy
  }, [shops, products, services, coords, pinnedLocation, clientQuery, resultType])

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

        // Initialize marker cluster group
        loadMarkerCluster()
          .then(() => {
            try {
              if (!clusterGroupRef.current) {
                clusterGroupRef.current = L.markerClusterGroup({
                  disableClusteringAtZoom: 16,
                  spiderfyOnMaxZoom: true,
                  showCoverageOnHover: false,
                  maxClusterRadius: 50,
                  iconCreateFunction: function(cluster) {
                    const count = cluster.getChildCount()
                    // Size tiers for better visual hierarchy
                    const size = count >= 100 ? 52 : count >= 25 ? 46 : 40
                    const fontSize = count >= 100 ? 16 : count >= 25 ? 15 : 14
                    const ringColor = 'var(--card, #ffffff)'
                    const bg = 'var(--primary, #6366f1)'
                    const txt = '#ffffff'
                    const shadow = 'rgba(0,0,0,0.25)'
                    const html = `
                      <div style="
                        width: ${size}px;
                        height: ${size}px;
                        border-radius: 50%;
                        background: ${bg};
                        color: ${txt};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 6px 16px ${shadow};
                        border: 3px solid ${ringColor};
                        font-weight: 700;
                        font-family: inherit;
                        line-height: 1;
                        position: relative;
                      ">
                        <span style="font-size:${fontSize}px;">${count}</span>
                      </div>
                    `
                    return L.divIcon({
                      html,
                      className: 'cluster-marker',
                      iconSize: [size, size],
                      iconAnchor: [size/2, size/2]
                    })
                  }
                })
                map.addLayer(clusterGroupRef.current)
              }
            } catch (e) {
              console.warn('Failed to initialize marker cluster group', e)
            }
          })
          .catch((e) => console.warn('MarkerCluster plugin failed to load', e))

        // Add click handler to pin location
        map.on('click', (e) => {
          const { lat, lng } = e.latlng
          // Clear any existing pinned location and set the new one
          setPinnedLocation({ lat, lng })
        })

        setMapInstance(map)

        // Helper: schedule an invalidate once container has non-zero size
        const scheduleInvalidate = () => {
          let attempts = 20
          const tick = () => {
            if (!mapRef.current || !map) return
            const w = mapRef.current.offsetWidth
            const h = mapRef.current.offsetHeight
            if (w > 0 && h > 0) {
              try { map.invalidateSize(true) } catch {}
              return
            }
            if (attempts-- > 0) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }

        // Initial invalidate cycles
        ;[80, 180, 380].forEach((d) => setTimeout(() => { try { map.invalidateSize(true) } catch {} }, d))

        // ResizeObserver: container size changes
        if (mapRef.current && typeof ResizeObserver !== 'undefined') {
          const ro = new ResizeObserver(() => {
            scheduleInvalidate()
          })
          ro.observe(mapRef.current)
          map._resizeObserver = ro
        }

        // IntersectionObserver: when container becomes visible after being hidden
        if (mapRef.current && typeof IntersectionObserver !== 'undefined') {
          const io = new IntersectionObserver((entries) => {
            const entry = entries[0]
            if (entry && entry.isIntersecting) {
              scheduleInvalidate()
            }
          }, { root: null, threshold: 0.01 })
          io.observe(mapRef.current)
          map._intersectionObserver = io
        }

        // Window resize: debounce and invalidate
        let resizeTimer
        const onWinResize = () => {
          clearTimeout(resizeTimer)
          resizeTimer = setTimeout(() => scheduleInvalidate(), 120)
        }
        window.addEventListener('resize', onWinResize)
        map._onWinResize = onWinResize

        // CSS transition end on container (if layout animates)
        const onTransitionEnd = () => scheduleInvalidate()
        if (mapRef.current) {
          mapRef.current.addEventListener('transitionend', onTransitionEnd)
          map._onTransitionEnd = onTransitionEnd
        }

        // Watchdog: detect unhealthy state and recover
        const isVisible = () => {
          const el = mapRef.current
          if (!el) return false
          const rect = el.getBoundingClientRect()
          return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0
        }
        let unhealthyTicks = 0
        const watchdog = setInterval(() => {
          try {
            if (!mapRef.current || !map) return
            const hasTiles = map._container ? map._container.querySelectorAll('.leaflet-tile').length > 0 : false
            if (isVisible()) {
              if (!hasTiles || map._size.x === 0 || map._size.y === 0) {
                unhealthyTicks += 1
                scheduleInvalidate()
                if (unhealthyTicks >= 5) {
                  clearInterval(watchdog)
                  try { map.remove() } catch {}
                  setTimeout(initializeMap, 200)
                }
              } else {
                unhealthyTicks = 0
              }
            }
          } catch {}
        }, 1000)
        map._watchdog = watchdog

      } catch (err) {
        console.error('Error initializing map:', err)
        setTimeout(initializeMap, 1000)
      }
    }

    const timer = setTimeout(initializeMap, 200)
    
    return () => {
      clearTimeout(timer)
      if (mapInstance) {
        try {
          if (mapInstance._resizeObserver) { try { mapInstance._resizeObserver.disconnect() } catch {} }
          if (mapInstance._intersectionObserver) { try { mapInstance._intersectionObserver.disconnect() } catch {} }
          if (mapInstance._watchdog) { try { clearInterval(mapInstance._watchdog) } catch {} }
          if (mapInstance._onWinResize) { try { window.removeEventListener('resize', mapInstance._onWinResize) } catch {} }
          if (mapInstance._onTransitionEnd && mapRef.current) { try { mapRef.current.removeEventListener('transitionend', mapInstance._onTransitionEnd) } catch {} }
          // Remove cluster group
          if (clusterGroupRef.current) {
            try { mapInstance.removeLayer(clusterGroupRef.current) } catch {}
            clusterGroupRef.current = null
          }
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
      setIsMobile(window.innerWidth <= 1060)
    }

    window.addEventListener('resize', handleResize)
    // initialize value
    setIsMobile(window.innerWidth <= 1060)
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
    
    // Clear existing user/pinned markers and clustered shop markers
    mapMarkers.forEach(marker => { try { marker.remove() } catch {} })
    const newMarkers = [] // will track only non-clustered markers (user/pinned)
    if (clusterGroupRef.current && clusterGroupRef.current.clearLayers) {
      try { clusterGroupRef.current.clearLayers() } catch {}
    }

    // Add user location marker
    if (coords) {
      const userIcon = L.divIcon({
        className: 'user-marker',
        html: `
          <div style="
            width: 24px;
            height: 24px;
            background: var(--primary, #6366f1);
            border: 3px solid var(--card, #ffffff);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            color: #ffffff;
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
 
    // Ensure cluster group is available before adding shop markers
    const addShopMarkers = () => {
      if (!clusterGroupRef.current || !L.markerClusterGroup) {
        return
      }
      // Add shop markers to cluster group (only for shops)
      if (resultType === 'shops') {
        sortedItems.forEach((shop) => {
        if (shop.lat && shop.lng) {
          try {
            const logoUrl = shop.logoPath ? getImageUrl(shop.logoPath) : ''
            const shopIcon = L.divIcon({
              className: 'shop-marker',
              html: `
                <div style="position: relative; width: 40px; height: 40px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); overflow: hidden;">
                  ${logoUrl 
                    ? `<div style=\"position:absolute; top:0; left:0; right:0; bottom:0; background-image:url('${logoUrl}'); background-size:cover; background-position:center;\"></div>`
                    : '<div style=\"position:absolute; inset:0; background:#6366f1; display:flex; align-items:center; justify-content:center;\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"white\" stroke-width=\"2\"><path d=\"M3 9l1-5h16l1 5\"/><path d=\"M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z\"/><path d=\"M8 13h3v3H8z\"/></svg></div>'}
                </div>
              `,
              iconSize: [40, 40],
              iconAnchor: [20, 20]
            })

            const marker = L.marker([shop.lat, shop.lng], { icon: shopIcon })
              .bindPopup(`
                <div style="min-width: ${isMobile ? '280px' : '200px'}; max-width: ${isMobile ? '320px' : '250px'};">
                  <h4 style="margin: 0 0 0.5rem 0; color: #6366f1; font-size: ${isMobile ? '1rem' : '0.875rem'};">${shop.name}</h4>
                  ${shop.addressLine ? `<p style="margin: 0 0 0.5rem 0; font-size: ${isMobile ? '0.9rem' : '0.875rem'}; color: #666; line-height: 1.4;">${shop.addressLine}</p>` : ''}
                  <a href="/shops/${generateShopSlug(shop.name, shop.id)}" style="
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
                maxWidth: isMobile ? 320 : 250,
                className: isMobile ? 'mobile-popup' : '',
                closeButton: true,
                autoClose: false,
                closeOnClick: false,
                offset: isMobile ? [0, -10] : [0, 0]
              })

            clusterGroupRef.current.addLayer(marker)
          } catch (error) {
            console.error(`Error adding marker for shop ${shop.name}:`, error)
          }
        }
      })
      }
    }

    // If plugin not ready yet, attempt to load then add
    if (!clusterGroupRef.current || !L.markerClusterGroup) {
      loadMarkerCluster().then(() => {
        if (!clusterGroupRef.current) {
          try {
            clusterGroupRef.current = L.markerClusterGroup({
              disableClusteringAtZoom: 16,
              spiderfyOnMaxZoom: true,
              showCoverageOnHover: false,
              maxClusterRadius: 50,
              iconCreateFunction: function(cluster) {
                const count = cluster.getChildCount()
                const size = count >= 100 ? 52 : count >= 25 ? 46 : 40
                const fontSize = count >= 100 ? 16 : count >= 25 ? 15 : 14
                const ringColor = 'var(--card, #ffffff)'
                const bg = 'var(--primary, #6366f1)'
                const txt = '#ffffff'
                const shadow = 'rgba(0,0,0,0.25)'
                const html = `
                  <div style="
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    background: ${bg};
                    color: ${txt};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 6px 16px ${shadow};
                    border: 3px solid ${ringColor};
                    font-weight: 700;
                    font-family: inherit;
                    line-height: 1;
                    position: relative;
                  ">
                    <span style="font-size:${fontSize}px;">${count}</span>
                  </div>
                `
                return L.divIcon({
                  html,
                  className: 'cluster-marker',
                  iconSize: [size, size],
                  iconAnchor: [size/2, size/2]
                })
              }
            })
            mapInstance.addLayer(clusterGroupRef.current)
          } catch {}
        }
        addShopMarkers()

        // Fit bounds including clusters and non-cluster markers
        try {
          const layersForBounds = [clusterGroupRef.current, ...newMarkers]
          const group = L.featureGroup(layersForBounds)
          const bounds = group.getBounds()
          const hasSearchResults = clientQuery.trim().length > 0
          const paddedBounds = bounds.pad(hasSearchResults ? 0.02 : 0.1)
          mapInstance.fitBounds(paddedBounds, { maxZoom: hasSearchResults ? 15 : 13, animate: true })
        } catch (e) {
          const center = coords ? [coords.lat, coords.lng] : [10.3157, 123.8854]
          mapInstance.setView(center, 12)
        }
      }).catch(() => {
        // Fallback: no clustering, just proceed with markers directly on map (already handled earlier if needed)
      })
    } else {
      // Cluster group ready
      addShopMarkers()

      // Fit bounds including clusters and non-cluster markers
      try {
        const layersForBounds = [clusterGroupRef.current, ...newMarkers]
        const group = L.featureGroup(layersForBounds)
        const bounds = group.getBounds()
        const hasSearchResults = clientQuery.trim().length > 0
        const paddedBounds = bounds.pad(hasSearchResults ? 0.02 : 0.1)
        mapInstance.fitBounds(paddedBounds, { maxZoom: hasSearchResults ? 15 : 13, animate: true })
      } catch (e) {
        const center = coords ? [coords.lat, coords.lng] : [10.3157, 123.8854]
        mapInstance.setView(center, 12)
      }
    }
 
    setMapMarkers(newMarkers)
 
  }, [mapInstance, sortedItems, coords, pinnedLocation, resultType])

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
    // Clear from localStorage as well
    localStorage.removeItem('pinned_location')
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
          <section className="shops-section-header" style={{ marginBottom: "1.5rem" }}>
            <div className="shops-header-content">
              <div className="shops-title-section">
                <SkeletonText lines={1} height="1.5rem" style={{ marginBottom: "0.25rem" }} />
                <SkeletonText lines={1} height="0.9rem" style={{ width: "60%" }} />
              </div>
              <div className="shops-stats-section">
                <SkeletonText lines={1} height="1.25rem" style={{ width: "120px" }} />
              </div>
            </div>
          </section>

          {/* Search Bar */}
          <section style={{ marginBottom: "2rem" }}>
            <SkeletonText lines={1} height="3rem" style={{ borderRadius: "8px" }} />
          </section>

          {/* Main Content - Shops List and Map Side by Side */}
          <div className="landing-layout">
            {/* Left Side - Shops List */}
            <div>
              <div className="shops-section-header" style={{ marginBottom: "1rem" }}>
                <div className="shops-header-content">
                  <div className="shops-title-section">
                    <SkeletonText lines={1} height="1.2rem" style={{ marginBottom: "0.25rem" }} />
                    <SkeletonText lines={1} height="0.875rem" style={{ width: "40%" }} />
                  </div>
                </div>
              </div>
              <div className="shops-grid">
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonShopCard key={index} />
                ))}
              </div>
            </div>

            {/* Right Side - Map */}
            <div className="map-sticky-container" style={{ 
              height: 'calc(70vh - 2rem)',
              minHeight: '460px',
              position: 'sticky',
              top: 'calc(70px + 1rem)'
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
        title={`Explore Local ${resultType === 'products' ? 'Products' : resultType === 'services' ? 'Services' : 'Shops'}`}
        description={`Discover amazing local ${resultType} in your community. Find unique ${resultType === 'services' ? 'services' : 'products'}, fresh goods, and support local entrepreneurs on LocalsLocalMarket.`}
        keywords={`local ${resultType}, local businesses, community shopping, local products, neighborhood stores, shop local, local market`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": `Local ${resultType === 'products' ? 'Products' : resultType === 'services' ? 'Services' : 'Shops'}`,
          "description": `Discover local ${resultType} in your community`,
          "url": "https://localslocalmarket.com",
          "numberOfItems": sortedItems.length,
          "itemListElement": sortedItems.slice(0, 10).map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "LocalBusiness",
              "name": resultType === 'services' ? item.title : item.name,
              "description": item.description || `Local ${resultType.slice(0, -1)}: ${resultType === 'services' ? item.title : item.name}`,
              "url": resultType === 'shops' ? `https://localslocalmarket.com/shops/${generateShopSlug(item.name, item.id)}` : `https://localslocalmarket.com`,
              "address": (resultType === 'shops' && item.addressLine) ? {
                "@type": "PostalAddress",
                "streetAddress": item.addressLine
              } : undefined
            }
          }))
        }}
      />
      <main className="container landing-page-container">
        <div id="landing-hero-sentinel" style={{ height: 1 }} />
        {/* Header + Search in one row */}
        <section style={{ marginBottom: "2rem" }}>
          <div style={{ marginTop: '1rem' }} data-tutorial="search-bar">
            <SearchOptimization 
              onClearFilters={clearPinnedLocation} 
              onSearchChange={handleSearchChange}
              hasPinnedLocation={!!pinnedLocation}
              navigateOnSubmit={false}
            />
          </div>
        </section>

        {/* Main Content - Shops List and Map Side by Side */}
        <div className={`landing-layout ${isMapExpanded ? 'expanded' : ''}`}>
          {/* Left Side - Shops List */}
          <div>
            {sortedItems.length === 0 ? (
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
                <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>No {resultType} found</h3>
                <p className="muted" style={{ margin: 0 }}>
                  {query ? `No ${resultType} match "${query}"` : `No ${resultType} available yet`}
                </p>
              </div>
            ) : (
            <div>
                {/* Enhanced Page Header */}
                <div className="shops-section-header">
                  <div className="shops-header-content">
                    <div className="shops-title-section">
                      <h2 className="shops-main-title">Explore Local {resultType === 'products' ? 'Products' : resultType === 'services' ? 'Services' : 'Shops'}</h2>
                      <p className="shops-subtitle">Discover amazing {resultType} from all areas</p>
                      <div className="filter-info">
                        <span className="filter-label">
                          {clientQuery ? `Search results for "${clientQuery}"` : `All available ${resultType}`}
                        </span>
                      </div>
                    </div>
                    <div className="shops-stats-section">
                      <div className="shops-stats">
                        <span className="shops-count">{sortedItems.length} {resultType} found</span>
                      </div>
                    </div>
                  </div>
                </div>
              
                            <div className="shops-grid" data-tutorial="shop-cards">
                {sortedItems.map((item) => (
                  <div key={item.id} className="card" style={{ 
                    padding: 0, 
                    overflow: "hidden",
                    borderRadius: "16px",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                  onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                  onClick={() => {
                    if (resultType === 'shops') {
                      window.location.href = generateShopUrl(item.name, item.id)
                    } else if (resultType === 'products') {
                      // For now, just show product details in console. Could navigate to product page later
                      console.log('Product clicked:', item)
                    } else {
                      // Services - similar handling
                      console.log('Service clicked:', item)
                    }
                  }}
                  >
                    {/* Item Image */}
                    <div style={{ 
                      height: "160px", 
                      background: (() => {
                        if (resultType === 'products') {
                          return !item.imagePathsJson ? "linear-gradient(135deg, var(--surface) 0%, var(--card) 100%)" : "transparent"
                        } else if (resultType === 'services') {
                          return !item.imageUrl ? "linear-gradient(135deg, var(--surface) 0%, var(--card) 100%)" : "transparent"
                        } else {
                          return !item.coverPath ? "linear-gradient(135deg, var(--surface) 0%, var(--card) 100%)" : "transparent"
                        }
                      })(),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--muted)",
                      fontSize: "0.875rem",
                      position: "relative",
                      overflow: "hidden"
                    }}>
                      {(() => {
                        if (resultType === 'products' && item.imagePathsJson) {
                          try {
                            const images = JSON.parse(item.imagePathsJson)
                            const firstImage = Array.isArray(images) && images.length > 0 ? images[0] : null
                            return firstImage ? (
                              <img 
                                src={getImageUrl(firstImage)} 
                                alt={`${item.name} product`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  objectPosition: "center"
                                }}
                                onError={(e) => {
                                  console.error('Product image failed to load:', e.target.src)
                                  e.target.style.display = 'none'
                                }}
                              />
                            ) : null
                          } catch (e) {
                            return null
                          }
                        } else if (resultType === 'services' && item.imageUrl) {
                          return (
                            <img 
                              src={getImageUrl(item.imageUrl)} 
                              alt={`${item.title} service`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: "center"
                              }}
                              onError={(e) => {
                                console.error('Service image failed to load:', e.target.src)
                                e.target.style.display = 'none'
                              }}
                            />
                          )
                        } else if (resultType === 'shops' && item.coverPath) {
                          return (
                            <img 
                              src={getImageUrl(item.coverPath)} 
                              alt={`${item.name} shop view`}
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
                          )
                        }
                        return (
                          <div style={{ 
                            display: "flex", 
                            flexDirection: "column", 
                            alignItems: "center", 
                            gap: "0.5rem" 
                          }}>
                            <StoreIcon width={24} height={24} style={{ color: "var(--muted)" }} />
                            <span>{resultType === 'products' ? 'Product' : resultType === 'services' ? 'Service' : 'Shop'} View</span>
                          </div>
                        )
                      })()}
                    </div>

                    {/* Item Details */}
                    <div style={{ padding: "0.75rem", position: "relative" }}>
                      {/* Shop Logo Overlay - only for shops */}
                      {resultType === 'shops' && item.logoPath && (
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
                            src={getImageUrl(item.logoPath)} 
                            alt={`${item.name} logo`} 
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover"
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Item Name */}
                      <h3
                        style={{
                          margin: 0,
                          marginBottom: "0.375rem",
                          fontSize: "0.95rem",
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          marginLeft: (resultType === 'shops' && item.logoPath) ? "80px" : "0"
                        }}
                      >
                        {resultType === 'services' ? item.title : item.name}
                      </h3>
                      
                      {/* Location - only for shops */}
                      {resultType === 'shops' && item.addressLine && (
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
                          {item.addressLine}
                        </span>
                      </div>
                    )}

                      {/* Price - for products and services */}
                      {(resultType === 'products' || resultType === 'services') && item.price && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontSize: "0.9rem",
                            color: "var(--primary)",
                            fontWeight: 600,
                            marginBottom: "0.375rem",
                          }}
                        >
                          <span>₱{parseFloat(item.price).toFixed(2)}</span>
                        </div>
                      )}

                      {/* Rating - Display ratings if available (mainly for shops) */}
                      {resultType === 'shops' && (
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
                          <span style={{ fontWeight: 500 }}>
                            {item.averageRating && item.averageRating > 0 
                              ? item.averageRating.toFixed(1) 
                              : '--'}
                          </span>
                          <span>
                            {item.reviewCount && item.reviewCount > 0 
                              ? `(${item.reviewCount} reviews)` 
                              : '(No reviews yet)'}
                          </span>
                        </div>
                      )}

                      {/* Distance - only for shops */}
                      {resultType === 'shops' && (coords || pinnedLocation) && item.lat && item.lng && (
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
                            ~{haversineDistanceKm(pinnedLocation || coords, item).toFixed(1)} km away
                          </span>
                        </div>
                      )}

                      {/* Category Tags */}
                      <div style={{ display: "flex", gap: "0.375rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                        {item.category && <span className="pill" style={{ fontSize: "0.7rem", padding: "0.2rem 0.4rem" }}>#{item.category.toLowerCase()}</span>}
                        {item.mainCategory && <span className="pill" style={{ fontSize: "0.7rem", padding: "0.2rem 0.4rem" }}>#{item.mainCategory.toLowerCase()}</span>}
                        {/* Removed redundant shop name/location hashtag tag */}
                      </div>

                      {/* View Details Button */}
                      {resultType === 'shops' ? (
                        <Link
                          to={generateShopUrl(item.name, item.id)}
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
                      ) : (
                        <button
                          className="btn btn-primary"
                          style={{
                            width: "100%",
                            padding: "0.4rem",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (resultType === 'products') {
                              console.log('Product details:', item)
                            } else {
                              console.log('Service details:', item)
                            }
                          }}
                        >
                          View {resultType === 'products' ? 'Product' : 'Service'} Details
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Load More Button */}
                {((resultType === 'shops' && hasMoreShops) || 
                  (resultType === 'products' && hasMoreProducts) || 
                  (resultType === 'services' && hasMoreServices)) && (
                  <div style={{ 
                    gridColumn: '1 / -1', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    padding: '2rem 0' 
                  }}>
                    <button
                      onClick={loadMoreData}
                      disabled={loading}
                      className="btn btn-secondary"
                      style={{
                        padding: '0.75rem 2rem',
                        fontSize: '1rem',
                        fontWeight: 500,
                        borderRadius: '8px',
                        minWidth: '200px'
                      }}
                    >
                      {loading ? 'Loading...' : `Load More ${resultType === 'products' ? 'Products' : resultType === 'services' ? 'Services' : 'Shops'}`}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Map */}
        {!isMobile && (
        <div 
          className="map-sticky-container"
          data-tutorial="map-container"
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
              data-tutorial="map-controls"
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
      </main>
      
        {isMobile && (
          <button 
            className="floating-map-btn" 
            data-tutorial="mobile-map-btn"
            onClick={openMapModal} 
            title="Open map"
            style={{
              bottom: showBackToTop ? '5rem' : '1rem',
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
        )}

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
      

      {/* Bottom Ad - Placed at the very bottom of the page */}
      <div style={{ marginTop: '3rem', padding: '2rem 0', borderTop: '1px solid var(--border)' }}>
        <ResponsiveAd />
      </div>

      {showBackToTop && (
        <button className="back-to-top-btn" onClick={scrollToTop} title="Back to top" aria-label="Back to top">
          <ArrowUp size={18} aria-hidden />
        </button>
      )}
    </>
  )
}
