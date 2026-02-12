# 회원 인증 및 권한 시스템 가이드

이 프로젝트는 Firebase Firestore를 기반으로 한 역할 기반 접근 제어(RBAC) 시스템을 구현했습니다.

## 📋 회원 역할 (Roles)

### 1. 관리자 (Admin)

- **대시보드 (Dashboard)**: 통계 조회 및 관리
- **회원 관리 (Members)**: 회원 추가, 수정, 삭제
- **블로그**: 모든 사용자의 글 수정 및 삭제 가능

### 2. 일반 사용자 (User)

- **블로그 작성**: 새 글 작성 가능
- **글 관리**: 자신이 작성한 글만 수정 및 삭제 가능
- **블로그 열람**: 발행된 모든 글 열람 가능

## 🔐 회원 데이터 구조

Firebase Firestore의 `users` 컬렉션에 저장되는 사용자 정보:

```javascript
{
  id: "user_document_id",
  name: "사용자 이름",
  email: "user@example.com",
  passwordHash: "bcrypt_hashed_password",  // 해시된 비밀번호
  role: "admin" | "user",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 👤 테스트 계정

프로젝트 초기화 시 다음 테스트 계정이 자동으로 생성됩니다:

### 일반 사용자 계정

- **이메일**: john@example.com
- **비밀번호**: password123
- **역할**: user

- **이메일**: jane@example.com
- **비밀번호**: password123
- **역할**: user

- **이메일**: bob@example.com
- **비밀번호**: password123
- **역할**: user

### 관리자 계정

관리자 계정은 더 이상 제공되지 않습니다. 필요할 경우:

1. Firebase Console에서 새 사용자 추가
2. `role` 필드를 `'admin'`으로 설정

## 🔑 로그인 메커니즘

### 인증 프로세스

1. 사용자가 이메일과 비밀번호로 로그인
2. NextAuth.js의 Credentials Provider가 요청 처리
3. Firebase Firestore에서 사용자 이메일로 검색
4. bcrypt를 사용하여 입력된 비밀번호와 저장된 해시 비교
5. 일치하면 세션에 사용자 정보 저장 (id, email, name, role)

### SNS 로그인

- Google 또는 GitHub로 로그인 가능
- 새 사용자는 자동으로 생성되며 'user' 권한 할당

### 인증 설정 파일

- **위치**: [src/auth.config.ts](src/auth.config.ts)
- **공급자**:
  - NextAuth.js Credentials Provider (이메일/비밀번호)
  - Google OAuth 2.0
  - GitHub OAuth
- **저장소**: Firebase Firestore

## 🛡️ 페이지별 접근 제어

### 공개 페이지

- `/`: 홈 페이지 (모든 사용자 접근 가능)
- `/blog`: 블로그 목록 (모든 사용자 접근 가능)
- `/blog/[id]`: 블로그 상세 (모든 사용자 접근 가능)
- `/login`: 로그인 페이지

### 인증 필수 페이지

- `/blog/create`: 새 글 작성 (인증된 모든 사용자)

### 관리자 전용 페이지

- `/dashboard`: 통계 대시보드
- `/members`: 회원 관리

## 📝 블로그 권한 정책

### 글 작성

- **누가**: 인증된 모든 사용자
- **저장 위치**: Firebase Firestore `posts` 컬렉션
- **authorId**: 작성 시 세션의 사용자 ID로 자동 저장

### 글 수정/삭제

- **누가**: 작성자 또는 관리자
- **확인 방식**: 글 상세 페이지에서 현재 사용자의 ID가 `post.authorId`와 일치하거나, 역할이 'admin'인지 확인

### 글 발행

- **published 필드**: 글 작성 시 `published` 필드로 공개/비공개 설정
- **목록 표시**: `/blog` 페이지에서 `published: true`인 글만 표시

## 🔄 사용자 추가 절차

### 회원가입 (현재 미구현)

향후 구현 예정

### 관리자가 회원 추가

1. `/members` 페이지 접근 (admin 계정)
2. "Add Member" 버튼 클릭
3. 다음 정보 입력:
   - **Name**: 사용자 이름
   - **Email**: 이메일 주소
   - **Password**: 비밀번호
   - **Role**: admin 또는 user 선택
4. "Add Member" 버튼 클릭
5. 입력한 비밀번호는 bcrypt로 해시되어 Firestore에 저장

## 🔗 관련 파일

- **인증 설정**: [src/auth.config.ts](src/auth.config.ts)
- **Firebase 서비스**: [src/shared/services/firebase.service.ts](src/shared/services/firebase.service.ts)
- **로그인 페이지**: [src/app/login/page.tsx](src/app/login/page.tsx)
- **대시보드**: [src/app/dashboard/page.tsx](src/app/dashboard/page.tsx)
- **회원 관리**: [src/app/members/page.tsx](src/app/members/page.tsx)
- **블로그 작성**: [src/app/blog/create/page.tsx](src/app/blog/create/page.tsx)
- **블로그 상세**: [src/app/blog/[id]/page.tsx](src/app/blog/[id]/page.tsx)

## 🚀 테스트 방법

### 1. 회원가입 (권장)

```
URL: /signup
```

1. `/signup` 페이지 접속
2. 이름, 이메일, 비밀번호 입력
3. "회원가입" 버튼 클릭
4. 자동으로 로그인되고 `/blog` 페이지로 이동

### 2. SNS로 회원가입

1. `/signup` 또는 `/login` 페이지 접속
2. "Google로 가입" 또는 "GitHub로 가입" 버튼 클릭
3. OAuth 제공자 계정 선택/인증
4. 자동으로 가입되고 로그인

### 3. 초기 테스트 계정으로 로그인

```
이메일: john@example.com
비밀번호: password123
```

- `/blog/create`에서 새 글 작성 가능
- 자신이 작성한 글만 수정/삭제 가능
- `/dashboard`와 `/members` 접근 불가

### 4. 회원 관리 (관리자만)

관리자 계정이 필요한 경우:

1. Firebase Console 접속
2. Firestore → users 컬렉션
3. 사용자 문서의 `role` 필드를 `'admin'`으로 수정
4. `/members` 페이지에서 회원 추가/삭제 가능

### 5. 로그인/로그아웃 테스트

1. `/login` 페이지에서 로그인
2. Navbar의 사용자 이름 표시 확인
3. Logout 버튼 클릭
4. 자동으로 `/login`으로 이동 및 Navbar 업데이트 확인

## 🔒 보안 고려사항

### 현재 구현

- ✅ 비밀번호는 bcrypt로 해시되어 저장
- ✅ NextAuth.js를 통한 세션 관리
- ✅ 역할 기반 페이지 접근 제어
- ✅ 글 작성자 기반 권한 확인

### 향후 개선 사항

- [ ] 회원가입 기능 추가
- [ ] 비밀번호 재설정 기능
- [ ] 로그아웃 시 세션 정리
- [ ] JWT 토큰 기반 인증으로 전환 검토
- [ ] 비밀번호 복잡도 검증
- [ ] 로그인 시도 횟수 제한

## ⚙️ Firebase 설정

Firestore 보안 규칙 (개발 모드):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

프로덕션 모드로 변경 시 구체적인 규칙 정의 필요:

```javascript
match /posts/{document=**} {
  allow read: if true;
  allow create, update, delete: if request.auth.uid != null;
}
match /users/{document=**} {
  allow read, write: if request.auth.uid == resource.id;
  allow read: if request.auth.uid != null;
}
```
