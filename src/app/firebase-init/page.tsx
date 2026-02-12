'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { initializeFirebaseData, checkExistingData } from '@/lib/firebase-init';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface ExistingData {
  hasData: boolean;
  posts: number;
  users: number;
  stats: number;
}

export default function FirebaseInitPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<
    'idle' | 'checking' | 'initializing' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');
  const [existingData, setExistingData] = useState<ExistingData | null>(null);

  const handleCheckData = async () => {
    try {
      setLoading(true);
      setStatus('checking');
      setMessage('기존 데이터 확인 중...');

      const data = await checkExistingData();
      setExistingData(data);

      if (data?.hasData) {
        setMessage(
          `기존 데이터가 있습니다. Posts: ${data.posts}개, Users: ${data.users}개, Stats: ${data.stats}개`
        );
      } else {
        setMessage('기존 데이터가 없습니다. 초기화를 진행하세요.');
      }
      setStatus('idle');
    } catch (error) {
      setStatus('error');
      setMessage('데이터 확인 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInitialize = async () => {
    if (existingData?.hasData) {
      const confirmed = window.confirm(
        '기존 데이터가 있습니다. 초기화를 진행하시겠습니까?'
      );
      if (!confirmed) return;
    }

    try {
      setLoading(true);
      setStatus('initializing');
      setMessage('Firestore 데이터 초기화 중...');

      await initializeFirebaseData();

      setStatus('success');
      setMessage('✅ Firestore 초기화가 완료되었습니다!');

      // 3초 후 블로그 페이지로 이동
      setTimeout(() => {
        router.push('/blog');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage('초기화 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-slate-800">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Firebase 초기화
          </h1>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            Firestore 데이터베이스를 설정합니다.
          </p>

          {/* 상태 메시지 */}
          <div className="mb-8 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-start gap-3">
              {status === 'initializing' || status === 'checking' ? (
                <Loader className="mt-1 h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
              ) : status === 'success' ? (
                <CheckCircle className="mt-1 h-5 w-5 text-green-600 dark:text-green-400" />
              ) : status === 'error' ? (
                <AlertCircle className="mt-1 h-5 w-5 text-red-600 dark:text-red-400" />
              ) : (
                <AlertCircle className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
              )}
              <div>
                <p
                  className={`font-semibold ${
                    status === 'success'
                      ? 'text-green-700 dark:text-green-400'
                      : status === 'error'
                        ? 'text-red-700 dark:text-red-400'
                        : 'text-blue-700 dark:text-blue-400'
                  }`}
                >
                  {message}
                </p>
              </div>
            </div>
          </div>

          {/* 기존 데이터 정보 */}
          {existingData && (
            <div className="mb-8 rounded-lg bg-gray-50 p-4 dark:bg-slate-700/50">
              <h2 className="mb-3 font-semibold text-gray-900 dark:text-white">
                현재 Firestore 데이터
              </h2>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>📝 블로그 글: {existingData.posts}개</li>
                <li>👥 회원: {existingData.users}개</li>
                <li>📊 통계: {existingData.stats}개</li>
              </ul>
            </div>
          )}

          {/* 설정 내용 */}
          <div className="mb-8 rounded-lg bg-gray-50 p-4 dark:bg-slate-700/50">
            <h2 className="mb-3 font-semibold text-gray-900 dark:text-white">
              초기화될 데이터
            </h2>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>✅ 블로그 글 2개 (기술, 포트폴리오)</li>
              <li>✅ 회원 4명 (관리자 1명, 일반 사용자 3명)</li>
              <li>✅ 대시보드 통계</li>
            </ul>
          </div>

          {/* 버튼 그룹 */}
          <div className="flex gap-4">
            <Button
              onClick={handleCheckData}
              disabled={loading}
              variant="outline"
              className="flex-1"
            >
              {loading && status === 'checking' ? '확인 중...' : '데이터 확인'}
            </Button>

            <Button
              onClick={handleInitialize}
              disabled={loading}
              className="flex-1"
            >
              {loading && status === 'initializing'
                ? '초기화 중...'
                : 'Firestore 초기화'}
            </Button>
          </div>

          {/* 주의사항 */}
          <div className="mt-8 rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              💡 <strong>처음 한 번만 실행하세요.</strong> 데이터가 이미 있는
              경우 덮어쓰기됩니다.
            </p>
          </div>
        </div>

        {/* 개발 정보 */}
        <div className="mt-8 rounded-lg bg-gray-100 p-6 dark:bg-slate-900">
          <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
            🛠️ 개발 안내
          </h3>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p>• 이 페이지는 개발 환경에서만 사용됩니다.</p>
            <p>• 프로덕션에서는 이 페이지를 삭제하거나 보호해야 합니다.</p>
            <p>
              • 초기화 후 <strong>/blog</strong> 페이지로 이동합니다.
            </p>
            <p>
              • 문제가 발생하면 Firebase Console에서 직접 데이터를 관리할 수
              있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
