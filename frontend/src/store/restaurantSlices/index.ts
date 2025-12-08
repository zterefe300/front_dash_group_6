// Restaurant Slices - Export all restaurant-related slices

import { StateCreator } from 'zustand';

// Import and export all restaurant slices
import { createAuthSlice, type AuthState } from './authSlice';
import { createRegistrationSlice, type RegistrationState } from './registrationSlice';
import { createProfileSlice, type ProfileState } from './profileSlice';
import { createMenuSlice, type MenuState } from './menuSlice';
import { createOperatingHoursSlice, type OperatingHoursState } from './operatingHoursSlice';
import { createPasswordSlice, type PasswordState } from './passwordSlice';
import { createWithdrawalSlice, type WithdrawalState } from './withdrawalSlice';

// Re-export all slices
export {
  createAuthSlice,
  createRegistrationSlice,
  createProfileSlice,
  createMenuSlice,
  createOperatingHoursSlice,
  createPasswordSlice,
  createWithdrawalSlice,
};

// Re-export all types
export type {
  AuthState,
  RegistrationState,
  ProfileState,
  MenuState,
  OperatingHoursState,
  PasswordState,
  WithdrawalState,
};

// Combined Restaurant State Type
export type RestaurantState = AuthState &
  RegistrationState &
  ProfileState &
  MenuState &
  OperatingHoursState &
  PasswordState &
  WithdrawalState;

// Create combined restaurant slice
export const createRestaurantSlice: StateCreator<RestaurantState> = (...args) => ({
  ...createAuthSlice(...args),
  ...createRegistrationSlice(...args),
  ...createProfileSlice(...args),
  ...createMenuSlice(...args),
  ...createOperatingHoursSlice(...args),
  ...createPasswordSlice(...args),
  ...createWithdrawalSlice(...args),
});
