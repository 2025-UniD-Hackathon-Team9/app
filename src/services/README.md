# Services 디렉토리

비즈니스 로직과 외부 서비스 연동을 관리하는 디렉토리입니다.

## API vs Services

- **API**: HTTP 요청/응답 처리
- **Services**: 비즈니스 로직, 데이터 가공, 여러 API 조합

## 사용 예시

```typescript
// auth.service.ts
import { userApi } from '../api/user.api';
import { storage } from '../utils/storage';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await userApi.login(email, password);
    await storage.set('token', response.data.token);
    return response.data.user;
  },

  logout: async () => {
    await storage.remove('token');
  },

  getCurrentUser: async () => {
    const token = await storage.get('token');
    if (!token) return null;
    return userApi.getProfile();
  },
};

// notification.service.ts
import * as Notifications from 'expo-notifications';

export const notificationService = {
  configure: () => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  },

  sendLocal: async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  },
};
```
