"use client";

import { createContext, useContext, useEffect, useState } from "react";
import authService from "@/services/authService";
import { useLanguage } from "./LanguageContext";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { changeLanguage } = useLanguage();

  useEffect(() => {
    // Check if user is already logged in on app load
    const checkAuthStatus = () => {
      try {
        const token = authService.getToken();
        const userData = authService.getUser();

        if (token && userData) {
          setUser(userData);
          setIsAuthenticated(true);

          // Set user's preferred language if available
          if (userData?.preferredLanguage) {
            changeLanguage(userData.preferredLanguage);
          }
        }
      } catch (error) {
        console.error("Auth status check error:", error);
        // Clear invalid data
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [changeLanguage]);

  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password);
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);

        // Set user's preferred language if available
        if (result.user?.preferredLanguage) {
          changeLanguage(result.user.preferredLanguage);
        }

        return { success: true, user: result.user };
      }
      return { success: false, error: result.message };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const result = await authService.register(userData);
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);

        // Set user's preferred language if available
        if (result.user?.preferredLanguage) {
          changeLanguage(result.user.preferredLanguage);
        }

        return { success: true, user: result.user };
      }
      return { success: false, error: result.message };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if API fails
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
