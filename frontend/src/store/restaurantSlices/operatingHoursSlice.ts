// Operating Hours Slice - Restaurant Operating Hours State
import { StateCreator } from 'zustand';
import { operatingHoursApi } from '@/api/restaurant/operating-hours';
import type { OperatingDay, OperatingHoursUpdatePayload } from '@/api/restaurant';

export interface OperatingHoursState {
  // State
  operatingHours: OperatingDay[];
  isOperatingHoursLoading: boolean;
  isOperatingHoursUpdating: boolean;
  operatingHoursError: string | null;

  // Actions
  fetchOperatingHours: (token: string, restaurantId: string) => Promise<void>;
  updateOperatingHours: (token: string, restaurantId: string, data: OperatingHoursUpdatePayload) => Promise<void>;
  clearOperatingHoursError: () => void;
}

export const createOperatingHoursSlice: StateCreator<OperatingHoursState> = (set) => ({
  // Initial State
  operatingHours: [],
  isOperatingHoursLoading: false,
  isOperatingHoursUpdating: false,
  operatingHoursError: null,

  // Actions
  fetchOperatingHours: async (token: string, restaurantId: string) => {
    if (!token) throw new Error('Not authenticated');
    if (!restaurantId) throw new Error('Restaurant not selected');

    set({ isOperatingHoursLoading: true, operatingHoursError: null });
    try {
      const hours = await operatingHoursApi.getOperatingHours(token, restaurantId);
      set({ operatingHours: hours, isOperatingHoursLoading: false });
    } catch (error) {
      set({
        isOperatingHoursLoading: false,
        operatingHoursError: error instanceof Error ? error.message : 'Failed to fetch operating hours',
      });
      throw error;
    }
  },

  updateOperatingHours: async (token: string, restaurantId: string, data: OperatingHoursUpdatePayload) => {
    if (!token) throw new Error('Not authenticated');
    if (!restaurantId) throw new Error('Restaurant not selected');

    set({ isOperatingHoursUpdating: true, operatingHoursError: null });
    try {
      await operatingHoursApi.updateOperatingHours(token, restaurantId, data);
      set({
        operatingHours: data.hours,
        isOperatingHoursUpdating: false,
      });
    } catch (error) {
      set({
        isOperatingHoursUpdating: false,
        operatingHoursError: error instanceof Error ? error.message : 'Failed to update operating hours',
      });
      throw error;
    }
  },

  clearOperatingHoursError: () => {
    set({ operatingHoursError: null });
  },
});
