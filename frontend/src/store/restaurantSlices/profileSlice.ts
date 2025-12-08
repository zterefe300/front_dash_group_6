// Profile Slice - Restaurant Profile State
import { StateCreator } from 'zustand';
import { profileApi } from '@/api/restaurant/profile';
import { addressApi } from '@/api/restaurant/address';
import type {
  RestaurantSummary,
  ProfileUpdatePayload,
  ContactUpdatePayload,
  AddressUpdatePayload,
} from '@/api/restaurant';

export interface ProfileState {
  // State
  restaurant: RestaurantSummary | null;
  isProfileLoading: boolean;
  isProfileUpdating: boolean;
  profileError: string | null;

  // Actions
  fetchProfile: (token: string, restaurantId: string) => Promise<void>;
  updateProfile: (token: string, restaurantId: string, data: ProfileUpdatePayload) => Promise<void>;
  updateContact: (token: string, restaurantId: string, data: ContactUpdatePayload) => Promise<void>;
  updateAddress: (token: string, restaurantId: string, data: AddressUpdatePayload) => Promise<void>;
  clearProfileError: () => void;
}

export const createProfileSlice: StateCreator<ProfileState> = (set, get) => ({
  // Initial State
  restaurant: null,
  isProfileLoading: false,
  isProfileUpdating: false,
  profileError: null,

  // Actions
  fetchProfile: async (token: string, restaurantId: string) => {
    if (!token) throw new Error('Not authenticated');
    if (!restaurantId) throw new Error('Restaurant not selected');

    set({ isProfileLoading: true, profileError: null });
    try {
      const profile = await profileApi.getProfile(token, restaurantId);
      set({
        restaurant: profile,
        isProfileLoading: false,
      });
    } catch (error) {
      set({
        isProfileLoading: false,
        profileError: error instanceof Error ? error.message : 'Failed to fetch profile',
      });
      throw error;
    }
  },

  updateProfile: async (token: string, restaurantId: string, data: ProfileUpdatePayload) => {
    if (!token) throw new Error('Not authenticated');
    if (!restaurantId) throw new Error('Restaurant not selected');

    set({ isProfileUpdating: true, profileError: null });
    try {
      const updatedProfile = await profileApi.updateProfile(token, restaurantId, data);
      set({
        restaurant: updatedProfile,
        isProfileUpdating: false,
      });
    } catch (error) {
      set({
        isProfileUpdating: false,
        profileError: error instanceof Error ? error.message : 'Failed to update profile',
      });
      throw error;
    }
  },

  updateContact: async (token: string, restaurantId: string, data: ContactUpdatePayload) => {
    if (!token) throw new Error('Not authenticated');
    if (!restaurantId) throw new Error('Restaurant not selected');

    set({ isProfileUpdating: true, profileError: null });
    try {
      const updated = await profileApi.updateContact(token, restaurantId, data);
      set({ restaurant: updated, isProfileUpdating: false });
    } catch (error) {
      set({
        isProfileUpdating: false,
        profileError: error instanceof Error ? error.message : 'Failed to update contact',
      });
      throw error;
    }
  },

  updateAddress: async (token: string, restaurantId: string, data: AddressUpdatePayload) => {
    if (!token) throw new Error('Not authenticated');
    if (!restaurantId) throw new Error('Restaurant not selected');

    set({ isProfileUpdating: true, profileError: null });
    try {
      const updated = await addressApi.updateAddress(token, restaurantId, data);
      set({ restaurant: updated, isProfileUpdating: false });
    } catch (error) {
      set({
        isProfileUpdating: false,
        profileError: error instanceof Error ? error.message : 'Failed to update address',
      });
      throw error;
    }
  },

  clearProfileError: () => {
    set({ profileError: null });
  },
});
