'use client';

import Link from 'next/link';
import { BlogPost } from '@/entities/blog/types';
import { Button } from '@/components/ui/button';
import { Eye, Calendar, Tag } from 'lucide-react';

interface PostCardProps {
  post: BlogPost;
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="group rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-blue-400 hover:shadow-lg dark:border-gray-700 dark:bg-slate-800">
      {post.coverImage && (
        <div className="mb-4 h-48 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-slate-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}

      <div className="mb-3 flex items-center gap-2">
        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
          {post.category === 'portfolio'
            ? '포트폴리오'
            : post.category === 'tech'
              ? '기술'
              : '기타'}
        </span>
        {!post.published && (
          <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            작성 중
          </span>
        )}
      </div>

      <h3 className="mb-2 line-clamp-2 text-xl font-bold text-gray-900 dark:text-white">
        {post.title}
      </h3>

      <p className="mb-4 line-clamp-3 text-gray-600 dark:text-gray-400">
        {post.excerpt}
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {post.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          >
            <Tag className="h-3 w-3" />
            {tag}
          </span>
        ))}
        {post.tags.length > 3 && (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            +{post.tags.length - 3}
          </span>
        )}
      </div>

      <div className="mb-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {formattedDate}
        </div>
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          {post.views}
        </div>
      </div>

      <Link href={`/blog/${post.id}`}>
        <Button className="w-full">읽기</Button>
      </Link>
    </div>
  );
}
