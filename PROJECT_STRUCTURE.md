# 📁 프로젝트 구조 가이드

이 문서는 프로젝트의 전체 구조와 각 디렉토리의 역할을 설명합니다.

## 🏗️ 전체 구조

```
app/
├── app/                    # Expo Router - 라우팅 및 화면
│   ├── (tabs)/            # 탭 네비게이션
│   ├── _layout.tsx        # 루트 레이아웃
│   └── modal.tsx          # 모달 화면
│
├── src/                    # 핵심 소스 코드
│   ├── api/               # API 클라이언트 및 엔드포인트
│   ├── hooks/             # 커스텀 React 훅
│   ├── utils/             # 유틸리티 함수
│   ├── services/          # 비즈니스 로직
│   ├── store/             # 전역 상태 관리
│   ├── types/             # TypeScript 타입 정의
│   ├── config/            # 앱 설정 및 환경 변수
│   ├── navigation/        # 네비게이션 설정
│   └── features/          # 기능별 모듈
│
├── components/            # 재사용 가능한 UI 컴포넌트
│   ├── common/           # 공통 컴포넌트 (Button, Input 등)
│   ├── ui/               # UI 요소 (Avatar, Badge 등)
│   └── layout/           # 레이아웃 컴포넌트
│
├── assets/               # 정적 리소스
│   ├── images/          # 이미지 파일
│   ├── fonts/           # 폰트 파일
│   └── icons/           # 아이콘 파일
│
└── constants/           # 상수 정의
```

## 📝 디렉토리별 역할

### `/app` - Expo Router
- 파일 기반 라우팅
- 각 파일이 화면(route)이 됨
- `_layout.tsx`로 레이아웃 구성

### `/src` - 핵심 로직
모든 비즈니스 로직과 유틸리티를 포함하는 메인 디렉토리

**세부 디렉토리:**
- `api/` - HTTP 요청 및 API 통신
- `hooks/` - 재사용 가능한 커스텀 훅
- `utils/` - 순수 함수 유틸리티
- `services/` - 비즈니스 로직 레이어
- `store/` - 전역 상태 (Context, Zustand 등)
- `types/` - TypeScript 타입
- `config/` - 환경 설정
- `features/` - 기능별 모듈 (추천)

### `/components` - UI 컴포넌트
재사용 가능한 프레젠테이션 컴포넌트

### `/assets` - 정적 파일
이미지, 폰트, 아이콘 등의 리소스

## 🎯 코딩 원칙

### 1. 관심사의 분리
```typescript
// ❌ 나쁜 예 - 컴포넌트에 모든 로직
const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/user').then(res => res.json()).then(setUser);
  }, []);

  return <View>...</View>;
};

// ✅ 좋은 예 - 로직 분리
// hooks/useUser.ts
export const useUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    userApi.getProfile().then(setUser);
  }, []);

  return user;
};

// components/UserProfile.tsx
const UserProfile = () => {
  const user = useUser();
  return <View>...</View>;
};
```

### 2. 기능별 구성 (Features)
복잡한 기능은 `features/` 디렉토리에 모듈화

```
features/
└── auth/
    ├── components/
    ├── hooks/
    ├── api/
    └── types/
```

### 3. 절대 경로 사용
`tsconfig.json`에 경로 별칭 설정:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./components/*"],
      "@assets/*": ["./assets/*"]
    }
  }
}
```

사용:
```typescript
// ❌ 상대 경로
import { Button } from '../../../components/common/Button';

// ✅ 절대 경로
import { Button } from '@components/common/Button';
```

## 🚀 시작하기

1. **새로운 기능 추가 시:**
   - `src/features/[기능명]` 디렉토리 생성
   - 컴포넌트, 훅, API 함수를 기능별로 구성

2. **API 추가 시:**
   - `src/api/[리소스].api.ts` 파일 생성
   - API 클라이언트 사용

3. **재사용 컴포넌트 생성 시:**
   - `components/common` 또는 `components/ui`에 추가
   - Props 타입 정의

4. **전역 상태 필요 시:**
   - `src/store`에 스토어 생성
   - Zustand 또는 Context API 사용

## 📚 참고 자료

- [Expo Router 공식 문서](https://docs.expo.dev/router/introduction/)
- [React Native 공식 문서](https://reactnative.dev/)
- [TypeScript 공식 문서](https://www.typescriptlang.org/)
