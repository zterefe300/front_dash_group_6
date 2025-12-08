import { API_BASE_URL } from '../../config';

export const restaurantService = {
  // Get all restaurants
  getAllRestaurants: async () => {
    const response = await fetch(`${API_BASE_URL}/restaurant`);
    if (!response.ok) {
      throw new Error('Failed to fetch restaurants');
    }
    return response.json();
  },
};
