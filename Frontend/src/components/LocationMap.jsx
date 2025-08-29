import { useEffect, useRef, useState } from 'react'

export default function LocationMap({ onLocationSelect, initialLat = 10.3157, initialLng = 123.8854 }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)
  const isInitializedRef = useRef(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitializedRef.current) {
      return
    }

    // Load Leaflet CSS
    const loadLeafletCSS = () => {
      if (document.querySelector('link[href*="leaflet"]')) {
        return
      }
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
      link.crossOrigin = ''
      document.head.appendChild(link)
    }

    // Load Leaflet JavaScript
    const loadLeafletJS = () => {
      if (window.L) {
        initializeMap()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
      script.crossOrigin = ''
      script.onload = initializeMap
      script.onerror = () => {
        setError('Failed to load map library')
        setIsLoading(false)
      }
      document.head.appendChild(script)
    }

    const initializeMap = () => {
      try {
        const L = window.L
        if (!L) {
          setError('Map library not loaded')
          setIsLoading(false)
          return
        }

        // Check if container already has a map
        if (mapRef.current && mapRef.current._leaflet_id) {
          // Container already has a map, remove it first
          if (mapInstanceRef.current) {
            mapInstanceRef.current.remove()
          }
        }

        // Create map
        const map = L.map(mapRef.current).setView([initialLat, initialLng], 15)

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map)

        // Create custom marker icon
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              width: 32px;
              height: 32px;
              background: #6366f1;
              border: 2px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">
              <div style="
                width: 12px;
                height: 12px;
                background: white;
                border-radius: 50%;
              "></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        })

        // Create marker
        const marker = L.marker([initialLat, initialLng], {
          draggable: true,
          icon: customIcon
        }).addTo(map)

        mapInstanceRef.current = map
        markerRef.current = marker

        // Handle map click
        map.on('click', (event) => {
          const { lat, lng } = event.latlng
          marker.setLatLng([lat, lng])
          handleLocationChange(lat, lng)
        })

        // Handle marker drag
        marker.on('dragend', (event) => {
          const { lat, lng } = event.target.getLatLng()
          handleLocationChange(lat, lng)
        })

        setIsLoading(false)
        isInitializedRef.current = true
      } catch (err) {
        console.error('Error initializing map:', err)
        setError('Failed to initialize map')
        setIsLoading(false)
      }
    }

    loadLeafletCSS()
    loadLeafletJS()

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove()
        } catch (err) {
          console.log('Map already removed')
        }
        mapInstanceRef.current = null
      }
      

      
      isInitializedRef.current = false
    }
  }, [])

  // Update marker position if props change
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && typeof initialLat === 'number' && typeof initialLng === 'number') {
      try {
        markerRef.current.setLatLng([initialLat, initialLng])
        mapInstanceRef.current.panTo([initialLat, initialLng])
      } catch (_) {
        // ignore
      }
    }
  }, [initialLat, initialLng])

  const handleLocationChange = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en&zoom=18`
      )
      
      if (!response.ok) {
        throw new Error('Geocoding request failed')
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      // Extract address components
      let barangay = ''
      let city = ''
      let addressLine = ''

      if (data.address) {
        barangay = data.address.suburb || 
                  data.address.neighbourhood || 
                  data.address.city_district || 
                  data.address.district || 
                  data.address.quarter || 
                  data.address.residential || 
                  ''

        city = data.address.city || 
               data.address.town || 
               data.address.municipality || 
               data.address.county || 
               ''

        const addressParts = []
        if (data.address.road) addressParts.push(data.address.road)
        if (data.address.house_number) addressParts.push(data.address.house_number)
        if (data.address.suburb) addressParts.push(data.address.suburb)
        
        addressLine = addressParts.join(', ')
      }

      onLocationSelect({
        lat,
        lng,
        barangay,
        city,
        addressLine: data.display_name || '',
        fullAddress: data.display_name || ''
      })
    } catch (err) {
      console.error('Error in reverse geocoding:', err)
      onLocationSelect({
        lat,
        lng,
        barangay: '',
        city: '',
        addressLine: '',
        fullAddress: ''
      })
    }
  }

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], 15)
            markerRef.current.setLatLng([latitude, longitude])
            handleLocationChange(latitude, longitude)
          }
        },
        (error) => {
          console.error('Error getting current location:', error)
          setError('Unable to get your current location. Please select manually on the map.')
        }
      )
    } else {
      setError('Geolocation is not supported by this browser')
    }
  }

  if (error) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        backgroundColor: 'var(--error-bg)', 
        borderRadius: '8px',
        color: 'var(--error)'
      }}>
        <div style={{ marginBottom: '1rem' }}>🗺️</div>
        <div style={{ marginBottom: '0.5rem', fontWeight: '500' }}>Map Error</div>
        <div style={{ fontSize: '0.875rem' }}>{error}</div>
        <button 
          className="btn" 
          onClick={() => {
            setError('')
            setIsLoading(true)
            window.location.reload()
          }}
          style={{ marginTop: '1rem' }}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Map Container */}
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '400px', 
          borderRadius: '8px',
          border: '1px solid var(--border)',
          cursor: 'crosshair'
        }}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          color: 'white',
          zIndex: 1000
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '0.5rem' }}>🗺️</div>
            <div>Loading map...</div>
          </div>
        </div>
      )}

      {/* Current Location Button */}
      <button
        onClick={handleCurrentLocation}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: 'var(--primary)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          zIndex: 1000
        }}
        title="Use my current location"
      >
        📍
      </button>

      {/* Instructions */}
      <div style={{ 
        marginTop: '0.75rem', 
        fontSize: '0.875rem', 
        color: 'var(--muted)',
        textAlign: 'center'
      }}>
        Click on the map or drag the marker to set your shop location
      </div>
    </div>
  )
}
