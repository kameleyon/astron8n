import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthToken, saveAuthToken, deleteAuthToken } from '@/lib/authStore';
import { getItem, saveItem } from '@/lib/storage';

// Define the shape of our context
type AppContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

// Define user type
type User = {
  id: string;
  email: string;
  name?: string;
  profileImage?: string;
};

// Create context with default values
const AppContext = createContext<AppContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: async () => {},
  loading: true,
});

// Custom hook to use the app context
export const useApp = () => useContext(AppContext);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getAuthToken();
        const userData = await getItem('user_data');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (token: string, userData: User) => {
    try {
      setLoading(true);
      await saveAuthToken(token);
      await saveItem('user_data', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await deleteAuthToken();
      await saveItem('user_data', '');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};