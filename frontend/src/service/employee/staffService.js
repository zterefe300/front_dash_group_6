import { API_BASE_URL } from '../../config';

export const staffService = {
  // Staff Management
  getAllStaff: async () => {
    const response = await fetch(`${API_BASE_URL}/staff`);
    if (!response.ok) {
      throw new Error('Failed to fetch staff');
    }
    return response.json();
  },

  createStaff: async (staffData) => {
    const response = await fetch(`${API_BASE_URL}/staff`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(staffData),
    });
    if (!response.ok) {
      throw new Error('Failed to create staff');
    }
    return response.json();
  },

  deleteStaff: async (username) => {
    const response = await fetch(`${API_BASE_URL}/staff/${username}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete staff');
    }
  },

  // For settings - current user info
  getCurrentUser: async () => {
    // This might need authentication token
    const response = await fetch(`${API_BASE_URL}/auth/me`);
    if (!response.ok) {
      throw new Error('Failed to fetch current user');
    }
    return response.json();
  },

  // Update password
  updatePassword: async (passwordData) => {
    const response = await fetch(`${API_BASE_URL}/auth/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData),
    });
    if (!response.ok) {
      throw new Error('Failed to update password');
    }
  },
};
