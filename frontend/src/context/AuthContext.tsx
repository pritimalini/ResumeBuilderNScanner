'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import userService, { User } from '../services/userService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      setLoading(true);
      const currentUser = await userService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { user, error } = await userService.signIn(email, password);
      
      if (error) {
        return { error };
      }
      
      setUser(user);
      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'An error occurred during sign in' };
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const { user, error } = await userService.signUp(email, password, name);
      
      if (error) {
        return { error };
      }
      
      setUser(user);
      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'An error occurred during sign up' };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await userService.signOut();
      
      if (error) {
        return { error };
      }
      
      setUser(null);
      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'An error occurred during sign out' };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      return await userService.resetPassword(email);
    } catch (error: any) {
      return { error: error.message || 'An error occurred while resetting password' };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default AuthContext; 