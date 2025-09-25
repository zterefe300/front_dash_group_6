import React, { createContext, useContext, useState, ReactNode } from 'react';

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
    // Mock login - in real app, this would make API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Determine role based on username pattern
    let role: UserRole;
    if (username === 'administrator') {
      role = 'admin';
    } else {
      // Check if username follows staff pattern (2+ chars followed by 2 digits)
      const staffPattern = /^[a-zA-Z]{2,}[0-9]{2}$/;
      role = staffPattern.test(username) ? 'staff' : 'admin';
    }
    
    // Mock user data based on username
    const mockUser: User = {
      id: '1',
      name: username === 'administrator' ? 'Administrator' : `${username.charAt(0).toUpperCase()}${username.slice(1)}`,
      username,
      role
    };
    
    setUser(mockUser);
    setCurrentView(mockUser.role);
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