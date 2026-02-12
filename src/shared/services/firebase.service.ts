import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BlogPost } from '@/entities/blog/types';
import bcrypt from 'bcryptjs';

// ============== 블로그 서비스 ==============

export const blogService = {
  // 모든 글 조회 (발행된 글만)
  async getAllPosts(): Promise<BlogPost[]> {
    try {
      const q = query(
        collection(db, 'posts'),
        where('published', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      })) as BlogPost[];
    } catch (error) {
      console.error('블로그 글 조회 실패:', error);
      return [];
    }
  },

  // 특정 글 조회
  async getPost(id: string): Promise<BlogPost | null> {
    try {
      const docRef = doc(db, 'posts', id);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return null;

      const data = snapshot.data();
      return {
        ...data,
        id: snapshot.id,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      } as BlogPost;
    } catch (error) {
      console.error('블로그 글 조회 실패:', error);
      return null;
    }
  },

  // 글 작성
  async createPost(post: Omit<BlogPost, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        ...post,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error('블로그 글 작성 실패:', error);
      throw error;
    }
  },

  // 글 수정
  async updatePost(id: string, data: Partial<BlogPost>): Promise<void> {
    try {
      const docRef = doc(db, 'posts', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('블로그 글 수정 실패:', error);
      throw error;
    }
  },

  // 글 삭제
  async deletePost(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'posts', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('블로그 글 삭제 실패:', error);
      throw error;
    }
  },

  // 조회수 증가
  async incrementViews(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'posts', id);
      const snapshot = await getDoc(docRef);
      const currentViews = snapshot.data()?.views || 0;
      await updateDoc(docRef, {
        views: currentViews + 1,
      });
    } catch (error) {
      console.error('조회수 증가 실패:', error);
    }
  },
};

// ============== 회원 서비스 ==============

interface User {
  id: string;
  email: string;
  name: string;
  password?: string; // Firestore에 저장되지 않음 (해시된 비밀번호만 저장)
  passwordHash: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export const userService = {
  // 이메일로 회원 찾기
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;

      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      } as User;
    } catch (error) {
      console.error('이메일로 회원 조회 실패:', error);
      return null;
    }
  },

  // 비밀번호 검증
  verifyPassword(password: string, passwordHash: string): boolean {
    try {
      return bcrypt.compareSync(password, passwordHash);
    } catch (error) {
      console.error('비밀번호 검증 실패:', error);
      return false;
    }
  },

  // 모든 회원 조회
  async getAllUsers(): Promise<User[]> {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      })) as User[];
    } catch (error) {
      console.error('회원 조회 실패:', error);
      return [];
    }
  },

  // 특정 회원 조회
  async getUser(id: string): Promise<User | null> {
    try {
      const docRef = doc(db, 'users', id);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return null;

      const data = snapshot.data();
      return {
        ...data,
        id: snapshot.id,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      } as User;
    } catch (error) {
      console.error('회원 조회 실패:', error);
      return null;
    }
  },

  // 회원 생성
  async createUser(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'passwordHash'> & {
      password: string;
    }
  ): Promise<string> {
    try {
      const passwordHash = bcrypt.hashSync(user.password, 10);
      const docRef = await addDoc(collection(db, 'users'), {
        email: user.email,
        name: user.name,
        role: user.role,
        passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error('회원 생성 실패:', error);
      throw error;
    }
  },

  // 회원 정보 수정
  async updateUser(id: string, data: Partial<User>): Promise<void> {
    try {
      const docRef = doc(db, 'users', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('회원 정보 수정 실패:', error);
      throw error;
    }
  },

  // 회원 삭제
  async deleteUser(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'users', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('회원 삭제 실패:', error);
      throw error;
    }
  },
};

// ============== 대시보드 통계 서비스 ==============

interface DashboardStats {
  id: string;
  totalUsers: number;
  totalPosts: number;
  totalViews: number;
  updatedAt: Date;
}

export const dashboardService = {
  // 통계 조회
  async getStats(): Promise<DashboardStats | null> {
    try {
      const docRef = doc(db, 'stats', 'dashboard');
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return null;

      const data = snapshot.data();
      return {
        ...data,
        id: snapshot.id,
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      } as DashboardStats;
    } catch (error) {
      console.error('통계 조회 실패:', error);
      return null;
    }
  },

  // 통계 업데이트
  async updateStats(data: Partial<DashboardStats>): Promise<void> {
    try {
      const docRef = doc(db, 'stats', 'dashboard');
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('통계 업데이트 실패:', error);
    }
  },
};
