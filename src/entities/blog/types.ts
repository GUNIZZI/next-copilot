export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  category: 'portfolio' | 'tech' | 'other';
  tags: string[];
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  views: number;
}

export interface CreateBlogPostInput {
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  category: 'portfolio' | 'tech' | 'other';
  tags: string[];
  published: boolean;
}

export interface UpdateBlogPostInput extends Partial<CreateBlogPostInput> {
  id: string;
}
