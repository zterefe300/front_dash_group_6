// Main Store Entry Point
// Combines Restaurant, Customer, and Employee stores

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Import all module slices
import {
  createRestaurantSlice,
  type RestaurantState,
} from './restaurantSlices';

import {
  createCustomerSlice,
  type CustomerState,
} from './customerSlices';

import {
  createEmployeeSlice,
  type EmployeeState,
} from './employeeSlices';

// Combined App State
export type AppState = RestaurantState & CustomerState & EmployeeState;

// Create the main store
export const useAppStore = create<AppState>()(
  persist(
    (...args) => ({
      // Restaurant slices
      ...createRestaurantSlice(...args),
      // Customer slices (TODO)
      ...createCustomerSlice(...args),
      // Employee slices (TODO)
      ...createEmployeeSlice(...args),
    }),
    {
      name: 'frontdash-storage',
      partialize: (state) => ({
        // Persist authentication state for all user types
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        user: state.user,
        isFirstLogin: state.isFirstLogin,
      }),
    }
  )
);

// Export default
export default useAppStore;

// Re-export all types for convenience
export type { RestaurantState, CustomerState, EmployeeState };

// Re-export individual slices for testing or advanced usage
export * from './restaurantSlices';
export * from './customerSlices';
export * from './employeeSlices';
