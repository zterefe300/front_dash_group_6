import { API_BASE_URL } from '../../config';

export const driverService = {
  // Get all drivers
  getAllDrivers: async () => {
    const response = await fetch(`${API_BASE_URL}/drivers`);
    if (!response.ok) {
      throw new Error('Failed to fetch drivers');
    }
    return response.json();
  },

  // Add new driver
  createDriver: async (driverData) => {
    const response = await fetch(`${API_BASE_URL}/drivers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(driverData),
    });
    if (!response.ok) {
      throw new Error('Failed to create driver');
    }
    return response.json();l
  },

  // Delete driver
  deleteDriver: async (id) => {
    const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete driver');
    }
  },
};
