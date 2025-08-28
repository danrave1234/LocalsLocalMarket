// OpenStreetMap Configuration (Free Alternative to Google Maps)
// No API key required - completely free!

// Default coordinates for Cebu City
export const DEFAULT_LOCATION = {
  lat: 10.3157,
  lng: 123.8854
}

// Map configuration for Leaflet
export const MAP_CONFIG = {
  zoom: 15,
  maxZoom: 19,
  tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}

// Geocoding service configuration (Nominatim)
export const GEOCODING_CONFIG = {
  baseUrl: 'https://nominatim.openstreetmap.org',
  format: 'json',
  addressDetails: 1,
  acceptLanguage: 'en'
}
