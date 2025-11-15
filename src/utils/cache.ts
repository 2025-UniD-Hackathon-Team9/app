/**
 * API 응답 캐싱 유틸리티
 * 동일한 요청에 대해 일정 시간 동안 캐시된 응답을 반환합니다
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL

  /**
   * 캐시에서 데이터 가져오기
   * @param key - 캐시 키
   * @param ttl - Time to live in milliseconds (기본값: 5분)
   * @returns 캐시된 데이터 또는 undefined
   */
  get<T>(key: string, ttl: number = this.defaultTTL): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return undefined;
    }

    const now = Date.now();
    const age = now - entry.timestamp;

    if (age > ttl) {
      // 캐시 만료됨
      this.cache.delete(key);
      return undefined;
    }

    return entry.data;
  }

  /**
   * 캐시에 데이터 저장
   * @param key - 캐시 키
   * @param data - 저장할 데이터
   */
  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * 특정 키의 캐시 삭제
   * @param key - 캐시 키
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * 패턴과 일치하는 모든 캐시 삭제
   * @param pattern - 매칭할 문자열 패턴
   */
  deletePattern(pattern: string): void {
    const keysToDelete: string[] = [];
    
    this.cache.forEach((_, key) => {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * 전체 캐시 클리어
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 캐시 크기 반환
   */
  size(): number {
    return this.cache.size;
  }
}

// Singleton instance
export const apiCache = new ApiCache();

/**
 * API 함수를 캐싱으로 래핑하는 헬퍼 함수
 * @param key - 캐시 키
 * @param fetcher - 데이터를 가져오는 함수
 * @param ttl - Time to live in milliseconds
 * @returns 캐시된 데이터 또는 새로운 데이터
 */
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // 캐시에서 먼저 확인
  const cached = apiCache.get<T>(key, ttl);
  if (cached !== undefined) {
    return cached;
  }

  // 캐시에 없으면 데이터 가져오기
  const data = await fetcher();
  apiCache.set(key, data);
  return data;
}
