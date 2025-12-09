// Restaurant Authentication API
import { API_BASE_URL, getAuthHeaders } from './config';
import type { LoginCredentials, AuthResponse } from './types';

export const authApi = {
  /**
   * Login restaurant owner
   * @param credentials - Username and password
   * @returns Auth response with token and user info
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/owner/login`, {
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

  /**
   * Logout restaurant owner
   * @param token - Auth token
   */
  logout: async (token: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/owner/logout`, {
      method: 'POST',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  },

  /**
   * Change password
   * @param token - Auth token
   * @param username - Restaurant username
   * @param data - Current and new password
   */
  changePassword: async (
    token: string,
    username: string,
    data: { currentPassword: string; newPassword: string }
  ): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/restaurant/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({
        username,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to change password');
    }
  },
};
