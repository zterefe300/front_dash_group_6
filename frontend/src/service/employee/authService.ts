import { API_BASE_URL } from '../../config';

export const authService = {
  // Employee login (handles both admin and staff)
  loginEmployee: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/employee/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    return response.json();
  },

  // Owner login
  loginOwner: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/owner/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    return response.json();
  },
};
