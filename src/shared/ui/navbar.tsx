'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { Session } from 'next-auth';

interface NavbarProps {
  session: Session | null;
}

export function Navbar({ session }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.refresh();
    router.push('/login');
  };

  return (
    <nav className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              Admin
            </Link>

            {session && (
              <div className="flex gap-6">
                <Link
                  href="/dashboard"
                  className={`transition-colors ${
                    isActive('/dashboard')
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/members"
                  className={`transition-colors ${
                    isActive('/members')
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  Members
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {session.user?.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
