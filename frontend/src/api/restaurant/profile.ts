// Restaurant Profile API
import { API_BASE_URL, getAuthHeaders } from './config';
import type {
  RestaurantSummary,
  ProfileUpdatePayload,
  ContactUpdatePayload,
  RestaurantAddress,
} from './types';

type BackendProfileResponse = {
  restaurantId: number;
  name: string;
  description?: string | null;
  businessType?: string | null;
  contactName?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  status: string;
  imageUrl?: string | null;
  address?: {
    addressId: number;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
  } | null;
};

const mapProfile = (data: BackendProfileResponse): RestaurantSummary => ({
  id: data.restaurantId.toString(),
  name: data.name,
  email: data.email || '',
  phone: data.phoneNumber || '',
  status: (data.status?.toLowerCase() as any) || 'pending',
  address: data.address
    ? ({
        building: data.address.streetAddress.split(' ')[0] || '',
        street: data.address.streetAddress,
        city: data.address.city,
        state: data.address.state,
        zipCode: data.address.zipCode,
      } as RestaurantAddress)
    : undefined,
  description: data.description || undefined,
  businessType: data.businessType || undefined,
  contactName: data.contactName || undefined,
  imageUrl: data.imageUrl || undefined,
});

export const profileApi = {
  /**
   * Get restaurant profile
   * @param token - Auth token
   * @returns Restaurant profile data
   */
  getProfile: async (token: string, restaurantId: string): Promise<RestaurantSummary> => {
    const response = await fetch(`${API_BASE_URL}/restaurant/${restaurantId}/profile`, {
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    const data: BackendProfileResponse = await response.json();
    return mapProfile(data);
  },

  /**
   * Update restaurant basic profile
   * @param token - Auth token
   * @param data - Profile data to update
   * @returns Updated profile
   */
  updateProfile: async (
    token: string,
    restaurantId: string,
    data: ProfileUpdatePayload
  ): Promise<RestaurantSummary> => {
    const response = await fetch(`${API_BASE_URL}/restaurant/${restaurantId}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const updated: BackendProfileResponse = await response.json();
    return mapProfile(updated);
  },

  /**
   * Update restaurant contact information
   * @param token - Auth token
   * @param data - Contact data to update
   */
  updateContact: async (
    token: string,
    restaurantId: string,
    data: ContactUpdatePayload
  ): Promise<RestaurantSummary> => {
    const response = await fetch(`${API_BASE_URL}/restaurant/${restaurantId}/contact`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({
        contactName: data.contactName,
        phoneNumber: data.phoneNumber,
        email: data.email,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update contact information');
    }

    const updated: BackendProfileResponse = await response.json();
    return mapProfile(updated);
  },
};
