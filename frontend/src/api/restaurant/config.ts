// Restaurant API Configuration

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Helper function to get auth headers
export const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

// Helper function to get basic headers
export const getHeaders = () => ({
  'Content-Type': 'application/json',
});
