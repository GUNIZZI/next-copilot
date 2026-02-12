# vite-next - Admin Dashboard

Next.js 16 + TypeScript + NextAuth + Zustand + Tailwind CSS + shadcn/ui를 사용한 관리자 대시보드 프로젝트입니다. Feature-Sliced Design (FSD) 구조로 설계되었습니다.

## 🚀 기술 스택

- **Framework**: [Next.js 16](https://nextjs.org/) - React 기반 풀스택 프레임워크
- **Language**: [TypeScript](https://www.typescriptlang.org/) - 타입 안전성
- **Authentication**: [NextAuth.js v4](https://next-auth.js.org/) - 인증 시스템
- **State Management**: [Zustand](https://zustand-demo.vercel.app/) - 가벼운 상태 관리
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - 유틸리티-퍼스트 CSS
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - 고품질 React 컴포넌트
- **Code Quality**: [ESLint](https://eslint.org/) - 코드 린팅
- **Code Formatting**: [Prettier](https://prettier.io/) - 코드 포매팅
- **Password Hash**: [bcryptjs](https://www.npmjs.com/package/bcryptjs) - 안전한 비밀번호 저장
- **Package Manager**: [pnpm](https://pnpm.io/) - 빠른 패키지 관리자

## 📁 프로젝트 구조 (FSD)

```
src/
├── auth.ts              # NextAuth 래퍼 함수
├── auth.config.ts       # NextAuth 설정
├── middleware.ts        # 라우트 보호 미들웨어
├── shared/             # 공유 계층
│   ├── ui/            # UI 컴포넌트 (Navbar, Counter)
│   ├── lib/           # 유틸리티, 상태 관리
│   ├── hooks/         # 커스텀 훅
│   ├── types/         # 타입 정의
│   └── utils/         # 도우미 함수
├── entities/           # 비즈니스 엔티티
├── features/           # 기능 모듈
├── widgets/            # 복합 위젯
└── pages/              # 페이지 컴포넌트

app/
├── api/auth/[...nextauth]/  # NextAuth API 라우트
├── (pages)/
│   ├── page.tsx              # 홈페이지
│   ├── login/page.tsx        # 로그인 페이지
│   ├── dashboard/page.tsx    # 대시보드 (인증 필수)
│   └── members/page.tsx      # 회원관리 (인증 필수)
├── layout.tsx                # 루트 레이아웃 (네비게이션)
└── globals.css               # 전역 스타일
```

## 🔐 인증 기능

### 지원하는 기능

- ✅ 이메일/비밀번호 로그인 (Credentials Provider)
- ✅ JWT 기반 세션 관리
- ✅ 보호된 라우트 (미들웨어)
- ✅ 사용자 역할 관리 (admin, user)
- ✅ 자동 로그인 리다이렉트

### 기본 계정

```
Email: admin@example.com
Password: password123
```

## 🛠️ 설치 및 시작

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

```bash
cp .env.local.example .env.local
```

### 3. 개발 서버 시작

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어주세요.

### 4. 프로덕션 빌드

```bash
pnpm build
pnpm start
```

## 📝 사용 가능한 스크립트

| 명령어              | 설명               |
| ------------------- | ------------------ |
| `pnpm dev`          | 개발 서버 시작     |
| `pnpm build`        | 프로덕션 빌드      |
| `pnpm start`        | 프로덕션 서버 시작 |
| `pnpm lint`         | ESLint 실행        |
| `pnpm lint:fix`     | ESLint 자동 수정   |
| `pnpm format`       | Prettier 포매팅    |
| `pnpm format:check` | Prettier 확인      |

## 🔐 NextAuth 설정

### 인증 플로우

1. 사용자가 `/login`에서 이메일과 비밀번호 입력
2. Credentials Provider가 사용자 인증
3. JWT 토큰 생성 및 쿠키에 저장
4. 미들웨어가 보호된 라우트 접근 확인
5. `/dashboard`, `/members`는 인증된 사용자만 접근 가능

### 환경 변수

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

## 📚 페이지 설명

### 🏠 홈페이지 (`/`)

- 로그인 상태 확인
- 프로젝트 기능 소개

### 🔑 로그인 (`/login`)

- 이메일/비밀번호 입력
- 데모 계정 정보 표시
- 자동 유효성 검사

### 📊 대시보드 (`/dashboard`) - 인증 필수

- 통계 카드 (총 회원, 활성 사용자 등)
- 최근 활동 로그
- 사용자 프로필 정보

### 👥 회원관리 (`/members`) - 인증 필수

- 회원 목록 조회
- 새 회원 추가
- 회원 상태 변경 (활성/비활성)
- 회원 삭제

## 🎨 UI 컴포넌트

### shadcn/ui

- Button - 기본 버튼 컴포넌트

### 커스텀 컴포넌트

- Navbar - 네비게이션 바 (인증 상태에 따른 메뉴 표시)
- Counter - 상태 관리 예제 (Zustand)

## 🗂️ 파일 설명

### `/src/auth.config.ts`

NextAuth 설정 파일

- Credentials Provider 설정
- JWT, Session 콜백
- 사용자 데이터 구조

### `/src/middleware.ts`

라우트 보호 미들웨어

- 보호된 라우트 인증 확인
- 로그인된 사용자의 로그인 페이지 리다이렉트

### `/src/app/api/auth/[...nextauth]/route.ts`

NextAuth API 라우트

- 로그인, 로그아웃, 세션 관리

## 🚀 다음 단계

프로젝트를 확장하려면:

1. **데이터베이스 연결**
   - Prisma ORM 설치
   - 사용자 모델 정의
   - 데이터베이스 마이그레이션

2. **추가 인증 제공자**
   - Google, GitHub OAuth 추가
   - 소셜 로그인 구현

3. **shadcn/ui 컴포넌트 추가**

   ```bash
   pnpm dlx shadcn@latest add [component-name]
   ```

4. **기능 추가**
   - 회원 권한 관리
   - 감사 로그
   - 대량 작업

## 📚 참고 자료

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js v4 Documentation](https://next-auth.js.org/)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

## 📄 라이선스

MIT

### 2. 개발 서버 시작

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어주세요.

### 3. 프로덕션 빌드

```bash
pnpm build
pnpm start
```

## 📝 사용 가능한 스크립트

| 명령어              | 설명               |
| ------------------- | ------------------ |
| `pnpm dev`          | 개발 서버 시작     |
| `pnpm build`        | 프로덕션 빌드      |
| `pnpm start`        | 프로덕션 서버 시작 |
| `pnpm lint`         | ESLint 실행        |
| `pnpm lint:fix`     | ESLint 자동 수정   |
| `pnpm format`       | Prettier 포매팅    |
| `pnpm format:check` | Prettier 확인      |

## 🎨 Zustand 상태 관리 예제

```typescript
// src/shared/lib/store.ts
import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
```

## 🎯 shadcn/ui 컴포넌트 추가

```bash
pnpm dlx shadcn@latest add [component-name]
```

예: `pnpm dlx shadcn@latest add dialog`

더 많은 컴포넌트: https://ui.shadcn.com/docs/components

## 📋 체크리스트

필요에 따라 프로젝트를 커스터마이징하세요:

- [ ] 프로젝트 이름 변경 (package.json)
- [ ] 환경 변수 설정 (.env.local)
- [ ] 새로운 엔티티/피처 추가
- [ ] 추가 shadcn/ui 컴포넌트 설치
- [ ] API 라우트 구현 (app/api/)

## 📚 참고 자료

- [Next.js Documentation](https://nextjs.org/docs)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

## 📄 라이선스

MIT
