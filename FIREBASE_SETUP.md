# Firebase 설정 가이드

이 프로젝트가 Firebase와 연동되도록 설정된 상태입니다.

## 📋 필요한 작업

### 1단계: Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com)에 접속
2. **새 프로젝트 만들기** 클릭
3. 프로젝트 이름 입력 (예: next-copilot)
4. 분석 활성화 (선택사항)
5. 프로젝트 만들기

### 2단계: Firestore Database 설정

1. Firebase Console → **Firestore Database** 클릭
2. **데이터베이스 만들기** 클릭
3. 위치 선택 (아시아-동남쪽 추천)
4. 보안 규칙 선택: **프로덕션 모드** 또는 **테스트 모드**

   ```javascript
   // 테스트 모드 (개발용)
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }

   // 프로덕션 모드 (권장)
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /posts/{document=**} {
         allow read: if true;
         allow create, update, delete: if request.auth.uid != null;
       }
       match /users/{document=**} {
         allow read, write: if request.auth.uid == resource.id;
         allow read: if request.auth.uid != null;
       }
       match /stats/{document=**} {
         allow read: if true;
         allow write: if request.auth.uid != null;
       }
     }
   }
   ```

### 3단계: 프로젝트 설정 정보 복사

1. Firebase Console → **Project Settings** (⚙️ 아이콘)
2. **General** 탭
3. 앱 추가 → **웹** 선택
4. 다음 정보 복사:
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID

### 4단계: .env.local 파일 업데이트

프로젝트 루트의 `.env.local` 파일을 열고 다음 값들을 입력:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

### 5단계: Firestore 컬렉션 구조

Firebase Console → Firestore에서 다음 컬렉션을 생성:

#### 1. **posts** 컬렉션

```javascript
{
  id: "post_id",
  title: "글 제목",
  content: "<html>본문</html>",
  excerpt: "요약",
  coverImage: "https://...",
  category: "tech", // "tech", "portfolio", "other"
  tags: ["tag1", "tag2"],
  authorId: "user_id",
  published: true,
  views: 0,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### 2. **users** 컬렉션

```javascript
{
  id: "user_id",
  name: "사용자 이름",
  email: "user@example.com",
  role: "admin", // "admin", "user"
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### 3. **stats** 컬렉션

```javascript
{
  id: "dashboard",
  totalUsers: 10,
  totalPosts: 5,
  totalViews: 1000,
  updatedAt: Timestamp
}
```

## 🚀 개발 서버 실행

설정을 완료했으면, 다음 명령어로 개발 서버를 실행:

```bash
pnpm dev
```

## 📚 연동된 기능

### 블로그 기능

- ✅ Firebase Firestore에서 글 목록 조회
- ✅ 새 글 작성 시 Firebase에 저장
- ✅ 글 상세 보기
- ✅ 글 삭제 (관리자만)
- ✅ 조회수 자동 증가

### 회원 관리 기능

- ✅ Firebase에서 회원 목록 조회
- ✅ 새 회원 추가
- ✅ 회원 정보 수정
- ✅ 회원 삭제 (관리자만)

### 대시보드

- ✅ 총 회원 수
- ✅ 활성 관리자 수
- ✅ 총 블로그 글 수
- ✅ 총 조회수

## 🔐 테스트 계정

개발 중에는 아래 계정으로 테스트할 수 있습니다 (회원가입 필요):

```
일반 사용자 계정 (초기화 시 자동 생성):
- 이메일: john@example.com
- 비밀번호: password123
- 이메일: jane@example.com
- 비밀번호: password123
- 이메일: bob@example.com
- 비밀번호: password123

관리자 계정:
- 관리자는 더 이상 제공되지 않습니다.
- Firebase Console에서 직접 role을 'admin'으로 설정하여 생성할 수 있습니다.
```

## ➕ 회원가입

- `/signup` 페이지에서 새 계정 생성 가능
- Google 또는 GitHub로도 가입 가능
- 가입한 사용자는 자동으로 'user' 권한 할당

## 🛠️ 문제 해결

### Firebase 연결 실패

- `.env.local` 파일의 환경 변수 확인
- Firebase Console에서 프로젝트 ID 재확인
- 네트워크 연결 확인

### Firestore 권한 오류

- Firestore 보안 규칙 확인
- 테스트 모드에서 개발 후 프로덕션 규칙 적용 권장

### 환경 변수 미적용

- 개발 서버 재시작: `Ctrl+C` → `pnpm dev`

## 📖 참고 자료

- [Firebase 문서](https://firebase.google.com/docs)
- [Firestore 시작하기](https://firebase.google.com/docs/firestore/quickstart)
- [Firebase 보안 규칙](https://firebase.google.com/docs/firestore/security/start)
