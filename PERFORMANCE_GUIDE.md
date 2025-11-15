# 성능 최적화 가이드

이 문서는 앱의 성능을 개선하기 위해 적용된 최적화 기법과 베스트 프랙티스를 설명합니다.

## 적용된 최적화

### 1. React 렌더링 최적화

#### React.memo를 사용한 컴포넌트 메모이제이션
불필요한 리렌더링을 방지하기 위해 주요 컴포넌트에 `React.memo`를 적용했습니다:

```typescript
// 적용된 컴포넌트들
- TodaySessionCard
- SubjectSelector
- StudyCalendar
```

**효과**: props가 변경되지 않으면 컴포넌트가 리렌더링되지 않아 성능 향상

#### useMemo를 사용한 값 메모이제이션
비용이 큰 계산을 메모이제이션하여 매 렌더링마다 재계산을 방지:

```typescript
// 예시: 퀴즈 통계 계산
const quizStats = useMemo(() => {
  const completedSessions = sessions.filter(s => s.status === 'Completed');
  return {
    totalQuizzes: completedSessions.length,
    averageScore: calculateAverage(completedSessions)
  };
}, [sessions]);
```

**효과**: 
- sessions 배열이 변경되지 않으면 계산을 건너뜀
- 복잡한 배열 연산 비용 절감

#### useCallback을 사용한 함수 메모이제이션
이벤트 핸들러를 메모이제이션하여 자식 컴포넌트의 불필요한 리렌더링 방지:

```typescript
// 예시: 버튼 클릭 핸들러
const handlePdfUpload = useCallback(() => {
  router.push('/camera');
}, [router]);
```

**효과**: 
- 함수가 매 렌더링마다 재생성되지 않음
- 자식 컴포넌트의 props 비교 최적화

### 2. 데이터 페칭 최적화

#### 커스텀 훅으로 데이터 로직 분리
재사용 가능한 데이터 페칭 로직을 커스텀 훅으로 추출:

```typescript
// useCourses - 과목 데이터 관리
const { subjects, courses, isLoading, error, refetch } = useCourses(userId);

// useSessions - 세션 데이터 관리
const { allSessions, todaySessionData, studyRecords, isLoading } = useSessions(userId, courses);
```

**장점**:
- 코드 중복 제거 (175줄 → 70줄)
- 자동 캐싱 및 메모이제이션
- 에러 처리 중앙화
- 재사용성 향상

#### API 응답 캐싱
동일한 API 요청에 대해 캐시된 응답 사용 (src/utils/cache.ts):

```typescript
// 캐시와 함께 API 호출
const data = await cachedFetch(
  'courses-123',
  () => getCourses(userId),
  5 * 60 * 1000  // 5분 TTL
);
```

**효과**:
- 불필요한 네트워크 요청 감소
- 응답 시간 단축
- 서버 부하 감소

### 3. 날짜 처리 최적화

#### 최적화된 날짜 유틸리티
Date 객체 생성을 최소화한 경량 날짜 처리:

```typescript
// Before (느림)
const dateString = new Date(session.created_at).toISOString().split('T')[0];

// After (빠름)
const dateString = extractDateFromISO(session.created_at);
```

**성능 향상**:
- Date 객체 생성 비용 제거
- 문자열 파싱만으로 처리
- 대량 데이터 처리 시 유의미한 성능 향상

### 4. 계산 결과 캐싱

#### 달력 데이터 메모이제이션
복잡한 달력 그리드 계산을 메모이제이션:

```typescript
const calendarData = useMemo(() => {
  // 달력 그리드 생성 로직
  // 날짜별 세션 카운트 계산
  return { calendarDays, monthName, getSessionsForDate };
}, [studyRecords, currentMonth]);
```

**효과**:
- studyRecords나 currentMonth가 변경될 때만 재계산
- 스크롤 성능 향상

## 성능 모니터링

### 개발 환경에서 성능 측정
`src/utils/performance.ts`에서 제공하는 도구 사용:

```typescript
import { measureAsync, PerformanceTimer } from '@/src/utils/performance';

// 비동기 함수 측정
const courses = await measureAsync('Load courses', () => getCourses(userId));

// 타이머 사용
const timer = new PerformanceTimer('Calculate stats');
// ... 작업 수행
timer.checkpoint('Data filtered');
// ... 추가 작업
timer.end();
```

## 베스트 프랙티스

### 1. 컴포넌트 설계
- ✅ 작고 집중된 컴포넌트
- ✅ Props 인터페이스 명확히 정의
- ✅ 불필요한 리렌더링 방지 (React.memo, useMemo, useCallback)

### 2. 데이터 페칭
- ✅ 커스텀 훅으로 로직 분리
- ✅ 병렬 요청 사용 (Promise.all)
- ✅ 에러 처리 및 로딩 상태 관리
- ✅ 캐싱 고려

### 3. 상태 관리
- ✅ 필요한 곳에만 상태 저장
- ✅ 파생 상태는 useMemo로 계산
- ✅ 불필요한 상태 업데이트 방지

### 4. 렌더링 최적화
- ✅ 리스트 렌더링 시 key prop 사용
- ✅ 조건부 렌더링 최적화
- ✅ 무거운 계산은 useMemo로 래핑

## 측정 결과

### 코드 메트릭스 개선
- **주요 화면 코드 라인 수**: 175줄 → 70줄 (60% 감소)
- **코드 중복**: 대폭 감소 (커스텀 훅 재사용)
- **타입 안전성**: 100% (TypeScript strict mode)

### 예상 성능 개선
- **초기 로딩 시간**: 불필요한 Date 객체 생성 제거로 개선
- **스크롤 성능**: React.memo와 useMemo로 리렌더링 최소화
- **메모리 사용량**: 함수 재생성 감소로 메모리 압력 감소
- **API 호출 횟수**: 캐싱으로 중복 요청 제거

## 추가 최적화 권장사항

### 1. 이미지 최적화
```typescript
// 이미지 크기 조정 및 포맷 최적화
// react-native-fast-image 사용 고려
```

### 2. 리스트 가상화
```typescript
// 긴 리스트의 경우 FlatList의 windowSize 조정
<FlatList
  data={items}
  renderItem={renderItem}
  windowSize={10}  // 화면 밖 렌더링 영역 최소화
  removeClippedSubviews={true}
/>
```

### 3. 네비게이션 최적화
```typescript
// 화면 lazy loading
const LazyScreen = React.lazy(() => import('./screens/HeavyScreen'));
```

### 4. 번들 크기 최적화
- 사용하지 않는 라이브러리 제거
- tree-shaking 활성화
- 코드 스플리팅 고려

## 참고 자료
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [React Native Performance](https://reactnative.dev/docs/performance)
- [JavaScript Performance Tips](https://developer.mozilla.org/en-US/docs/Web/Performance)
