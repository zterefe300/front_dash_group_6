// Password Slice - Restaurant Password Management State
import { StateCreator } from 'zustand';
import { authApi } from '@/api/restaurant/auth';
import type { ChangePasswordPayload } from '@/api/restaurant';

export interface PasswordState {
  // State
  isPasswordUpdating: boolean;
  passwordError: string | null;

  // Actions
  changePassword: (token: string, username: string, data: ChangePasswordPayload) => Promise<void>;
  clearPasswordError: () => void;
}

export const createPasswordSlice: StateCreator<PasswordState> = (set) => ({
  // Initial State
  isPasswordUpdating: false,
  passwordError: null,

  // Actions
  changePassword: async (token: string, username: string, data: ChangePasswordPayload) => {
    if (!token) throw new Error('Not authenticated');
    if (!username) throw new Error('Username is required');

    set({ isPasswordUpdating: true, passwordError: null });
    try {
      await authApi.changePassword(token, username, data);
      set({ isPasswordUpdating: false });
    } catch (error) {
      set({
        isPasswordUpdating: false,
        passwordError: error instanceof Error ? error.message : 'Failed to change password',
      });
      throw error;
    }
  },

  clearPasswordError: () => {
    set({ passwordError: null });
  },
});
