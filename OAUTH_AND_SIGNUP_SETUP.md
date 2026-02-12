# OAuth 및 회원가입 설정 가이드

Firebase 기반 회원가입과 Google, GitHub SNS 로그인을 활성화하기 위한 설정 방법입니다.

## 📋 필요한 작업

### 1단계: Google OAuth 설정

#### 1.1 Google Cloud 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 새 프로젝트 생성 (프로젝트명: next-copilot)
3. **API 및 서비스** → **OAuth 동의 화면** 클릭
4. User Type: **외부** 선택
5. 앱 정보 입력:
   - 앱 이름: next-copilot
   - 사용자 지원 이메일: your-email@gmail.com
   - 개발자 연락처: your-email@gmail.com
6. **저장 후 계속** → **앱 인증 정보** 클릭

#### 1.2 OAuth 2.0 클라이언트 ID 생성

1. **앱 인증 정보** → **+ 인증 정보 만들기** → **OAuth 클라이언트 ID**
2. 애플리케이션 유형: **웹 애플리케이션**
3. 이름: next-copilot
4. **승인된 JavaScript 원본** 추가:
   ```
   http://localhost:3000
   https://your-domain.com (배포 시)
   ```
5. **승인된 리디렉션 URI** 추가:
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-domain.com/api/auth/callback/google (배포 시)
   ```
6. **만들기** 클릭
7. **클라이언트 ID**와 **클라이언트 보안 비밀번호** 복사

### 2단계: GitHub OAuth 설정

#### 2.1 GitHub 앱 생성

1. [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers) 접속
2. **New OAuth App** 클릭
3. 앱 정보 입력:
   - **Application name**: next-copilot
   - **Homepage URL**: http://localhost:3000 (또는 배포 도메인)
   - **Authorization callback URL**: http://localhost:3000/api/auth/callback/github
4. **Register application** 클릭
5. **Client ID**와 **Client secrets** → **Generate a new client secret** 클릭
6. **Client ID**와 생성된 **Client Secret** 복사

### 3단계: .env.local 파일 업데이트

`.env.local` 파일에 다음 환경 변수 추가:

```env
# 기존 Firebase 설정
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID

# Google OAuth
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

# GitHub OAuth
GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET

# NextAuth 설정
NEXTAUTH_URL=http://localhost:3000 (또는 배포 도메인)
NEXTAUTH_SECRET=your-random-secret-key (openssl rand -base64 32 로 생성)
```

### 4단계: 개발 서버 재시작

```bash
Ctrl+C  # 기존 서버 중지
pnpm dev  # 새로운 환경 변수로 다시 시작
```

## 🔐 회원가입 및 로그인 기능

### 회원가입 페이지 (`/signup`)

**일반 회원가입 (이메일 + 비밀번호)**

- 이름, 이메일, 비밀번호, 비밀번호 확인 입력
- 자동으로 role: 'user' 로 생성
- 회원가입 후 자동 로그인

**SNS 로그인**

- **Google로 가입**: Google 계정 선택 → 자동 회원가입
- **GitHub로 가입**: GitHub 계정 인증 → 자동 회원가입
- SNS 사용자는 자동으로 role: 'user' 할당

### 로그인 페이지 (`/login`)

**일반 로그인**

- 이메일과 비밀번호로 로그인

**SNS 로그인**

- **Google로 로그인**: 기존 계정이면 로그인, 없으면 회원가입
- **GitHub로 로그인**: 기존 계정이면 로그인, 없으면 회원가입

## 🔄 사용자 데이터 흐름

### 일반 회원가입

```
사용자 입력 → /api/auth/signup → Firebase Firestore 저장 → 세션 생성
```

### SNS 로그인

```
OAuth 제공자 인증 → NextAuth signIn 콜백 → Firestore 확인
→ 없으면 자동 생성 (role: user) → 세션 생성
```

### Firebase users 컬렉션 구조 (SNS 사용자)

```javascript
{
  id: "auto_generated",
  name: "사용자 이름 (제공자에서)",
  email: "user@example.com",
  passwordHash: "oauth_random_string", // OAuth 사용자는 더미 비밀번호
  role: "user", // SNS 로그인은 항상 user 권한
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 📁 관련 파일

- **회원가입 페이지**: [src/app/signup/page.tsx](src/app/signup/page.tsx)
- **회원가입 API**: [src/app/api/auth/signup/route.ts](src/app/api/auth/signup/route.ts)
- **로그인 페이지**: [src/app/login/page.tsx](src/app/login/page.tsx)
- **인증 설정**: [src/auth.config.ts](src/auth.config.ts)
- **Firebase 서비스**: [src/shared/services/firebase.service.ts](src/shared/services/firebase.service.ts)

## 🧪 테스트 방법

### 1. 일반 회원가입 테스트

1. `/signup` 접속
2. 이름, 이메일, 비밀번호 입력
3. "회원가입" 버튼 클릭
4. 자동 로그인 후 `/blog` 페이지로 이동

### 2. Google SNS 로그인 테스트

1. `/login` 또는 `/signup` 접속
2. "Google로 로그인/가입" 버튼 클릭
3. Google 계정 선택
4. 자동으로 회원가입 되거나 로그인
5. `/blog` 페이지로 이동

### 3. GitHub SNS 로그인 테스트

1. `/login` 또는 `/signup` 접속
2. "GitHub로 로그인/가입" 버튼 클릭
3. GitHub 계정 인증
4. 자동으로 회원가입 되거나 로그인
5. `/blog` 페이지로 이동

### 4. Firestore 확인

1. Firebase Console → Firestore
2. `users` 컬렉션 확인
3. SNS로 로그인한 사용자 확인:
   - `role: "user"` 확인
   - `passwordHash`는 `oauth_`로 시작

## 🔒 보안 고려사항

### 현재 구현

- ✅ 일반 회원가입: bcrypt 비밀번호 해싱
- ✅ SNS 로그인: OAuth 표준 프로토콜 사용
- ✅ 세션 관리: NextAuth.js JWT 토큰
- ✅ 역할 기반 접근 제어 (RBAC)

### 환경 변수 보안

- ❌ 절대로 클라이언트에 `NEXTAUTH_SECRET` 노출 금지
- ❌ `.env.local` 파일을 버전 관리에 커밋하지 않기
- ✅ 배포 시 환경 변수를 CI/CD 파이프라인에서 설정

### 향후 개선 사항

- [ ] 이메일 인증 기능 추가
- [ ] 비밀번호 재설정 기능
- [ ] 소셜 계정 연결 기능
- [ ] 2단계 인증 (2FA)
- [ ] API 레이트 제한
- [ ] 비밀번호 복잡도 검증

## 🚀 프로덕션 배포

### Vercel 배포 시

1. **프로젝트 설정**
2. **Environment Variables** 추가:
   - 모든 `.env.local` 값 추가
   - `NEXTAUTH_URL`을 배포 도메인으로 설정 (예: https://myapp.vercel.app)
   - `NEXTAUTH_SECRET` 생성 및 설정

3. **OAuth 리디렉션 URI 업데이트**
   - Google: `https://myapp.vercel.app/api/auth/callback/google`
   - GitHub: `https://myapp.vercel.app/api/auth/callback/github`

### Docker 배포 시

```dockerfile
ENV NEXTAUTH_URL=https://your-domain.com
ENV NEXTAUTH_SECRET=your-secret
ENV GOOGLE_CLIENT_ID=xxx
ENV GOOGLE_CLIENT_SECRET=xxx
ENV GITHUB_CLIENT_ID=xxx
ENV GITHUB_CLIENT_SECRET=xxx
```

## 📖 참고 자료

- [NextAuth.js 공식 문서](https://next-auth.js.org/)
- [Google OAuth 설정 가이드](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth 앱 가이드](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
