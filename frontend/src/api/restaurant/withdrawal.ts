// Restaurant Withdrawal API
import { API_BASE_URL, getAuthHeaders } from './config';
import type { WithdrawalPayload, WithdrawalResponse } from './types';

export const withdrawalApi = {
  /**
   * Submit a withdrawal request
   * @param token - Auth token
   * @param data - Withdrawal reason and details
   * @returns Withdrawal response
   */
  submitWithdrawal: async (token: string, data: WithdrawalPayload): Promise<WithdrawalResponse> => {
    const response = await fetch(`${API_BASE_URL}/restaurant/withdrawal`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to submit withdrawal request');
    }

    // Backend returns RestaurantResponse, we need to map it to WithdrawalResponse
    const restaurantResponse = await response.json();

    return {
      id: restaurantResponse.restaurantId?.toString() || '',
      reason: data.reason,
      details: data.details,
      status: restaurantResponse.status || 'pending',
      createdAt: new Date().toISOString(),
      message: 'Withdrawal request submitted successfully',
    };
  },

  /**
   * Get withdrawal request history
   * @param token - Auth token
   * @returns Array of withdrawal requests
   */
  getWithdrawalHistory: async (token: string): Promise<WithdrawalResponse[]> => {
    // const response = await fetch(`${API_BASE_URL}/restaurant/withdrawal/history`, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //   },
    // });

    const response = {
      ok: true,
      json: async () => {
        return []; // mock 数据
      }
    };

    if (!response.ok) {
      throw new Error('Failed to fetch withdrawal history');
    }

    return response.json();
  },
};
