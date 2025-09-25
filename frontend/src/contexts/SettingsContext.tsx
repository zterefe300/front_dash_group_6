import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DashboardCardConfig {
  id: string;
  title: string;
  enabled: boolean;
}

export interface DashboardConfig {
  admin: DashboardCardConfig[];
  staff: DashboardCardConfig[];
}

interface SettingsContextType {
  serviceChargePercentage: number;
  dashboardConfig: DashboardConfig;
  updateServiceCharge: (percentage: number) => void;
  updateDashboardCardVisibility: (viewType: 'admin' | 'staff', cardId: string, enabled: boolean) => void;
}

const defaultDashboardConfig: DashboardConfig = {
  admin: [
    { id: 'total-restaurants', title: 'Total Restaurants', enabled: true },
    { id: 'active-staff', title: 'Active Staff', enabled: true },
    { id: 'active-drivers', title: 'Active Drivers', enabled: true },
    { id: 'pending-requests', title: 'Pending Requests', enabled: true },
  ],
  staff: [
    { id: 'orders-today', title: 'Orders Today', enabled: true },
    { id: 'active-orders', title: 'Active Orders', enabled: true },
    { id: 'completed-orders', title: 'Completed Orders', enabled: true },
    { id: 'available-drivers', title: 'Available Drivers', enabled: true },
  ],
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [serviceChargePercentage, setServiceChargePercentage] = useState<number>(8.25);
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>(defaultDashboardConfig);

  const updateServiceCharge = (percentage: number) => {
    setServiceChargePercentage(percentage);
  };

  const updateDashboardCardVisibility = (viewType: 'admin' | 'staff', cardId: string, enabled: boolean) => {
    setDashboardConfig(prev => ({
      ...prev,
      [viewType]: prev[viewType].map(card => 
        card.id === cardId ? { ...card, enabled } : card
      )
    }));
  };

  return (
    <SettingsContext.Provider value={{
      serviceChargePercentage,
      dashboardConfig,
      updateServiceCharge,
      updateDashboardCardVisibility
    }}>
      {children}
    </SettingsContext.Provider>
  );
};