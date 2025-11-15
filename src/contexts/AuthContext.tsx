/**
 * 인증 컨텍스트
 * 사용자 로그인 상태 관리
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { login } from '@/src/api/auth';
import type { UserResponse } from '@/src/api/auth';
import { config, debugLog } from '@/src/config';
import * as storage from '@/src/utils/storage';

const USER_STORAGE_KEY = storage.StorageKeys.USER;

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
      const storedUser = await storage.getItem<UserResponse>(USER_STORAGE_KEY);

      if (storedUser) {
        setUser(storedUser);
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
      // 개발 환경에서만 자동 로그인 (환경 변수에서 설정)
      if (!config.autoLoginEnabled || !config.autoLoginEmail || !config.autoLoginPassword) {
        debugLog('Auto login disabled or credentials not configured');
        return;
      }

      const result = await login({
        email: config.autoLoginEmail,
        password: config.autoLoginPassword,
      });

      await storage.setItem(USER_STORAGE_KEY, result);
      setUser(result);
      debugLog('Auto login successful:', result.email);
    } catch (error) {
      console.error('Auto login failed:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await login({ email, password });
      await storage.setItem(USER_STORAGE_KEY, result);
      setUser(result);
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await storage.removeItem(USER_STORAGE_KEY);
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
