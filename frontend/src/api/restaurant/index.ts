// Restaurant API - Main Entry Point
// Export all restaurant API modules and types

// Export all types
export * from './types';

// Export configuration
export * from './config';

// Export individual API modules
export * from './auth';
export * from './registration';
export * from './profile';
export * from './address';
export * from './menu';
export * from './operating-hours';
export * from './withdrawal';

// Combined API object for convenience (backward compatibility)
import { authApi } from './auth';
import { registrationApi } from './registration';
import { profileApi } from './profile';
import { addressApi } from './address';
import { menuApi } from './menu';
import { operatingHoursApi } from './operating-hours';
import { withdrawalApi } from './withdrawal';

export const restaurantApi = {
  // Auth
  login: authApi.login,
  logout: authApi.logout,
  changePassword: authApi.changePassword,

  // Registration
  register: registrationApi.register,

  // Profile
  getProfile: profileApi.getProfile,
  updateProfile: profileApi.updateProfile,
  updateContact: profileApi.updateContact,

  // Address
  updateAddress: addressApi.updateAddress,

  // Menu
  getMenu: menuApi.getMenu,
  createMenuItem: menuApi.createMenuItem,
  updateMenuItem: menuApi.updateMenuItem,
  deleteMenuItem: menuApi.deleteMenuItem,
  toggleMenuItemAvailability: menuApi.toggleMenuItemAvailability,
  getCategories: menuApi.getCategories,
  createCategory: menuApi.createCategory,

  // Operating Hours
  getOperatingHours: operatingHoursApi.getOperatingHours,
  updateOperatingHours: operatingHoursApi.updateOperatingHours,

  // Withdrawal
  submitWithdrawal: withdrawalApi.submitWithdrawal,
  getWithdrawalHistory: withdrawalApi.getWithdrawalHistory,
};
