import bcrypt from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import type { NextAuthOptions } from 'next-auth';
import { userService } from '@/shared/services/firebase.service';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
  }

  interface Session {
    user: User;
  }
}

// Firebase 사용자만 사용

const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        try {
          // Firebase에서 사용자 조회
          const user = await userService.getUserByEmail(credentials.email);

          if (
            user &&
            userService.verifyPassword(
              credentials.password as string,
              user.passwordHash
            )
          ) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }

          throw new Error('Invalid credentials');
        } catch (error) {
          console.error('인증 오류:', error);
          throw new Error('Authentication failed');
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // OAuth 로그인 (Google, GitHub)
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          // 기존 사용자인지 확인
          const existingUser = await userService.getUserByEmail(
            user.email || ''
          );

          if (!existingUser) {
            // 새 사용자 생성 (role: user)
            await userService.createUser({
              name: user.name || user.email?.split('@')[0] || 'User',
              email: user.email || '',
              password: 'oauth_' + Math.random().toString(36).slice(2), // OAuth 사용자는 더미 비밀번호
              role: 'user', // SNS 로그인 사용자는 일반 유저
            });
          }
        } catch (error) {
          console.error('OAuth 사용자 저장 오류:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      } else if (token.email) {
        // OAuth 로그인 후 역할 정보 추가
        try {
          const dbUser = await userService.getUserByEmail(token.email);
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
          }
        } catch (error) {
          console.error('사용자 정보 조회 오류:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

export default authOptions;
