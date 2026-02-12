'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { userService, blogService } from '@/shared/services/firebase.service';

interface DashboardStats {
  totalMembers: number;
  totalPosts: number;
  totalViews: number;
  activeMembers: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    totalPosts: 0,
    totalViews: 0,
    activeMembers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user?.role !== 'admin') {
      router.push('/');
    } else {
      loadStats();
    }
  }, [status, router, session]);

  const loadStats = async () => {
    try {
      setLoading(true);
      // Firebase에서 통계 데이터 로드
      const users = await userService.getAllUsers();
      const posts = await blogService.getAllPosts();

      setStats({
        totalMembers: users.length,
        totalPosts: posts.length,
        totalViews: posts.reduce((sum, post) => sum + post.views, 0),
        activeMembers: users.filter((u) => u.role === 'admin').length,
      });
    } catch (error) {
      console.error('통계 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome back, {session.user?.name}!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Stats Cards */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Members
                </p>
                <p className="mt-2 text-3xl font-bold text-black dark:text-white">
                  {stats.totalMembers}
                </p>
              </div>
              <div className="rounded-lg bg-indigo-100 p-3 dark:bg-indigo-900">
                <svg
                  className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 12H9m4 5H9m6 0h.01M3 20h18a2 2 0 002-2V6a2 2 0 00-2-2H3a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Users
                </p>
                <p className="mt-2 text-3xl font-bold text-black dark:text-white">
                  {stats.activeMembers}
                </p>
              </div>
              <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
                <svg
                  className="h-6 w-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Blog Posts
                </p>
                <p className="mt-2 text-3xl font-bold text-black dark:text-white">
                  {stats.totalPosts}
                </p>
              </div>
              <div className="rounded-lg bg-yellow-100 p-3 dark:bg-yellow-900">
                <svg
                  className="h-6 w-6 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-slate-800">
          <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
            Recent Activity
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-700">
              <span className="text-gray-700 dark:text-gray-300">
                New user registered
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                2 hours ago
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-700">
              <span className="text-gray-700 dark:text-gray-300">
                Member status updated
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                4 hours ago
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                System backup completed
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                1 day ago
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
          <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-300">
            Your Profile
          </h3>
          <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-400">
            <li>
              <strong>Name:</strong> {session.user?.name}
            </li>
            <li>
              <strong>Email:</strong> {session.user?.email}
            </li>
            <li>
              <strong>Role:</strong> {session.user?.role}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
