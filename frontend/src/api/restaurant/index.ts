// Restaurant API types and functions

export interface RestaurantSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  address?: RestaurantAddress;
  operatingHours?: OperatingDay[];
  socialLinks?: RestaurantSocialLinks;
}

export interface RestaurantAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface RestaurantSocialLinks {
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

export interface OperatingDay {
  day: string;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
}

export interface RegistrationPayload {
  restaurantName: string;
  businessType: string;
  cuisineType: string;
  email: string;
  phone: string;
  website?: string;
  description: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  operatingHours: OperatingDay[];
  documents: any[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: RestaurantSummary;
}

// API functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const restaurantApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/restaurant/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  register: async (payload: RegistrationPayload): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/restaurant/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  getProfile: async (token: string): Promise<RestaurantSummary> => {
    const response = await fetch(`${API_BASE_URL}/restaurant/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  },

  updateProfile: async (token: string, data: Partial<RestaurantSummary>): Promise<RestaurantSummary> => {
    const response = await fetch(`${API_BASE_URL}/restaurant/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return response.json();
  },
};
