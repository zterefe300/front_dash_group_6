import { API_BASE_URL } from '../../config';

// Demo images for fallback
const demoLogos = [
  'https://images.unsplash.com/photo-1653557659183-9701378e2c9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=80',
  'https://images.unsplash.com/photo-1663250714088-4f4657e584a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=80',
  'https://images.unsplash.com/photo-1625331725309-83e4f3c1373b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=80',
  'https://images.unsplash.com/photo-1695335753896-946f9297be0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=80'
];

const demoImages = [
  'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop'
];

const demoMenuImages = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop'
];

export const restaurantService = {
  // Get all restaurants
  getAllRestaurants: async () => {
    const response = await fetch(`${API_BASE_URL}/restaurant`);
    if (!response.ok) {
      throw new Error('Failed to fetch restaurants');
    }
    const data = await response.json();
    
    // Map backend response to frontend format with demo data for missing fields
    return data.map((restaurant, index) => ({
      id: restaurant.restaurantId?.toString() || '',
      name: restaurant.name || '',
      image: restaurant.pictureUrl || demoImages[index % demoImages.length],
      logo: restaurant.pictureUrl || demoLogos[index % demoLogos.length],
      cuisine: restaurant.cuisineType || 'Various',
      rating: 4.5,
      deliveryTime: '20-30 min',
      deliveryFee: 2.99,
      isOpen: restaurant.status === 'ACTIVE',
      priceRange: '$$',
      menu: []
    }));
  },

  // Get restaurant menu by ID
  getRestaurantMenu: async (restaurantId) => {
    const response = await fetch(`${API_BASE_URL}/restaurant/${restaurantId}/menu`);
    if (!response.ok) {
      throw new Error('Failed to fetch menu');
    }
    const data = await response.json();
    
    // Map backend response to frontend format with demo data
    return data.map((item, index) => ({
      id: item.menuItemId?.toString() || '',
      name: item.itemName || '',
      description: item.description || (item.itemName ? `Delicious ${item.itemName}` : 'A tasty menu item'),
      price: item.price || 0,
      image: item.pictureUrl || demoMenuImages[index % demoMenuImages.length],
      category: item.categoryName || 'Main Dishes'
    }));
  },
};
