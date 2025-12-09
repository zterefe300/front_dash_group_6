import { API_BASE_URL } from '../../config';

export const orderService = {
  // Get all orders
  getAllOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders`);
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    return response.json();
  },

  // Get orders by status
  getOrdersByStatus: async (status, hasDriver) => {
    let url = `${API_BASE_URL}/orders?status=${status}`;
    if (hasDriver !== undefined) {
      url += `&hasDriver=${hasDriver}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch orders by status');
    }
    return response.json();
  },

  // Assign driver to order
  assignDriver: async (orderId, driverId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/assign-driver?driverId=${driverId}`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to assign driver');
    }
    return response.json();
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status?status=${status}`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error('Failed to update order status');
    }
    return response.json();
  },
};
