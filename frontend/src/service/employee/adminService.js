import { API_BASE_URL } from "../../config";

export const adminService = {
  // Registration Requests
  getRegistrationRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/registrations`);
    if (!response.ok) {
      throw new Error("Failed to fetch registration requests");
    }
    return response.json();
  },

  approveRegistration: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/registrations/${id}/approve`, {
      method: "PUT",
    });
    if (!response.ok) {
      throw new Error("Failed to approve registration");
    }
    return response.json();
  },

  rejectRegistration: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/registrations/${id}/reject`, {
      method: "PUT",
    });
    if (!response.ok) {
      throw new Error("Failed to reject registration");
    }
  },

  // Withdrawal Requests
  getWithdrawalRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/withdrawals`);
    if (!response.ok) {
      throw new Error("Failed to fetch withdrawal requests");
    }
    return response.json();
  },

  approveWithdrawal: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/withdrawals/${id}/approve`, {
      method: "PUT",
    });
    if (!response.ok) {
      throw new Error("Failed to approve withdrawal");
    }
  },

  rejectWithdrawal: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/withdrawals/${id}/reject`, {
      method: "PUT",
    });
    if (!response.ok) {
      throw new Error("Failed to reject withdrawal");
    }
    return response.json();
  },

  // Admin Profile and Password
  updateAdminPassword: async (passwordData) => {
    const response = await fetch(`${API_BASE_URL}/admin/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passwordData),
    });
    if (!response.ok) {
      throw new Error("Failed to update admin password");
    }
  },

  // Service Charge
  getServiceCharge: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/service-charge`);
    if (!response.ok) {
      throw new Error("Failed to fetch service charge");
    }
    return response.json();
  },

  updateServiceCharge: async (percentage) => {
    const response = await fetch(`${API_BASE_URL}/admin/service-charge`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(percentage),
    });
    if (!response.ok) {
      throw new Error("Failed to update service charge");
    }
    return response.json();
  },
};
