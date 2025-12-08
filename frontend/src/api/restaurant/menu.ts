// Restaurant Menu API
import { API_BASE_URL, getAuthHeaders } from './config';
import type {
  MenuItem,
  MenuCategory,
  MenuItemCreatePayload,
  MenuItemUpdatePayload,
} from './types';

type MenuItemResponse = {
  menuItemId: number;
  categoryId: number;
  itemName: string;
  pictureUrl?: string | null;
  price: number;
  availability: string;
  description?: string | null;
  categoryName?: string;
};

type MenuCategoryResponse = {
  categoryId: number;
  restaurantId: number;
  categoryName: string;
};

const toMenuItem = (data: MenuItemResponse): MenuItem => ({
  id: data.menuItemId.toString(),
  name: data.itemName,
  description: data.description ?? '',
  price: Number(data.price),
  category: data.categoryName ?? '',
  isAvailable: data.availability?.toLowerCase() !== 'unavailable',
  imageUrl: data.pictureUrl ?? undefined,
});

const toMenuCategory = (data: MenuCategoryResponse): MenuCategory => ({
  id: data.categoryId.toString(),
  restaurantId: data.restaurantId.toString(),
  name: data.categoryName,
});

export const menuApi = {
  // ========== Menu Items ==========

  /**
   * Get all menu items
   * @param token - Auth token
   * @returns Array of menu items
   */
  getMenu: async (token: string, restaurantId: string): Promise<MenuItem[]> => {
    const response = await fetch(`${API_BASE_URL}/restaurant/${restaurantId}/menu`, {
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch menu');
    }

    const data: MenuItemResponse[] = await response.json();
    return data.map(toMenuItem);
  },

  /**
   * Create a new menu item
   * @param token - Auth token
   * @param data - Menu item data
   * @returns Created menu item
   */
  createMenuItem: async (
    token: string,
    restaurantId: string,
    data: MenuItemCreatePayload
  ): Promise<MenuItem> => {
    const response = await fetch(`${API_BASE_URL}/restaurant/${restaurantId}/menu`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create menu item');
    }

    const created: MenuItemResponse = await response.json();
    return toMenuItem(created);
  },

  /**
   * Update an existing menu item
   * @param token - Auth token
   * @param itemId - Menu item ID
   * @param data - Menu item data to update
   * @returns Updated menu item
   */
  updateMenuItem: async (
    token: string,
    restaurantId: string,
    itemId: string,
    data: MenuItemUpdatePayload
  ): Promise<MenuItem> => {
    const response = await fetch(`${API_BASE_URL}/restaurant/${restaurantId}/menu/${itemId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update menu item');
    }

    const updated: MenuItemResponse = await response.json();
    return toMenuItem(updated);
  },

  /**
   * Delete a menu item
   * @param token - Auth token
   * @param itemId - Menu item ID
   */
  deleteMenuItem: async (token: string, restaurantId: string, itemId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/restaurant/${restaurantId}/menu/${itemId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to delete menu item');
    }
  },

  /**
   * Toggle menu item availability
   * @param token - Auth token
   * @param itemId - Menu item ID
   * @param isAvailable - Availability status
   */
  toggleMenuItemAvailability: async (
    token: string,
    restaurantId: string,
    itemId: string,
    isAvailable: boolean
  ): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/restaurant/${restaurantId}/menu/${itemId}/availability`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ isAvailable }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to toggle menu item availability');
    }
  },

  // ========== Categories ==========

  /**
   * Get all menu categories
   * @param token - Auth token
   * @returns Array of categories
   */
  getCategories: async (token: string, restaurantId: string): Promise<MenuCategory[]> => {
    const response = await fetch(`${API_BASE_URL}/restaurant/${restaurantId}/menu/categories`, {
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const data: MenuCategoryResponse[] = await response.json();
    return data.map(toMenuCategory);
  },

  /**
   * Create a new menu category
   * @param token - Auth token
   * @param categoryName - Category name
   * @returns Created category
   */
  createCategory: async (
    token: string,
    restaurantId: string,
    categoryName: string
  ): Promise<MenuCategory> => {
    const response = await fetch(`${API_BASE_URL}/restaurant/${restaurantId}/menu/categories`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ categoryName }),
    });

    if (!response.ok) {
      throw new Error('Failed to create category');
    }

    const data: MenuCategoryResponse = await response.json();
    return toMenuCategory(data);
  },
};
