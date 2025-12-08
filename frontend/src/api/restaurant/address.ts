// Restaurant Address API
import { API_BASE_URL, getAuthHeaders } from './config';
import type { AddressUpdatePayload, RestaurantSummary } from './types';
import { profileApi } from './profile';

export const addressApi = {
  /**
   * Update restaurant address
   * @param token - Auth token
   * @param data - Address data to update
   */
  updateAddress: async (
    token: string,
    restaurantId: string,
    data: AddressUpdatePayload
  ): Promise<RestaurantSummary> => {
    const response = await fetch(`${API_BASE_URL}/restaurant/${restaurantId}/address`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update address');
    }

    // Backend returns full profile; reuse mapper
    return profileApi.getProfile(token, restaurantId);
  },
};
