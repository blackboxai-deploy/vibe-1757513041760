'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { Database } from '@/lib/database';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = Database.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const users = Database.getUsers();
      const foundUser = users.find(u => u.email === email);
      
      if (!foundUser) {
        return { success: false, error: 'User not found' };
      }

      // Simple password check - in production use proper hashing
      if (password !== 'admin123') {
        return { success: false, error: 'Invalid password' };
      }

      Database.setCurrentUser(foundUser);
      setUser(foundUser);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    Database.setCurrentUser(null);
    setUser(null);
  };

  return {
    user,
    isLoading,
    login,
    logout,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student'
  };
}