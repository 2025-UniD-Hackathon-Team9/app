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
| **Documents** | POST | /api/documents/process | PDF 업로드 | O | ❌ |
| **Sessions** | GET | /api/sessions/:id | 세션 문제 조회 | O | ❌ |
| **Sessions** | POST | /api/sessions/:id/submit | 세션 전체 제출 및 채점 | O | ❌ |
| **Sessions** | GET | /api/sessions?user_id=1&course_id=1 | 세션 기록 조회 | O | ❌ |
| **Sessions** | GET | api/sessions/recent?user_id=1 | 오늘의 세션(5개) 조회 | O | ❌ |
| **Sessions** | POST | /api/sessions/{sessionId}/questions/{questionId}/submit | 개별 채점 | O | ❌ |

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
    "session_id": 9,
    "course_id": 1,
    "status": "InProgress",
    "questions": [
        {
            "id": 64,
            "item_order": 1,
            "type": "객관식",
            "question_text": "선비의 책임의식을 강조한 구절은?",
            "options": [
                "\"임중도원\"",
                "\"홍의\"",
                "\"세한도\"",
                "\"시중\""
            ]
        },
        {
            "id": 65,
            "item_order": 2,
            "type": "객관식",
            "question_text": "추사 김정희의 작품으로 선비의 지조를 상징하는 그림은?",
            "options": [
                "\"세한도\"",
                "\"임중도원\"",
                "\"홍의\"",
                "\"시중\""
            ]
        },
        {
            "id": 66,
            "item_order": 3,
            "type": "객관식",
            "question_text": "군자가 의리를 추구할 때 중시하는 자세는?",
            "options": [
                "\"시중\"",
                "\"홍의\"",
                "\"견리사의\"",
                "\"임중도원\""
            ]
        },
        {
            "id": 67,
            "item_order": 4,
            "type": "단답식",
            "question_text": "이익을 볼 때 의로움을 생각하는 자세는?",
            "options": null
        },
        {
            "id": 68,
            "item_order": 5,
            "type": "단답식",
            "question_text": "선비가 갖춰야 할 넓은 마음과 굳센 의지를 뜻하는 단어는?",
            "options": null
        },
        {
            "id": 69,
            "item_order": 6,
            "type": "OX",
            "question_text": "임중도원은 선비의 도량이 넓고 뜻이 굳세어야 함을 강조한다. (O/X)",
            "options": null
        },
        {
            "id": 70,
            "item_order": 7,
            "type": "OX",
            "question_text": "'인'은 사람의 편안한 거처이고 '의'는 사람의 바른 길이라고 했다. (O/X)",
            "options": null
        },
        {
            "id": 71,
            "item_order": 8,
            "type": "객관식",
            "question_text": "소인이 용맹은 있으나 의가 없으면 어떤 존재가 되는가?",
            "options": [
                "\"도둑\"",
                "\"혼란\"",
                "\"군자\"",
                "\"선비\""
            ]
        },
        {
            "id": 72,
            "item_order": 9,
            "type": "단답식",
            "question_text": "군자가 세상을 대할 때 의를 가까이 하는 자세는?",
            "options": null
        },
        {
            "id": 73,
            "item_order": 10,
            "type": "OX",
            "question_text": "세한도는 추운 날씨에 소나무와 잣나무가 시드는 모습을 그린 그림이다. (O/X)",
            "options": null
        }
    ]
}
```

---

## **POST /sessions/:sessionId/submit — 세션 답 전체 제출**

completed는 다 제출했는지 여부

### ✔ Request

```json
{
  "answers": [
    { "session_question_id": 64, "user_answer": "책임이 무겁고 길이 멀다" },
    { "session_question_id": 65, "user_answer": "책임이 무겁고 길이 멀다" },
    { "session_question_id": 66, "user_answer": "시중" },
    { "session_question_id": 67, "user_answer": "견리사의" },
    { "session_question_id": 68, "user_answer": "ㅁㅁ" },
    { "session_question_id": 69, "user_answer": "X" },
    { "session_question_id": 70, "user_answer": "O" },
    { "session_question_id": 71, "user_answer": "도둑" },
    { "session_question_id": 72, "user_answer": "시중" },
    { "session_question_id": 73, "user_answer": "X" }
  ]
}

```

### ✔ Response

```json
{
    "session_id": 9,
    "score": 70,
    "results": [
        {
            "question_id": 64,
            "correct": false,
            "real_answer": "임중도원"
        },
        {
            "question_id": 65,
            "correct": false,
            "real_answer": "세한도"
        },
        {
            "question_id": 66,
            "correct": true,
            "real_answer": null
        },
        {
            "question_id": 67,
            "correct": true,
            "real_answer": null
        },
        {
            "question_id": 68,
            "correct": false,
            "real_answer": "홍의"
        },
        {
            "question_id": 69,
            "correct": true,
            "real_answer": null
        },
        {
            "question_id": 70,
            "correct": true,
            "real_answer": null
        },
        {
            "question_id": 71,
            "correct": true,
            "real_answer": null
        },
        {
            "question_id": 72,
            "correct": true,
            "real_answer": null
        },
        {
            "question_id": 73,
            "correct": true,
            "real_answer": null
        }
    ],
    "completed": true
}
```

---

## **GET /sessions?user_id=1&course_id=1 — 세션 히스토리**

### ✔ Response

```json
[
    {
        "id": 9,
        "status": "Completed",
        "created_at": "2025-11-15 17:26:51.0"
    },
    {
        "id": 8,
        "status": "InProgress",
        "created_at": "2025-11-15 17:25:15.0"
    },
    {
        "id": 7,
        "status": "InProgress",
        "created_at": "2025-11-15 17:22:45.0"
    },
    {
        "id": 6,
        "status": "InProgress",
        "created_at": "2025-11-15 17:19:47.0"
    },
    {
        "id": 5,
        "status": "InProgress",
        "created_at": "2025-11-15 17:17:06.0"
    },
    {
        "id": 4,
        "status": "InProgress",
        "created_at": "2025-11-15 17:14:25.0"
    },
    {
        "id": 3,
        "status": "InProgress",
        "created_at": "2025-11-15 17:11:53.0"
    },
    {
        "id": 2,
        "status": "InProgress",
        "created_at": "2025-11-15 17:01:38.0"
    },
    {
        "id": 1,
        "status": "InProgress",
        "created_at": "2025-11-15 16:59:12.0"
    }
]
```

---

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

---

## **POST /sessions/{sessionId}/questions/{questionId}/submit**

### ■ Path Parameters

| 이름 | 타입 | 설명 |
| --- | --- | --- |
| `sessionId` | Long | 세션 ID |
| `questionId` | Long | 문제 ID |

### Request Body (JSON)

```json
{
  "userAnswer": "사용자가 입력한 답"
}

```

### Response (정답)

```json
{
  "correct": true,
  "realAnswer": null
}

```

### Response (오답)

```json
{
  "correct": false,
  "realAnswer": "실제 정답"
}

```

---