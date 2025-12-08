// Auth Slice - Restaurant Authentication State
import { StateCreator } from 'zustand';
import { authApi } from '@/api/restaurant/auth';
import type { LoginCredentials, AuthResponse, RestaurantSummary } from '@/api/restaurant';

export interface AuthState {
  // State
  isAuthenticated: boolean;
  token: string | null;
  user: RestaurantSummary | null;
  isAuthenticating: boolean;
  authError: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
}

export const createAuthSlice: StateCreator<AuthState> = (set, get) => ({
  // Initial State
  isAuthenticated: false,
  token: null,
  user: null,
  isAuthenticating: false,
  authError: null,

  // Actions
  login: async (credentials: LoginCredentials) => {
    set({ isAuthenticating: true, authError: null });
    try {
      const response: AuthResponse = await authApi.login(credentials);
      set({
        isAuthenticated: true,
        token: response.token,
        user: {
          id: response.restaurantId.toString(),
          name: response.restaurantName,
          email: response.email,
          phone: '',
          status: response.status as 'pending' | 'active' | 'suspended' | 'rejected',
        },
        isAuthenticating: false,
        authError: null,
      });
    } catch (error) {
      set({
        isAuthenticating: false,
        authError: error instanceof Error ? error.message : 'Login failed',
      });
      throw error;
    }
  },

  logout: async () => {
    const token = get().token;
    if (token) {
      try {
        await authApi.logout(token);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    set({
      isAuthenticated: false,
      token: null,
      user: null,
      authError: null,
    });
  },

  clearAuthError: () => {
    set({ authError: null });
  },
});
