import React, { createContext, useContext, useState, ReactNode } from 'react';
import { authService } from '../service/employee/authService';

export type UserRole = 'admin' | 'staff';
export type ViewMode = 'admin' | 'staff';

interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  currentView: ViewMode;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  switchView: (view: ViewMode) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>('admin');

  const login = async (username: string, password: string) => {
    try {
      let response;

      // First try employee login (covers admin and staff)
      try {
        response = await authService.loginEmployee(username, password);
      } catch (employeeError) {
        // If employee login fails, try owner login
        try {
          response = await authService.loginOwner(username, password);
        } catch (ownerError) {
          // If both fail, throw the employee error (more common case)
          throw employeeError;
        }
      }

      if (response.success) {
        // Determine role from response
        let role: UserRole;
        if (response.role === 'ADMIN') {
          role = 'admin';
        } else if (response.role === 'STAFF') {
          role = 'staff';
        } else if (response.role === 'OWNER') {
          role = 'admin';
        } else {
          throw new Error('Unknown user role');
        }

        // Create user object
        const user: User = {
          id: username, // Use username as ID
          name: username === 'administrator' ? 'Administrator' : `${username.charAt(0).toUpperCase()}${username.slice(1)}`,
          username,
          role
        };

        setUser(user);
        setCurrentView(user.role);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentView('admin');
  };

  const switchView = (view: ViewMode) => {
    if (user?.role === 'admin') {
      setCurrentView(view);
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      isAuthenticated: !!user,
      currentView,
      login,
      logout,
      switchView
    }}>
      {children}
    </UserContext.Provider>
  );
};
