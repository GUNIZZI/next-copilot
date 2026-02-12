import { db } from '@/lib/firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

/**
 * Firestore 초기 데이터 설정 스크립트
 * 사용법: 개발 서버 실행 후 브라우저 콘솔에서 임포트하거나,
 * 이 함수를 실행하는 페이지/API를 통해 호출
 */

export async function initializeFirebaseData() {
  try {
    console.log('🚀 Firestore 초기 데이터 설정 시작...');

    // 1. posts 컬렉션 초기 데이터
    console.log('📝 블로그 데이터 추가 중...');
    const postsRef = collection(db, 'posts');

    const mockPosts = [
      {
        title: 'Next.js 16 업그레이드 가이드',
        content:
          '<p>Next.js 16으로 업그레이드하면서 새로운 기능들을 알아봅시다.</p><h2>주요 변경사항</h2><ul><li>App Router 개선</li><li>성능 최적화</li><li>Turbopack 지원</li></ul>',
        excerpt:
          'Next.js 16으로 업그레이드하면서 겪었던 경험과 팁을 공유합니다.',
        coverImage:
          'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=600&h=300&fit=crop',
        category: 'tech',
        tags: ['Next.js', 'React', 'TypeScript'],
        authorId: 'sample-user-1',
        published: true,
        views: 245,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
      },
      {
        title: '포트폴리오 프로젝트 - Admin Dashboard',
        content:
          '<p>NextAuth.js를 사용한 안전한 인증 시스템을 구축했습니다.</p><h2>기술 스택</h2><ul><li>Next.js 16</li><li>TypeScript</li><li>Tailwind CSS</li><li>NextAuth.js</li><li>Firestore</li></ul>',
        excerpt:
          'Next.js와 NextAuth.js를 사용하여 만든 Admin Dashboard 프로젝트입니다.',
        coverImage:
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=300&fit=crop',
        category: 'portfolio',
        tags: ['Next.js', 'TypeScript', 'TailwindCSS', 'Firestore'],
        authorId: 'sample-user-2',
        published: true,
        views: 432,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
    ];

    for (const post of mockPosts) {
      const postDocRef = doc(postsRef);
      await setDoc(postDocRef, post);
      console.log(`✅ 글 추가됨: ${post.title}`);
    }

    // 2. users 컬렉션 초기 데이터
    console.log('👥 회원 데이터 추가 중...');
    const usersRef = collection(db, 'users');

    const mockUsers = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: bcrypt.hashSync('password123', 10),
        role: 'user',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        passwordHash: bcrypt.hashSync('password123', 10),
        role: 'user',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
      },
      {
        name: 'Bob Wilson',
        email: 'bob@example.com',
        passwordHash: bcrypt.hashSync('password123', 10),
        role: 'user',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
      },
    ];

    for (const user of mockUsers) {
      const userDocRef = doc(usersRef);
      await setDoc(userDocRef, user);
      console.log(`✅ 회원 추가됨: ${user.name}`);
    }

    // 3. stats 컬렉션
    console.log('📊 대시보드 통계 데이터 추가 중...');
    const statsRef = collection(db, 'stats');
    const statsDocRef = doc(statsRef, 'dashboard');

    await setDoc(statsDocRef, {
      totalUsers: mockUsers.length,
      totalPosts: mockPosts.length,
      totalViews: mockPosts.reduce((sum, post) => sum + post.views, 0),
      updatedAt: new Date(),
    });

    console.log('✅ 대시보드 통계 추가됨');

    console.log('🎉 Firestore 초기화 완료!');
    return true;
  } catch (error) {
    console.error('❌ Firestore 초기화 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 기존 데이터 확인 함수
 */
export async function checkExistingData() {
  try {
    const postsSnapshot = await getDocs(collection(db, 'posts'));
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const statsSnapshot = await getDocs(collection(db, 'stats'));

    console.log(`📊 현재 데이터 상태:`);
    console.log(`   - Posts: ${postsSnapshot.docs.length}개`);
    console.log(`   - Users: ${usersSnapshot.docs.length}개`);
    console.log(`   - Stats: ${statsSnapshot.docs.length}개`);

    return {
      hasData:
        postsSnapshot.docs.length > 0 ||
        usersSnapshot.docs.length > 0 ||
        statsSnapshot.docs.length > 0,
      posts: postsSnapshot.docs.length,
      users: usersSnapshot.docs.length,
      stats: statsSnapshot.docs.length,
    };
  } catch (error) {
    console.error('데이터 확인 중 오류:', error);
    return null;
  }
}
