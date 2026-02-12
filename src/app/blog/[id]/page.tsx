'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useBlogStore } from '@/features/blog/model/blog-store';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Eye, Edit2, Trash2, Tag } from 'lucide-react';

export default function BlogDetailPage() {
  const params = useParams();
  const postId = (params?.id as string) || '';
  const { posts, deletePost } = useBlogStore();

  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12 dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto max-w-4xl">
          <Link href="/blog">
            <Button variant="outline" className="mb-8 gap-2">
              <ArrowLeft className="h-4 w-4" />
              돌아가기
            </Button>
          </Link>

          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-600 dark:bg-slate-800">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              글을 찾을 수 없습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleDelete = () => {
    if (confirm('정말 이 글을 삭제하시겠습니까?')) {
      deletePost(post.id);
      window.location.href = '/blog';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-4xl">
        {/* 상단 네비게이션 */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/blog">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              돌아가기
            </Button>
          </Link>

          <div className="flex gap-2">
            <Button variant="outline" size="icon" title="수정">
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleDelete}
              title="삭제"
              className="text-red-600 hover:text-red-700 dark:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 커버 이미지 */}
        {post.coverImage && (
          <div className="mb-8 h-96 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-slate-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* 제목 및 메타 정보 */}
        <div className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
              {post.category === 'portfolio'
                ? '포트폴리오'
                : post.category === 'tech'
                  ? '기술'
                  : '기타'}
            </span>
            {!post.published && (
              <span className="inline-block rounded-full bg-gray-100 px-4 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                작성 중
              </span>
            )}
          </div>

          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {post.views}
            </div>
          </div>
        </div>

        {/* 태그 */}
        {post.tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 본문 */}
        <article className="prose prose-lg dark:prose-invert max-w-none rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-slate-800">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        {/* 하단 네비게이션 */}
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
          <Link href="/blog">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              블로그로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
