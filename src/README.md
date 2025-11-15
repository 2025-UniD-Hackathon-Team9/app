# src 디렉토리 구조

이 디렉토리는 애플리케이션의 핵심 소스 코드를 포함합니다.

## 📁 디렉토리 설명

### `/api`
- API 엔드포인트 및 HTTP 요청 관리
- 타입 안전한 HTTP 클라이언트 (ApiError 포함)
- API 응답 타입 정의

**파일:**
- `client.ts` - 중앙화된 API 클라이언트 (GET, POST, PUT, PATCH, DELETE)
- `auth.ts` - 인증 관련 API
- `courses.ts` - 과목 관련 API
- `sessions.ts` - 세션 관련 API

### `/config`
- 애플리케이션 설정 관리
- 환경 변수 중앙화
- 타입 안전한 설정 접근

**파일:**
- `index.ts` - 앱 설정, 환경별 설정, 디버그 로깅

### `/constants`
- 앱 전체에서 사용되는 공통 상수
- 중복을 방지하고 일관성 유지

**파일:**
- `index.ts` - 기본 과목, 아이콘, 색상, 간격, 활동 임계값 등

### `/contexts`
- React Context API 구현
- 전역 상태 관리

**파일:**
- `AuthContext.tsx` - 사용자 인증 상태 관리

### `/hooks`
- 커스텀 React 훅
- 재사용 가능한 컴포넌트 로직

**파일:**
- `useCourses.ts` - 과목 관리 훅
- `useSessions.ts` - 세션 및 학습 기록 관리 훅

### `/types`
- TypeScript 타입 정의
- 도메인 모델 인터페이스

**파일:**
- `index.ts` - Subject, StudyRecord, ActivityLevel 등 핵심 타입

### `/utils`
- 유틸리티 함수들 (도메인별로 구성)
- 순수 함수로 작성

**파일:**
- `dateUtils.ts` - 날짜 포맷팅 및 조작
- `studyUtils.ts` - 학습 세션 및 활동 계산
- `subjectUtils.ts` - 과목 관련 헬퍼 함수
- `storage.ts` - AsyncStorage 래퍼 (타입 안전)
- `validation.ts` - 입력 검증 유틸리티

### `/services` (예정)
- 비즈니스 로직 레이어
- API 상호작용 및 데이터 변환
- 외부 서비스 연동

### `/store` (예정)
- 전역 상태 관리 (Zustand, Redux 등)
- 상태 관련 타입 및 액션

### `/features` (예정)
- 기능별 모듈 구성
- 각 기능은 독립적인 폴더로 관리
- 컴포넌트, 훅, 타입을 기능별로 그룹화

## 🎯 모범 사례

1. **중앙화된 위치에서 가져오기**: 이 디렉토리의 상수와 유틸리티 사용
2. **타입 안전성**: 항상 `/types`에서 타입 가져오기
3. **중복 방지**: 새 유틸리티를 만들기 전에 기존 것 확인
4. **문서화**: 공개 API에 JSDoc 주석 추가
5. **순수 함수 유지**: 가능한 한 부작용 없는 유틸리티 작성
6. **커스텀 훅 활용**: 비즈니스 로직은 커스텀 훅으로 분리
7. **에러 처리**: 모든 비동기 작업에 적절한 에러 처리 포함
8. **환경 설정**: 민감한 정보는 `/config`를 통해 관리

## 📚 추가 문서

- [코딩 표준 및 모범 사례](../CODING_STANDARDS.md)
- [유지보수성 개선 사항](../MAINTAINABILITY_IMPROVEMENTS.md)
- [프로젝트 구조](../PROJECT_STRUCTURE.md)


