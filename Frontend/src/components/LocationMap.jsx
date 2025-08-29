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
      // Cleanup
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
  }, [initialLat, initialLng])

  const handleLocationChange = async (lat, lng) => {
    try {
      // Use Nominatim (OpenStreetMap's geocoding service) for reverse geocoding
      // Try with higher zoom first, then fallback to lower zoom for broader area detection
      let response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en&zoom=18`
      )
      
      if (!response.ok) {
        throw new Error('Geocoding request failed')
      }

      let data = await response.json()
      
      // If no barangay found with high zoom, try with lower zoom to get broader area
      if (data.error || !data.address || (!data.address.suburb && !data.address.neighbourhood && !data.address.city_district)) {
        response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en&zoom=16`
        )
        
        if (response.ok) {
          data = await response.json()
        }
      }
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      if (data.error) {
        throw new Error(data.error)
      }

      // Extract address components
      let barangay = ''
      let city = ''
      let addressLine = ''

      // Parse address components with better Philippine address handling
      if (data.address) {
        // Try multiple fields for barangay detection
        barangay = data.address.suburb || 
                  data.address.neighbourhood || 
                  data.address.city_district || 
                  data.address.district || 
                  data.address.quarter || 
                  data.address.residential || 
                  ''

        // Try to find city
        city = data.address.city || 
               data.address.town || 
               data.address.municipality || 
               data.address.county || 
               ''

        // Build address line
        const addressParts = []
        if (data.address.road) addressParts.push(data.address.road)
        if (data.address.house_number) addressParts.push(data.address.house_number)
        if (data.address.suburb) addressParts.push(data.address.suburb)
        
        addressLine = addressParts.join(', ')
      }

      // Enhanced barangay detection from display name
      if (!barangay && data.display_name) {
        const parts = data.display_name.split(',')
        
        // Look for barangay patterns in the display name
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i].trim()
          const partLower = part.toLowerCase()
          
          // Check for barangay indicators
          if (partLower.includes('barangay') || 
              partLower.includes('brgy') || 
              partLower.includes('village') ||
              partLower.includes('sambag') ||
              partLower.includes('guadalupe') ||
              partLower.includes('lahug') ||
              partLower.includes('mabolo') ||
              partLower.includes('kamputhaw') ||
              partLower.includes('cogon') ||
              partLower.includes('zapatera') ||
              partLower.includes('santa cruz') ||
              partLower.includes('sun valley') ||
              partLower.includes('capitol site') ||
              partLower.includes('basak') ||
              partLower.includes('pahina') ||
              partLower.includes('pardo') ||
              partLower.includes('punta') ||
              partLower.includes('mambaling') ||
              partLower.includes('bulacao') ||
              partLower.includes('talamban') ||
              partLower.includes('banilad') ||
              partLower.includes('apas') ||
              partLower.includes('pit-os') ||
              partLower.includes('bacayan') ||
              partLower.includes('pulangbato') ||
              partLower.includes('san jose') ||
              partLower.includes('kalunasan') ||
              partLower.includes('sambag i') ||
              partLower.includes('sambag ii') ||
              partLower.includes('sambag 1') ||
              partLower.includes('sambag 2')) {
            barangay = part
            break
          }
        }
        
        // If still no barangay found, try to extract from address components
        if (!barangay && data.address) {
          // Check all address components for barangay-like names
          const addressValues = Object.values(data.address).filter(val => val && typeof val === 'string')
          for (const value of addressValues) {
            const valueLower = value.toLowerCase()
            if (valueLower.includes('sambag') ||
                valueLower.includes('guadalupe') ||
                valueLower.includes('lahug') ||
                valueLower.includes('mabolo') ||
                valueLower.includes('kamputhaw') ||
                valueLower.includes('cogon') ||
                valueLower.includes('zapatera') ||
                valueLower.includes('santa cruz') ||
                valueLower.includes('sun valley') ||
                valueLower.includes('capitol site') ||
                valueLower.includes('basak') ||
                valueLower.includes('pahina') ||
                valueLower.includes('pardo') ||
                valueLower.includes('punta') ||
                valueLower.includes('mambaling') ||
                valueLower.includes('bulacao') ||
                valueLower.includes('talamban') ||
                valueLower.includes('banilad') ||
                valueLower.includes('apas') ||
                valueLower.includes('pit-os') ||
                valueLower.includes('bacayan') ||
                valueLower.includes('pulangbato') ||
                valueLower.includes('san jose') ||
                valueLower.includes('kalunasan')) {
              barangay = value
              break
            }
          }
        }
      }

      // If still no barangay, try to extract from the first part of display name
      if (!barangay && data.display_name) {
        const firstPart = data.display_name.split(',')[0].trim()
        if (firstPart && firstPart.length > 0) {
          barangay = firstPart
        }
      }

      // Final fallback: if still no barangay, search for nearby barangays
      if (!barangay) {
        try {
          // Search for nearby barangays within a small radius
          const searchResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=barangay&lat=${lat}&lon=${lng}&radius=0.5&limit=5`
          )
          
          if (searchResponse.ok) {
            const searchData = await searchResponse.json()
            
            // Look for barangay names in the search results
            for (const result of searchData) {
              const displayName = result.display_name.toLowerCase()
              
              // Check for Cebu City barangay names
              const barangayNames = [
                'sambag', 'guadalupe', 'lahug', 'mabolo', 'kamputhaw',
                'cogon', 'zapatera', 'santa cruz', 'sun valley', 'capitol site',
                'basak', 'pahina', 'pardo', 'punta', 'mambaling',
                'bulacao', 'talamban', 'banilad', 'apas', 'pit-os',
                'bacayan', 'pulangbato', 'san jose', 'kalunasan'
              ]
              
              for (const barangayName of barangayNames) {
                if (displayName.includes(barangayName)) {
                  // Extract the actual barangay name from the result
                  const parts = result.display_name.split(',')
                  for (const part of parts) {
                    const partLower = part.trim().toLowerCase()
                    if (partLower.includes(barangayName)) {
                      barangay = part.trim()
                      break
                    }
                  }
                  if (barangay) break
                }
              }
              if (barangay) break
            }
          }
        } catch (searchErr) {
          console.log('Nearby barangay search failed:', searchErr)
        }
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
      // Still provide coordinates even if geocoding fails
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
            isInitializedRef.current = false
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
          border: '1px solid var(--border)'
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
