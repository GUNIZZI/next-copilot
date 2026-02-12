import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/shared/services/firebase.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // 유효성 검사
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: '필수 항목을 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: '비밀번호는 6자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // 이메일 중복 확인
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: '이미 가입된 이메일입니다.' },
        { status: 400 }
      );
    }

    // 새 사용자 생성
    const userId = await userService.createUser({
      name,
      email,
      password,
      role: 'user', // 회원가입한 사용자는 일반 유저
    });

    return NextResponse.json(
      {
        message: '회원가입에 성공했습니다.',
        userId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('회원가입 API 오류:', error);
    return NextResponse.json(
      { message: '회원가입 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
