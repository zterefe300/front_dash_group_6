// Restaurant Operating Hours API
import { API_BASE_URL, getAuthHeaders } from './config';
import type { OperatingDay, OperatingHoursUpdatePayload } from './types';

type BackendOperatingHour = {
  operatingHourId: number;
  restaurantId: number;
  weekDay: string;
  openTime: string;
  closeTime: string;
};

export const operatingHoursApi = {
  /**
   * Get restaurant operating hours
   * @param token - Auth token
   * @returns Array of operating hours by day
   */
  getOperatingHours: async (token: string, restaurantId: string): Promise<OperatingDay[]> => {
    const response = await fetch(`${API_BASE_URL}/restaurant/${restaurantId}/hours`, {
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch operating hours');
    }

    const data: BackendOperatingHour[] = await response.json();
    return data.map((entry) => ({
      day: entry.weekDay,
      isOpen: true,
      openTime: entry.openTime,
      closeTime: entry.closeTime,
    }));
  },

  /**
   * Update restaurant operating hours
   * @param token - Auth token
   * @param data - Operating hours data
   */
  updateOperatingHours: async (
    token: string,
    restaurantId: string,
    data: OperatingHoursUpdatePayload
  ): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/restaurant/${restaurantId}/hours`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({
        hours: data.hours.map((h) => ({
          weekDay: h.day,
          openTime: h.openTime,
          closeTime: h.closeTime,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update operating hours');
    }
  },
};
