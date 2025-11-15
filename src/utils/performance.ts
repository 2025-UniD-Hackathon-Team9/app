/**
 * 성능 모니터링 유틸리티
 * 개발 환경에서 성능 측정을 위한 간단한 도구
 */

const isDevelopment = __DEV__;

/**
 * 함수 실행 시간을 측정하고 콘솔에 출력합니다
 * @param label - 측정 라벨
 * @param fn - 실행할 함수
 * @returns 함수의 반환값
 */
export async function measureAsync<T>(
  label: string,
  fn: () => Promise<T>
): Promise<T> {
  if (!isDevelopment) {
    return fn();
  }

  const start = performance.now();
  try {
    const result = await fn();
    const end = performance.now();
    console.log(`⏱️ [${label}] took ${(end - start).toFixed(2)}ms`);
    return result;
  } catch (error) {
    const end = performance.now();
    console.error(`❌ [${label}] failed after ${(end - start).toFixed(2)}ms`, error);
    throw error;
  }
}

/**
 * 동기 함수의 실행 시간을 측정합니다
 * @param label - 측정 라벨
 * @param fn - 실행할 함수
 * @returns 함수의 반환값
 */
export function measureSync<T>(label: string, fn: () => T): T {
  if (!isDevelopment) {
    return fn();
  }

  const start = performance.now();
  try {
    const result = fn();
    const end = performance.now();
    console.log(`⏱️ [${label}] took ${(end - start).toFixed(2)}ms`);
    return result;
  } catch (error) {
    const end = performance.now();
    console.error(`❌ [${label}] failed after ${(end - start).toFixed(2)}ms`, error);
    throw error;
  }
}

/**
 * 성능 측정을 위한 타이머 클래스
 */
export class PerformanceTimer {
  private startTime: number;
  private label: string;

  constructor(label: string) {
    this.label = label;
    this.startTime = performance.now();
  }

  /**
   * 타이머를 종료하고 경과 시간을 출력합니다
   */
  end(): number {
    const elapsed = performance.now() - this.startTime;
    if (isDevelopment) {
      console.log(`⏱️ [${this.label}] took ${elapsed.toFixed(2)}ms`);
    }
    return elapsed;
  }

  /**
   * 중간 경과 시간을 출력합니다 (타이머는 계속 실행됨)
   * @param checkpoint - 체크포인트 이름
   */
  checkpoint(checkpoint: string): number {
    const elapsed = performance.now() - this.startTime;
    if (isDevelopment) {
      console.log(`⏱️ [${this.label}:${checkpoint}] ${elapsed.toFixed(2)}ms`);
    }
    return elapsed;
  }
}

/**
 * 렌더링 성능을 측정하기 위한 React Hook
 * 개발 환경에서만 동작합니다
 */
export function useRenderCount(componentName: string): void {
  if (!isDevelopment) {
    return;
  }

  const renderCount = React.useRef(0);
  
  React.useEffect(() => {
    renderCount.current += 1;
    console.log(`🔄 [${componentName}] rendered ${renderCount.current} times`);
  });
}

// React import for the hook
import React from 'react';
