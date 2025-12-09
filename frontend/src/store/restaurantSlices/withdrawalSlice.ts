// Withdrawal Slice - Restaurant Withdrawal State
import { StateCreator } from 'zustand';
import { withdrawalApi } from '@/api/restaurant/withdrawal';
import type { WithdrawalPayload, WithdrawalResponse } from '@/api/restaurant';

export interface WithdrawalState {
  // State
  withdrawalRequests: WithdrawalResponse[];
  isSubmittingWithdrawal: boolean;
  withdrawalError: string | null;

  // Actions
  fetchWithdrawalRequests: (token: string) => Promise<void>;
  submitWithdrawal: (token: string, restaurantId: string, data: WithdrawalPayload) => Promise<void>;
  clearWithdrawalError: () => void;
}

export const createWithdrawalSlice: StateCreator<WithdrawalState> = (set) => ({
  // Initial State
  withdrawalRequests: [],
  isSubmittingWithdrawal: false,
  withdrawalError: null,

  // Actions
  fetchWithdrawalRequests: async (token: string) => {
    if (!token) throw new Error('Not authenticated');

    set({ withdrawalError: null });
    try {
      const requests = await withdrawalApi.getWithdrawalHistory(token);
      set({ withdrawalRequests: requests });
    } catch (error) {
      set({
        withdrawalError: error instanceof Error ? error.message : 'Failed to fetch withdrawal requests',
      });
      throw error;
    }
  },

  submitWithdrawal: async (token: string, restaurantId: string, data: WithdrawalPayload) => {
    if (!token) throw new Error('Not authenticated');
    if (!restaurantId) throw new Error('Restaurant not selected');

    set({ isSubmittingWithdrawal: true, withdrawalError: null });
    try {
      const payload = { ...data, restaurantId: parseInt(restaurantId) };
      const newRequest = await withdrawalApi.submitWithdrawal(token, payload);
      set((state) => ({
        withdrawalRequests: [newRequest, ...state.withdrawalRequests],
        isSubmittingWithdrawal: false,
      }));
    } catch (error) {
      set({
        isSubmittingWithdrawal: false,
        withdrawalError: error instanceof Error ? error.message : 'Failed to submit withdrawal',
      });
      throw error;
    }
  },

  clearWithdrawalError: () => {
    set({ withdrawalError: null });
  },
});
