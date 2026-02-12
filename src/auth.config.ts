import bcrypt from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';

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

// Mock users database
const users = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    password: bcrypt.hashSync('password123', 10), // password: "password123"
    role: 'admin',
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'Normal User',
    password: bcrypt.hashSync('password123', 10),
    role: 'user',
  },
];

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

        const user = users.find((u) => u.email === credentials.email);
        if (!user) {
          throw new Error('User not found');
        }

        const passwordMatch = bcrypt.compareSync(
          credentials.password as string,
          user.password
        );

        if (!passwordMatch) {
          throw new Error('Invalid password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
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
