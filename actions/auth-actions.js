'use server';

import { hashUserPassword, verifyPassword } from '@/lib/hash';
import { createUser, getUserByEmail } from '@/lib/user';
import { redirect } from 'next/navigation';
import { createAuthSession, destroySession } from '@/lib/auth';

// signupデータ検証用関数
function validateSignup({ email, password }) {
  const errors = {};

  if (!email || !email.includes('@')) {
    errors.email = 'Invalid email address';
  }

  if (!password || password.length < 8) {
    errors.password = 'Password too short';
  }

  return errors;
}

export async function signup(prevState, formData) {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  // 入力データ検証
  const errors = validateSignup(data);
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // passをハッシュしてDB保存 & セッション開始
  const hashedPassword = hashUserPassword(data.password);
  try {
    const id = createUser({
      email: data.email,
      password: hashedPassword,
    });
    await createAuthSession(id);
    redirect('/training');
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return {
        errors: {
          email:
            'It seems like an account for the chosen email already exists.',
        },
      };
    }
    throw error;
  }

  redirect('/training');
}

export async function login(prevState, formData) {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  // 既存ユーザー確認
  const existingUser = getUserByEmail(data.email);
  if (!existingUser) {
    return {
      errors: {
        email: 'Could not authenticate user, please check your credentials.',
      },
    };
  }

  // パスワード確認
  const isValidPassword = verifyPassword(existingUser.password, data.password);
  if (!isValidPassword) {
    return {
      errors: {
        password: 'Could not authenticate user, please check your credentials.',
      },
    };
  }

  await createAuthSession(existingUser.id);
  redirect('/training');
}

export async function auth(mode, prevState, formData) {
  if (mode === 'login') {
    return login(prevState, formData);
  }
  return signup(prevState, formData);
}

export async function logout() {
  await destroySession();
  redirect('/');
}
