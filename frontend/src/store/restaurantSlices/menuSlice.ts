// Menu Slice - Restaurant Menu State
import { StateCreator } from 'zustand';
import { menuApi } from '@/api/restaurant/menu';
import type {
  MenuItem,
  MenuCategory,
  MenuItemCreatePayload,
  MenuItemUpdatePayload,
} from '@/api/restaurant';

export interface MenuState {
  // State
  menu: MenuItem[];
  categories: MenuCategory[];
  isMenuLoading: boolean;
  isMenuSaving: boolean;
  menuError: string | null;

  // Actions
  fetchMenu: (token: string, restaurantId: string) => Promise<void>;
  fetchCategories: (token: string, restaurantId: string) => Promise<void>;
  createMenuItem: (token: string, restaurantId: string, data: MenuItemCreatePayload) => Promise<void>;
  updateMenuItem: (
    token: string,
    restaurantId: string,
    itemId: string,
    data: MenuItemUpdatePayload
  ) => Promise<void>;
  deleteMenuItem: (token: string, restaurantId: string, itemId: string) => Promise<void>;
  toggleMenuItemAvailability: (
    token: string,
    restaurantId: string,
    itemId: string,
    isAvailable: boolean
  ) => Promise<void>;
  createCategory: (token: string, restaurantId: string, categoryName: string) => Promise<void>;
  clearMenuError: () => void;
}

export const createMenuSlice: StateCreator<MenuState> = (set) => ({
  // Initial State
  menu: [],
  categories: [],
  isMenuLoading: false,
  isMenuSaving: false,
  menuError: null,

  // Actions
  fetchMenu: async (token: string, restaurantId: string) => {
    if (!token) throw new Error('Not authenticated');
    if (!restaurantId) throw new Error('Restaurant not selected');

    set({ isMenuLoading: true, menuError: null });
    try {
      const menu = await menuApi.getMenu(token, restaurantId);
      set({ menu, isMenuLoading: false });
    } catch (error) {
      set({
        isMenuLoading: false,
        menuError: error instanceof Error ? error.message : 'Failed to fetch menu',
      });
      throw error;
    }
  },

  fetchCategories: async (token: string, restaurantId: string) => {
    if (!token) throw new Error('Not authenticated');
    if (!restaurantId) throw new Error('Restaurant not selected');

    try {
      const categories = await menuApi.getCategories(token, restaurantId);
      set({ categories });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },

  createMenuItem: async (token: string, restaurantId: string, data: MenuItemCreatePayload) => {
    if (!token) throw new Error('Not authenticated');
    if (!restaurantId) throw new Error('Restaurant not selected');

    set({ isMenuSaving: true, menuError: null });
    try {
      const newItem = await menuApi.createMenuItem(token, restaurantId, data);
      set((state) => ({
        menu: [...state.menu, newItem],
        isMenuSaving: false,
      }));
    } catch (error) {
      set({
        isMenuSaving: false,
        menuError: error instanceof Error ? error.message : 'Failed to create menu item',
      });
      throw error;
    }
  },

  updateMenuItem: async (
    token: string,
    restaurantId: string,
    itemId: string,
    data: MenuItemUpdatePayload
  ) => {
    if (!token) throw new Error('Not authenticated');
    if (!restaurantId) throw new Error('Restaurant not selected');

    set({ isMenuSaving: true, menuError: null });
    try {
      const updatedItem = await menuApi.updateMenuItem(token, restaurantId, itemId, data);
      set((state) => ({
        menu: state.menu.map((item) => (item.id === itemId ? updatedItem : item)),
        isMenuSaving: false,
      }));
    } catch (error) {
      set({
        isMenuSaving: false,
        menuError: error instanceof Error ? error.message : 'Failed to update menu item',
      });
      throw error;
    }
  },

  deleteMenuItem: async (token: string, restaurantId: string, itemId: string) => {
    if (!token) throw new Error('Not authenticated');
    if (!restaurantId) throw new Error('Restaurant not selected');

    set({ isMenuSaving: true, menuError: null });
    try {
      await menuApi.deleteMenuItem(token, restaurantId, itemId);
      set((state) => ({
        menu: state.menu.filter((item) => item.id !== itemId),
        isMenuSaving: false,
      }));
    } catch (error) {
      set({
        isMenuSaving: false,
        menuError: error instanceof Error ? error.message : 'Failed to delete menu item',
      });
      throw error;
    }
  },

  toggleMenuItemAvailability: async (
    token: string,
    restaurantId: string,
    itemId: string,
    isAvailable: boolean
  ) => {
    if (!token) throw new Error('Not authenticated');
    if (!restaurantId) throw new Error('Restaurant not selected');

    try {
      await menuApi.toggleMenuItemAvailability(token, restaurantId, itemId, isAvailable);
      set((state) => ({
        menu: state.menu.map((item) =>
          item.id === itemId ? { ...item, isAvailable } : item
        ),
      }));
    } catch (error) {
      throw error;
    }
  },

  createCategory: async (token: string, restaurantId: string, categoryName: string) => {
    if (!token) throw new Error('Not authenticated');
    if (!restaurantId) throw new Error('Restaurant not selected');

    try {
      const newCategory = await menuApi.createCategory(token, restaurantId, categoryName);
      set((state) => ({
        categories: [...state.categories, newCategory],
      }));
    } catch (error) {
      throw error;
    }
  },

  clearMenuError: () => {
    set({ menuError: null });
  },
});
