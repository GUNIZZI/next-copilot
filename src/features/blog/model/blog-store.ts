import { create } from 'zustand';
import { BlogPost } from '@/entities/blog/types';

interface BlogState {
  posts: BlogPost[];
  currentPost: BlogPost | null;
  isLoading: boolean;
  error: string | null;

  // 액션
  setPosts: (posts: BlogPost[]) => void;
  setCurrentPost: (post: BlogPost | null) => void;
  addPost: (post: BlogPost) => void;
  updatePost: (id: string, post: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBlogStore = create<BlogState>((set) => ({
  posts: [],
  currentPost: null,
  isLoading: false,
  error: null,

  setPosts: (posts) => set({ posts }),
  setCurrentPost: (post) => set({ currentPost: post }),

  addPost: (post) =>
    set((state) => ({
      posts: [post, ...state.posts],
    })),

  updatePost: (id, updates) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === id ? { ...post, ...updates } : post
      ),
      currentPost:
        state.currentPost?.id === id
          ? { ...state.currentPost, ...updates }
          : state.currentPost,
    })),

  deletePost: (id) =>
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== id),
      currentPost: state.currentPost?.id === id ? null : state.currentPost,
    })),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
