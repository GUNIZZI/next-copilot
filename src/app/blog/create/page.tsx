'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useBlogStore } from '@/features/blog/model/blog-store';
import { RichEditor } from '@/features/blog/ui/rich-editor';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { blogService } from '@/shared/services/firebase.service';

export default function CreateBlogPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { addPost } = useBlogStore();

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: 'tech' as 'portfolio' | 'tech' | 'other',
    tags: '',
    published: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  // 인증된 사용자만 접근 가능
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        로딩 중...
      </div>
    );
  }

  if (!session) {
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
            <p className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              로그인이 필요합니다
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              블로그 글 작성은 로그인한 사용자만 가능합니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용은 필수입니다.');
      return;
    }

    setIsLoading(true);

    try {
      // 새 글 데이터
      const newPost = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || formData.content.substring(0, 100),
        coverImage: formData.coverImage,
        category: formData.category,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        authorId: session.user?.id || 'unknown',
        createdAt: new Date(),
        updatedAt: new Date(),
        published: formData.published,
        views: 0,
      };

      // Firebase에 저장
      const postId = await blogService.createPost(newPost);

      // 로컬 상태에도 추가
      addPost({
        ...newPost,
        id: postId,
      });

      alert('글이 저장되었습니다!');
      router.push('/blog');
    } catch (error) {
      console.error('글 저장 중 오류:', error);
      alert('글 저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-4xl">
        {/* 헤더 */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/blog">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            새 글 작성
          </h1>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 제목 */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              제목 *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="글의 제목을 입력하세요"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 dark:border-gray-600 dark:bg-slate-800 dark:text-white dark:placeholder-gray-400"
              required
            />
          </div>

          {/* 요약 */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              요약
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              placeholder="글의 요약을 입력하세요"
              rows={2}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 dark:border-gray-600 dark:bg-slate-800 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          {/* 커버 이미지 */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              커버 이미지 URL
            </label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 dark:border-gray-600 dark:bg-slate-800 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          {/* 카테고리 & 태그 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                카테고리
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-gray-600 dark:bg-slate-800 dark:text-white"
              >
                <option value="tech">기술</option>
                <option value="portfolio">포트폴리오</option>
                <option value="other">기타</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                태그 (쉼표로 구분)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="React, TypeScript, Next.js"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 dark:border-gray-600 dark:bg-slate-800 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* 내용 에디터 */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              내용 *
            </label>
            <RichEditor
              value={formData.content}
              onChange={handleEditorChange}
            />
          </div>

          {/* 발행 여부 */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              name="published"
              checked={formData.published}
              onChange={handleInputChange}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label
              htmlFor="published"
              className="text-gray-700 dark:text-gray-300"
            >
              지금 발행하기
            </label>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? '저장 중...' : '발행하기'}
            </Button>
            <Link href="/blog" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                취소
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
