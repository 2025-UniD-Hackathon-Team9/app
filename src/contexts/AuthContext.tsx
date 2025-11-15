/**
 * 인증 컨텍스트
 * 사용자 로그인 상태 관리
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '@/src/api/auth';
import type { UserResponse } from '@/src/api/auth';

const USER_STORAGE_KEY = '@user';

interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // MVP: 저장된 사용자가 없으면 자동으로 로그인
        await autoLogin();
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const autoLogin = async () => {
    try {
      // 아까 만든 계정으로 자동 로그인
      const result = await login({
        email: 'red@soomgsil.ac.kr',
        password: '1234',
      });

      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(result));
      setUser(result);
    } catch (error) {
      console.error('Auto login failed:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await login({ email, password });
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(result));
      setUser(result);
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
