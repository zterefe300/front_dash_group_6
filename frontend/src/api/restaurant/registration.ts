// Restaurant Registration API
import { API_BASE_URL } from './config';
import type { RegistrationPayload, RegistrationResponse } from './types';

export const registrationApi = {
  /**
   * Register a new restaurant
   * @param payload - Complete registration data
   * @returns Registration response with status
   */
  register: async (payload: RegistrationPayload): Promise<RegistrationResponse> => {
    // Backend controller is mounted at POST /api/restaurant/registration
    const response = await fetch(`${API_BASE_URL}/restaurant/registration`, {
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
};
