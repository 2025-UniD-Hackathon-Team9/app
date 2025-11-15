# 코딩 표준 및 모범 사례

이 문서는 프로젝트의 코드 품질과 유지보수성을 높이기 위한 표준과 모범 사례를 정의합니다.

## 목차

1. [프로젝트 구조](#프로젝트-구조)
2. [TypeScript 사용 규칙](#typescript-사용-규칙)
3. [컴포넌트 작성 규칙](#컴포넌트-작성-규칙)
4. [상태 관리](#상태-관리)
5. [API 호출](#api-호출)
6. [에러 처리](#에러-처리)
7. [스타일링](#스타일링)
8. [테스팅](#테스팅)
9. [보안](#보안)

## 프로젝트 구조

```
app/
├── src/
│   ├── api/          # API 클라이언트 및 엔드포인트
│   ├── config/       # 환경 설정
│   ├── constants/    # 상수 정의
│   ├── contexts/     # React Context
│   ├── hooks/        # 커스텀 훅
│   ├── types/        # TypeScript 타입 정의
│   └── utils/        # 유틸리티 함수
├── components/       # 재사용 가능한 컴포넌트
│   ├── common/       # 공통 컴포넌트 (Loading, Button 등)
│   ├── layout/       # 레이아웃 컴포넌트
│   └── home/         # 홈 화면 전용 컴포넌트
├── app/              # Expo Router 화면
└── constants/        # 앱 전역 상수 (색상, 테마 등)
```

## TypeScript 사용 규칙

### 1. 타입 정의

모든 함수 매개변수와 반환값에 명시적 타입을 지정하세요:

```typescript
// ✅ Good
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

// ❌ Bad
function calculateTotal(price, quantity) {
  return price * quantity;
}
```

### 2. 인터페이스 vs 타입

- 확장 가능한 객체 구조는 `interface` 사용
- 유니온, 튜플, 또는 간단한 타입은 `type` 사용

```typescript
// ✅ Good
interface User {
  id: number;
  name: string;
}

type Status = 'active' | 'inactive' | 'pending';

// ❌ Bad - 간단한 유니온에 interface 사용
interface Status {
  value: 'active' | 'inactive' | 'pending';
}
```

### 3. any 사용 지양

`any` 타입 사용을 최소화하고, 불가피한 경우 `unknown` 사용을 고려하세요:

```typescript
// ✅ Good
function processData(data: unknown): void {
  if (typeof data === 'string') {
    console.log(data.toUpperCase());
  }
}

// ❌ Bad
function processData(data: any): void {
  console.log(data.toUpperCase());
}
```

## 컴포넌트 작성 규칙

### 1. 함수형 컴포넌트 사용

클래스 컴포넌트 대신 함수형 컴포넌트와 훅을 사용하세요:

```typescript
// ✅ Good
export function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  // ...
}

// ❌ Bad
export class UserProfile extends React.Component {
  // ...
}
```

### 2. Props 타입 정의

인라인 타입 대신 별도의 인터페이스를 사용하세요:

```typescript
// ✅ Good
interface UserProfileProps {
  userId: number;
  onUpdate?: (user: User) => void;
}

export function UserProfile({ userId, onUpdate }: UserProfileProps) {
  // ...
}

// ❌ Bad
export function UserProfile({ userId, onUpdate }: { userId: number; onUpdate?: any }) {
  // ...
}
```

### 3. 커스텀 훅 활용

비즈니스 로직은 커스텀 훅으로 분리하세요:

```typescript
// ✅ Good
function useCourses(userId: number) {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 로직...
  
  return { courses, isLoading };
}

export function CourseList({ userId }: { userId: number }) {
  const { courses, isLoading } = useCourses(userId);
  // UI 렌더링만 담당
}

// ❌ Bad - 컴포넌트에 모든 로직이 있음
export function CourseList({ userId }: { userId: number }) {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 복잡한 비즈니스 로직...
  // UI 렌더링...
}
```

## 상태 관리

### 1. 지역 상태 vs 전역 상태

- 컴포넌트 내부에서만 사용하는 상태: `useState` 사용
- 여러 컴포넌트에서 공유하는 상태: Context API 또는 상태 관리 라이브러리 사용

```typescript
// ✅ Good - 지역 상태
function Counter() {
  const [count, setCount] = useState(0);
  return <Text>{count}</Text>;
}

// ✅ Good - 전역 상태
const { user } = useAuth(); // Context에서 가져옴
```

### 2. 상태 업데이트

이전 상태를 기반으로 업데이트할 때는 함수형 업데이트를 사용하세요:

```typescript
// ✅ Good
setCount(prev => prev + 1);

// ❌ Bad
setCount(count + 1);
```

## API 호출

### 1. 커스텀 훅 사용

API 호출은 커스텀 훅으로 캡슐화하세요:

```typescript
// ✅ Good
export function useCourses(userId: number) {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState<Error | null>(null);
  
  const loadCourses = useCallback(async () => {
    try {
      const data = await getCourses(userId);
      setCourses(data);
    } catch (err) {
      setError(err as Error);
    }
  }, [userId]);
  
  useEffect(() => {
    loadCourses();
  }, [loadCourses]);
  
  return { courses, error, refresh: loadCourses };
}
```

### 2. 에러 처리

모든 API 호출에 에러 처리를 포함하세요:

```typescript
// ✅ Good
try {
  const data = await apiClient.get('/users');
  setUsers(data);
} catch (error) {
  console.error('Failed to fetch users:', error);
  setError(error as Error);
}

// ❌ Bad
const data = await apiClient.get('/users');
setUsers(data);
```

## 에러 처리

### 1. Error Boundary 사용

중요한 컴포넌트는 Error Boundary로 감싸세요:

```typescript
// ✅ Good
<ErrorBoundary>
  <MyImportantComponent />
</ErrorBoundary>
```

### 2. 사용자 친화적 에러 메시지

사용자에게 기술적 에러를 그대로 보여주지 마세요:

```typescript
// ✅ Good
catch (error) {
  Alert.alert('오류', '데이터를 불러오는데 실패했습니다. 다시 시도해주세요.');
}

// ❌ Bad
catch (error) {
  Alert.alert('Error', error.message);
}
```

## 스타일링

### 1. StyleSheet 사용

인라인 스타일 대신 `StyleSheet.create()` 사용:

```typescript
// ✅ Good
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

// ❌ Bad
<View style={{ flex: 1, padding: 16 }}>
```

### 2. 상수 사용

반복되는 스타일 값은 상수로 정의:

```typescript
// ✅ Good
import { SPACING, BORDER_RADIUS } from '@/src/constants';

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
});

// ❌ Bad
const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
  },
});
```

## 테스팅

### 1. 유닛 테스트

유틸리티 함수는 반드시 테스트를 작성하세요:

```typescript
// dateUtils.test.ts
describe('formatDateToYYYYMMDD', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDateToYYYYMMDD(date)).toBe('2024-01-15');
  });
});
```

### 2. 컴포넌트 테스트

중요한 컴포넌트는 렌더링 테스트를 작성하세요.

## 보안

### 1. 환경 변수 사용

민감한 정보는 환경 변수로 관리:

```typescript
// ✅ Good
import { config } from '@/src/config';
const apiUrl = config.apiUrl;

// ❌ Bad
const apiUrl = 'http://api.example.com';
```

### 2. 입력 검증

사용자 입력은 항상 검증하세요:

```typescript
// ✅ Good
import { validateEmail } from '@/src/utils/validation';

const validation = validateEmail(email);
if (!validation.isValid) {
  Alert.alert('오류', validation.error);
  return;
}

// ❌ Bad
if (email.includes('@')) {
  // 처리...
}
```

### 3. 민감 정보 로깅 금지

로그에 비밀번호, 토큰 등을 포함하지 마세요:

```typescript
// ✅ Good
debugLog('User logged in:', user.email);

// ❌ Bad
console.log('Login:', { email, password });
```

## 코드 리뷰 체크리스트

- [ ] 타입이 명시적으로 정의되어 있는가?
- [ ] 에러 처리가 적절히 되어 있는가?
- [ ] 커스텀 훅으로 로직이 분리되어 있는가?
- [ ] 상수를 사용하여 매직 넘버를 제거했는가?
- [ ] 사용자 친화적인 에러 메시지를 제공하는가?
- [ ] 입력 검증이 되어 있는가?
- [ ] 민감한 정보가 로그에 포함되지 않는가?
- [ ] 코드가 재사용 가능한 형태인가?
- [ ] 주석이 필요한 부분에 적절히 작성되었는가?
- [ ] 성능 최적화가 고려되었는가? (useMemo, useCallback 등)

## 참고 자료

- [React Native 공식 문서](https://reactnative.dev/)
- [TypeScript 공식 문서](https://www.typescriptlang.org/)
- [Expo 공식 문서](https://docs.expo.dev/)
- [React Hooks 가이드](https://react.dev/reference/react)
