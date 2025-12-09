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

// Helper function to check if restaurant is currently open based on operating hours
const isRestaurantOpen = (operatingHours) => {
  if (!operatingHours || operatingHours.length === 0) {
    return false; // If no hours provided, assume closed
  }

  const now = new Date();
  const currentDay = now.toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
  // Format time as HH:MM:SS to match database format
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const currentTime = `${hours}:${minutes}:${seconds}`;

  console.log('Checking restaurant hours:', { currentDay, currentTime, operatingHours });

  // Find today's operating hours - check both uppercase and original case
  let todayHours = operatingHours.find(hour => hour.weekDay === currentDay);
  
  // If not found, try case-insensitive comparison
  if (!todayHours) {
    todayHours = operatingHours.find(hour => 
      hour.weekDay && hour.weekDay.toUpperCase() === currentDay
    );
  }
  
  if (!todayHours) {
    console.log('No hours found for today:', currentDay, 'Available days:', operatingHours.map(h => h.weekDay));
    return false; // Restaurant is closed today
  }

  console.log('Today\'s hours:', todayHours);

  // Check if restaurant is closed (null open/close times)
  if (!todayHours.openTime || !todayHours.closeTime) {
    console.log('Restaurant is closed today (null times)');
    return false;
  }

  // Normalize closeTime: treat "24:00" as "23:59:59" for comparison
  let closeTime = todayHours.closeTime;
  if (closeTime.startsWith('24:00')) {
    closeTime = '23:59:59';
  }

  // Compare current time with opening and closing times
  const isOpen = currentTime >= todayHours.openTime && currentTime <= closeTime;
  console.log('Is restaurant open?', isOpen, { currentTime, openTime: todayHours.openTime, closeTime: closeTime, originalCloseTime: todayHours.closeTime });
  
  return isOpen;
};

export const restaurantService = {
  // Get all restaurants with address information
  getAllRestaurants: async () => {
    const response = await fetch(`${API_BASE_URL}/restaurant/with-address`);
    if (!response.ok) {
      throw new Error('Failed to fetch restaurants');
    }
    const data = await response.json();
    
    // Filter out restaurants that are not ACTIVE (only show accepted restaurants)
    const activeRestaurants = data.filter(restaurant => restaurant.status === 'ACTIVE');
    
    // Fetch operating hours for all restaurants and determine if they're open
    const restaurantsWithHours = await Promise.all(
      activeRestaurants.map(async (restaurant, index) => {
        let isOpen = restaurant.status === 'ACTIVE'; // Default to ACTIVE status
        
        try {
          // Fetch operating hours for this restaurant with timeout
          const hoursResponse = await Promise.race([
            fetch(`${API_BASE_URL}/restaurant/${restaurant.restaurantId}/hours`),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
          ]);
          if (hoursResponse.ok) {
            const operatingHours = await hoursResponse.json();
            console.log(`Fetched hours for restaurant ${restaurant.restaurantId}:`, operatingHours);
            
            // If no operating hours are set, show as open (based on ACTIVE status only)
            if (!operatingHours || operatingHours.length === 0) {
              console.log(`No operating hours set for ${restaurant.name}, using status only`);
              isOpen = restaurant.status === 'ACTIVE';
            } else {
              const hoursCheck = isRestaurantOpen(operatingHours);
              console.log(`Hours check result for ${restaurant.name}:`, hoursCheck);
              isOpen = restaurant.status === 'ACTIVE' && hoursCheck;
            }
          } else {
            console.warn(`Failed to fetch hours for restaurant ${restaurant.restaurantId}, status: ${hoursResponse.status}`);
          }
        } catch (error) {
          console.warn(`Could not fetch hours for restaurant ${restaurant.restaurantId}, using status only:`, error.message);
          // Keep default isOpen value based on status
        }
        
        console.log(`Final isOpen status for ${restaurant.name}:`, isOpen);
        
        // Format address if available from nested address object
        let address = '';
        let fullAddress = null;
        if (restaurant.address) {
          const parts = [
            restaurant.address.bldg,
            restaurant.address.streetAddress,
            restaurant.address.city,
            restaurant.address.state,
            restaurant.address.zipCode
          ].filter(Boolean);
          address = parts.join(', ');
          fullAddress = restaurant.address;
        }
        
        return {
          id: restaurant.restaurantId?.toString() || '',
          name: restaurant.name || '',
          image: restaurant.pictureUrl || demoImages[index % demoImages.length],
          logo: restaurant.pictureUrl || demoLogos[index % demoLogos.length],
          rating: 4.5,
          deliveryTime: '20-30 min',
          deliveryFee: 2.99,
          isOpen: isOpen,
          priceRange: '$$',
          menu: [],
          address: address,
          fullAddress: fullAddress, // Include the full address object for delivery time calculations
          phoneNumber: restaurant.phoneNumber || ''
        };
      })
    );
    
    return restaurantsWithHours;
  },

  // Get operating hours for a restaurant
  getOperatingHours: async (restaurantId) => {
    const response = await fetch(`${API_BASE_URL}/restaurant/${restaurantId}/hours`);
    if (!response.ok) {
      throw new Error('Failed to fetch operating hours');
    }
    return await response.json();
  },

  // Check if a specific restaurant is currently open
  checkIfOpen: async (restaurantId) => {
    try {
      const operatingHours = await restaurantService.getOperatingHours(restaurantId);
      return isRestaurantOpen(operatingHours);
    } catch (error) {
      console.error('Failed to check restaurant hours:', error);
      return false;
    }
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
