'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useBlogStore } from '@/features/blog/model/blog-store';
import { PostCard } from '@/features/blog/ui/post-card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { BlogPost } from '@/entities/blog/types';

export default function BlogPage() {
  const { posts, setPosts } = useBlogStore();
  const [filter, setFilter] = useState<'all' | 'portfolio' | 'tech'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 초기 데이터 로드 (나중에 API로 변경)
  useEffect(() => {
    const mockPosts: BlogPost[] = [
      {
        id: '1',
        title: 'Next.js 16 업그레이드 가이드',
        content: '<p>Next.js 16의 새로운 기능들...</p>',
        excerpt:
          'Next.js 16으로 업그레이드하면서 겪었던 경험과 팁을 공유합니다.',
        coverImage:
          'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=600&h=300&fit=crop',
        category: 'tech',
        tags: ['Next.js', 'React', 'TypeScript'],
        authorId: 'user1',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
        published: true,
        views: 245,
      },
      {
        id: '2',
        title: '포트폴리오 프로젝트 - Admin Dashboard',
        content: '<p>NextAuth를 사용한 인증 시스템...</p>',
        excerpt:
          'Next.js와 NextAuth.js를 사용하여 만든 Admin Dashboard 프로젝트입니다.',
        coverImage:
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=300&fit=crop',
        category: 'portfolio',
        tags: ['Next.js', 'TypeScript', 'TailwindCSS'],
        authorId: 'user1',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        published: true,
        views: 432,
      },
    ];
    setPosts(mockPosts);
  }, [setPosts]);

  const filteredPosts = posts.filter((post) => {
    const matchesFilter = filter === 'all' || post.category === filter;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch && post.published;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-6xl">
        {/* 헤더 */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            블로그
          </h1>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
            포트폴리오와 기술 관련 글들을 공유합니다.
          </p>

          <Link href="/blog/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />새 글 작성
            </Button>
          </Link>
        </div>

        {/* 필터 & 검색 */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setFilter('portfolio')}
              className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                filter === 'portfolio'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700'
              }`}
            >
              포트폴리오
            </button>
            <button
              onClick={() => setFilter('tech')}
              className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                filter === 'tech'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700'
              }`}
            >
              기술
            </button>
          </div>

          <input
            type="text"
            placeholder="검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 dark:border-gray-600 dark:bg-slate-800 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        {/* 글 목록 */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-600 dark:bg-slate-800">
            <p className="text-gray-600 dark:text-gray-400">
              게시된 글이 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
