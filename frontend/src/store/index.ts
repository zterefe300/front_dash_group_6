import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { restaurantApi, type LoginCredentials, type RegistrationPayload, type RestaurantSummary } from '@/api/restaurant';

interface AppState {
  // Auth state
  isAuthenticated: boolean;
  token: string | null;
  user: RestaurantSummary | null;
  isAuthenticating: boolean;
  authError: string | null;

  // Registration state
  registrationSubmitting: boolean;
  registrationResult: { message: string } | null;
  registrationError: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearAuthError: () => void;
  submitRegistration: (payload: RegistrationPayload) => Promise<void>;
  clearRegistrationResult: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      token: null,
      user: null,
      isAuthenticating: false,
      authError: null,
      registrationSubmitting: false,
      registrationResult: null,
      registrationError: null,

      // Login action
      login: async (credentials: LoginCredentials) => {
        set({ isAuthenticating: true, authError: null });
        try {
          const response = await restaurantApi.login(credentials);
          set({
            isAuthenticated: true,
            token: response.token,
            user: response.user,
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

      // Logout action
      logout: () => {
        set({
          isAuthenticated: false,
          token: null,
          user: null,
          authError: null,
        });
      },

      // Clear auth error
      clearAuthError: () => {
        set({ authError: null });
      },

      // Submit registration
      submitRegistration: async (payload: RegistrationPayload) => {
        set({ registrationSubmitting: true, registrationError: null, registrationResult: null });
        try {
          const result = await restaurantApi.register(payload);
          set({
            registrationSubmitting: false,
            registrationResult: result,
            registrationError: null,
          });
        } catch (error) {
          set({
            registrationSubmitting: false,
            registrationError: error instanceof Error ? error.message : 'Registration failed',
          });
          throw error;
        }
      },

      // Clear registration result
      clearRegistrationResult: () => {
        set({ registrationResult: null, registrationError: null });
      },
    }),
    {
      name: 'frontdash-restaurant-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        user: state.user,
      }),
    }
  )
);

export default useAppStore;
