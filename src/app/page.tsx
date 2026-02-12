'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-slate-900">
      <main className="flex w-full max-w-2xl flex-col items-center justify-center gap-8 px-4 py-12">
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-bold text-black dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Built with Next.js, TypeScript, and NextAuth
          </p>
        </div>

        {session ? (
          <div className="flex flex-col gap-4">
            <p className="text-center text-gray-700 dark:text-gray-300">
              Welcome, <strong>{session.user?.name}</strong>!
            </p>
            <div className="flex gap-4">
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
              <Link href="/members">
                <Button variant="outline">Manage Members</Button>
              </Link>
            </div>
          </div>
        ) : (
          <Link href="/login">
            <Button size="lg">Sign In</Button>
          </Link>
        )}

        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-slate-800">
          <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
            Features
          </h2>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>✅ Next.js 16 with App Router</li>
            <li>✅ TypeScript for type safety</li>
            <li>✅ NextAuth.js v4 for authentication</li>
            <li>✅ Zustand for state management</li>
            <li>✅ Tailwind CSS + shadcn/ui</li>
            <li>✅ Feature-Sliced Design (FSD) structure</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
