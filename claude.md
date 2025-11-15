## 주제
- 해커톤에서 일일 맞춤형 서비스를 만들어야 함.
- 요청한 것 이외의 다른 기능을 추가하지 말 것.
- 사용자에게 불필요한 정보를 제공하지 말 것.
- 코드 예시를 포함하지 말 것.
- 간결하고 명확하게 작성할 것.

## 요구사항
- 수업을 들은 후 필기가 포함된 pdf 파일을 업로드할 수 있어야 함.
- UpStage API를 통해 업로드된 파일을 파싱해야 함.
- 후속 NLP 작업을 통해 핵심 개념을 추출하고, 문제를 생성할 수 있어야 함.
- 과목 선택은 홈화면에서, 왼쪽 상단의 햄버거 메뉴를 통해서 가능해야 함.

## 워크플로우
1. 회원가입/로그인(MVP에서는 따로 넣지 않고, DB에 저장된 유저 정보로 시작)
2. 수업을 들은 후 필기 포함한 pdf를 업로드한다
    1. 받은 pdf를 upstage api 써서 파싱
    2. 후속 NLP 작업  사용해서 핵심개념 추출, 문제 제작
3. 어플을 키면 **과목 선택**, 이후 특정 과목에 대한 개념 퀴즈.
4. 과목에 대한 ‘가벼운’ 퀴즈 제시, 틀린 것들은 따로 저장

## TODO
# **API 표**

| 도메인 | 메서드 | 엔드포인트 | 설명 | API 구현 여부 | 테스트 여부 |
| --- | --- | --- | --- | --- | --- |
| **Auth** | POST | /auth/signup | 회원가입 | O | ❌ |
| **Auth** | POST | /auth/login | 로그인 | O | ❌ |
| **Users** | GET | /users/:id | User 정보 조회 | O | ❌ |
| **Courses** | POST | /courses | 과목 생성 | O | ❌ |
| **Courses** | GET | /courses?user_id=1 | user_id 기준 과목 목록 조회 | O | ❌ |
| **Documents** | POST | /api/documents/process | PDF 업로드 | ❌ | ❌ |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
| **Sessions** | GET | /sessions/:id | 세션 문제 조회 | ❌ | ❌ |
| **Sessions** | POST | /sessions/:id/submit | 세션 전체 제출 및 채점 | ❌ | ❌ |
| **Sessions** | GET | /sessions?user_id=1&course_id=10 | 세션 기록 조회 | ❌ | ❌ |

# 📌 **0. Auth Domain (회원가입 & 로그인)**

## **POST /auth/signup — 회원가입**

### ✔ Request

```json
{
  "email": "test@example.com",
  "password": "1234",
  "name": "홍길동"
}

```

### ✔ Response

```json
{
  "user_id": 1,
  "email": "test@example.com",
  "name": "홍길동"
}

```

## **POST /auth/login — 로그인**

JWT 없이 간단 로그인 → user_id만 반환

### ✔ Request

```json
{
  "email": "test@example.com",
  "password": "1234"
}

```

### ✔ Response

```json
{
  "user_id": 1,
  "email": "test@example.com",
  "name": "홍길동"
}

```

---

# 📌 **1. Users Domain**

## **GET /users/:id**

### ✔ Response

```json
{
    "id": 1,
    "email": "test1@example.com",
    "passwordHash": "1234",
    "name": "홍길동",
    "createdAt": "2025-11-15T22:22:22"
}
```

---

# 📌 **2. Courses Domain (과목 관리)**

## **POST /courses**

### ✔ Request

```json
{
  "user_id": 1,
  "title": "운영체제"
}

```

### ✔ Response

```json
{
    "id": 1,
    "title": "운영체제",
    "user_id": 1,
    "created_at": "2025-11-15T22:39:09.613236"
}
```

---

## **GET /courses?user_id=1**

### ✔ Response

```json
[
    {
        "id": 1,
        "title": "운영체제",
        "user_id": 1,
        "created_at": "2025-11-15T22:39:10"
    }
    ,
    {
        "id": 2,
        "title": "ㅁㅁㅁㅁ",
        "user_id": 1,
        "created_at": "2025-11-15T22:39:10"
    }
]
```

---

# 📌 **3. Documents Domain (PDF 업로드 & 파싱)**

## **POST** /api/documents/process **— PDF 업로드**

(Form-Data)

| key | value |
| --- | --- |
| file | PDF 파일 |
| user_id | 1 |
| course_id | 1 |

### ✔ Response

```json
{
    "documentId": 9,
    "sessionId": 9,
    "questionCount": 10
}
```

---

# 📌 **4. Sessions Domain (학습 세션)**

## **GET /sessions/:sessionId — 세션 문제 조회**

### ✔ Response

```json
{
  "session_id": 100,
  "course_id": 10,
  "status": "InProgress",
  "questions": [
    {
      "id": 1,
      "item_order": 1,
      "type": "mcq",
      "question_text": "프로세스란 무엇인가?",
      "options": ["프로그램", "실행 중인 프로그램", "데이터 구조"]
    },
    {
      "id": 2,
      "item_order": 2,
      "type": "short",
      "question_text": "PCB에 포함되는 정보를 적으시오."
    }
  ]
}

```

---

## **POST /sessions/:sessionId/submit — 세션 답 전체 제출**

### ✔ Request

```json
{
  "answers": [
    { "session_question_id": 1, "user_answer": "실행 중인 프로그램" },
    { "session_question_id": 2, "user_answer": "프로세스 상태 등" }
  ]
}

```

### ✔ Response

```json
{
  "session_id": 100,
  "score": 50,
  "isCompleted": false,
  "results": [
    {
      "question_id": 1,
      "correct": true
    },
    {
      "question_id": 2,
      "correct": false,
      "real_answer": "프로세스 상태"
    }
  ]
}
```

---

## **GET /sessions?user_id=1&course_id=10 — 세션 히스토리**

### ✔ Response

```json
[
  {
    "id": 100,
    "status": "Completed",
    "created_at": "2025-01-01"
  },
  {
    "id": 101,
    "status": "Completed",
    "created_at": "2025-01-02"
  }
]

```

## **GET /sessions/recent?user_id=1 — 오늘의 세션 5개**

### ✔ Response

```json
[
    {
        "sessionId": 8,
        "createdAt": "2025-11-15T08:25:15.000+00:00",
        "keywords": "한정자, 전칭명제",
        "courseId": 1,
        "courseTitle": "운영체제"
    },
    {
        "sessionId": 7,
        "createdAt": "2025-11-15T08:22:45.000+00:00",
        "keywords": "predicates, quantified statements",
        "courseId": 1,
        "courseTitle": "운영체제"
    },
    {
        "sessionId": 6,
        "createdAt": "2025-11-15T08:19:47.000+00:00",
        "keywords": "predicates, quantified statements",
        "courseId": 1,
        "courseTitle": "운영체제"
    },
    {
        "sessionId": 5,
        "createdAt": "2025-11-15T08:17:06.000+00:00",
        "keywords": "predicates, quantified statements",
        "courseId": 1,
        "courseTitle": "운영체제"
    },
    {
        "sessionId": 4,
        "createdAt": "2025-11-15T08:14:25.000+00:00",
        "keywords": "predicates, quantified statements",
        "courseId": 1,
        "courseTitle": "운영체제"
    }
]
```