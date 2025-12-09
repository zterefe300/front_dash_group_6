// Geoapify API service for geocoding and routing
const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY || 'YOUR_API_KEY_HERE';

export const geoapifyService = {
  /**
   * Geocode an address to get latitude and longitude
   * @param {string} address - Full address string
   * @returns {Promise<{lat: number, lon: number}>}
   */
  geocodeAddress: async (address) => {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${GEOAPIFY_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding failed');
      }
      
      const data = await response.json();
      
      if (!data.features || data.features.length === 0) {
        throw new Error('Address not found');
      }
      
      const [lon, lat] = data.features[0].geometry.coordinates;
      return { lat, lon };
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  },

  /**
   * Calculate route between two points and get estimated travel time
   * @param {object} origin - {lat: number, lon: number}
   * @param {object} destination - {lat: number, lon: number}
   * @param {string} mode - 'drive', 'bicycle', or 'walk' (default: 'drive')
   * @returns {Promise<{distance: number, time: number}>} distance in meters, time in seconds
   */
  calculateRoute: async (origin, destination, mode = 'drive') => {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/routing?waypoints=${origin.lat},${origin.lon}|${destination.lat},${destination.lon}&mode=${mode}&apiKey=${GEOAPIFY_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Routing calculation failed');
      }
      
      const data = await response.json();
      
      if (!data.features || data.features.length === 0) {
        throw new Error('Route not found');
      }
      
      const properties = data.features[0].properties;
      return {
        distance: properties.distance, // in meters
        time: properties.time, // in seconds
        mode: properties.mode
      };
    } catch (error) {
      console.error('Routing error:', error);
      throw error;
    }
  },

  /**
   * Get estimated delivery time between restaurant and delivery address
   * @param {string} restaurantAddress - Restaurant full address
   * @param {string} deliveryAddress - Delivery full address
   * @param {number} preparationTime - Time to prepare food in minutes (default: 15)
   * @returns {Promise<{estimatedTime: number, distance: number, travelTime: number}>}
   */
  getDeliveryEstimate: async (restaurantAddress, deliveryAddress, preparationTime = 15) => {
    try {
      // Geocode both addresses
      const [restaurantCoords, deliveryCoords] = await Promise.all([
        geoapifyService.geocodeAddress(restaurantAddress),
        geoapifyService.geocodeAddress(deliveryAddress)
      ]);

      // Calculate route
      const route = await geoapifyService.calculateRoute(restaurantCoords, deliveryCoords, 'drive');

      // Convert travel time from seconds to minutes
      const travelTimeMinutes = Math.ceil(route.time / 60);
      
      // Total estimated time = preparation time + travel time
      const totalEstimatedMinutes = preparationTime + travelTimeMinutes;

      return {
        estimatedTime: totalEstimatedMinutes, // total time in minutes
        distance: route.distance, // distance in meters
        travelTime: travelTimeMinutes, // just travel time in minutes
        preparationTime: preparationTime // preparation time in minutes
      };
    } catch (error) {
      console.error('Delivery estimate error:', error);
      // Return fallback estimate if API fails
      return {
        estimatedTime: 30, // default 30 minutes
        distance: 5000, // default 5km
        travelTime: 15,
        preparationTime: preparationTime,
        error: 'Using default estimate'
      };
    }
  },

  /**
   * Format address from address object
   * @param {object} address - Address object with street, city, state, zipCode
   * @returns {string} Formatted address string
   */
  formatAddress: (address) => {
    if (!address) return '';
    
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zipCode
    ].filter(Boolean);
    
    return parts.join(', ');
  }
};
