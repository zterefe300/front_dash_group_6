// Restaurant API Types
// All TypeScript interfaces for Restaurant API

export interface RestaurantSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  address?: RestaurantAddress;
  operatingHours?: OperatingDay[];
  description?: string;
  businessType?: string;
  contactName?: string;
}

export interface RestaurantAddress {
  building: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface OperatingDay {
  day: string;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
}

// Menu Types
export interface MenuItemPayload {
  name: string;
  category: string;
  price: number;
  description?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  imageUrl?: string | null;
}

export interface MenuCategory {
  id: string;
  name: string;
  restaurantId: string;
}

// Registration Types
export interface RegistrationPayload {
  restaurantName: string;
  businessType: string;
  description: string;
  ownerName: string;
  email: string;
  phone: string;
  building: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  agreeToTerms: boolean;
  agreeToCommission: boolean;
  confirmAccuracy: boolean;
  operatingHours: OperatingDay[];
  menuItems: MenuItemPayload[];
  supportingFiles?: string[];
}

export interface RegistrationResponse {
  id: string;
  status: string;
  message: string;
  submittedAt: string;
  generatedUsername?: string;
}

// Auth Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  restaurantId: number;
  restaurantName: string;
  email: string;
  status: string;
  message?: string;
}

// Profile Update Types
export interface ProfileUpdatePayload {
  name: string;
  description: string;
  businessType: string;
}

export interface ContactUpdatePayload {
  contactName: string;
  phoneNumber: string;
  email: string;
}

export interface AddressUpdatePayload {
  building: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

// Menu Management Types
export interface MenuItemCreatePayload {
  name: string;
  description?: string;
  price: number;
  category: string;
  isAvailable?: boolean;
  imageUrl?: string;
}

export interface MenuItemUpdatePayload {
  name: string;
  description?: string;
  price: number;
  category: string;
  isAvailable?: boolean;
  imageUrl?: string;
}

// Operating Hours Types
export interface OperatingHoursUpdatePayload {
  hours: OperatingDay[];
}

// Password Types
export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// Withdrawal Types
export interface WithdrawalPayload {
  reason: string;
  details: string;
}

export interface WithdrawalResponse {
  id: string;
  reason: string;
  details: string;
  status: string;
  createdAt: string;
  message?: string;
}
