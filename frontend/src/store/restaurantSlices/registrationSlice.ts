// Registration Slice - Restaurant Registration State
import { StateCreator } from 'zustand';
import { registrationApi } from '@/api/restaurant/registration';
import type { RegistrationPayload, RegistrationResponse } from '@/api/restaurant';

export interface RegistrationState {
  // State
  registrationSubmitting: boolean;
  registrationResult: RegistrationResponse | null;
  registrationError: string | null;

  // Actions
  submitRegistration: (payload: RegistrationPayload) => Promise<void>;
  clearRegistrationResult: () => void;
}

export const createRegistrationSlice: StateCreator<RegistrationState> = (set) => ({
  // Initial State
  registrationSubmitting: false,
  registrationResult: null,
  registrationError: null,

  // Actions
  submitRegistration: async (payload: RegistrationPayload) => {
    set({ registrationSubmitting: true, registrationError: null, registrationResult: null });
    try {
      const result = await registrationApi.register(payload);
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

  clearRegistrationResult: () => {
    set({ registrationResult: null, registrationError: null });
  },
});
