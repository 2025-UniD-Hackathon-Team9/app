/**
 * 스토리지 유틸리티
 * AsyncStorage를 래핑하여 타입 안전성과 에러 처리를 제공합니다
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { debugLog } from '@/src/config';

/**
 * 스토리지 키 타입 정의
 * 새로운 키를 추가할 때 여기에 정의하세요
 */
export const StorageKeys = {
  USER: '@user',
  THEME: '@theme',
  SETTINGS: '@settings',
} as const;

/**
 * 스토리지 에러 클래스
 */
export class StorageError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * 데이터를 스토리지에 저장합니다
 * @param key - 저장할 키
 * @param value - 저장할 값 (자동으로 JSON 직렬화)
 */
export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    debugLog(`Storage: Saved key "${key}"`);
  } catch (error) {
    const message = `Failed to save item to storage: ${key}`;
    console.error(message, error);
    throw new StorageError(message, error);
  }
}

/**
 * 스토리지에서 데이터를 가져옵니다
 * @param key - 가져올 키
 * @returns 저장된 값 또는 null (자동으로 JSON 파싱)
 */
export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue === null) {
      debugLog(`Storage: Key "${key}" not found`);
      return null;
    }
    debugLog(`Storage: Retrieved key "${key}"`);
    return JSON.parse(jsonValue) as T;
  } catch (error) {
    const message = `Failed to get item from storage: ${key}`;
    console.error(message, error);
    throw new StorageError(message, error);
  }
}

/**
 * 스토리지에서 데이터를 삭제합니다
 * @param key - 삭제할 키
 */
export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
    debugLog(`Storage: Removed key "${key}"`);
  } catch (error) {
    const message = `Failed to remove item from storage: ${key}`;
    console.error(message, error);
    throw new StorageError(message, error);
  }
}

/**
 * 스토리지를 완전히 비웁니다
 */
export async function clear(): Promise<void> {
  try {
    await AsyncStorage.clear();
    debugLog('Storage: Cleared all data');
  } catch (error) {
    const message = 'Failed to clear storage';
    console.error(message, error);
    throw new StorageError(message, error);
  }
}

/**
 * 스토리지의 모든 키를 가져옵니다
 * @returns 모든 키의 배열
 */
export async function getAllKeys(): Promise<readonly string[]> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    debugLog(`Storage: Found ${keys.length} keys`);
    return keys;
  } catch (error) {
    const message = 'Failed to get all keys from storage';
    console.error(message, error);
    throw new StorageError(message, error);
  }
}
