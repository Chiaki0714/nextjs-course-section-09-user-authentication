'use client';

import Link from 'next/link';
import { useActionState } from 'react';

import { auth } from '@/actions/auth-actions';
import FormError from './FormError';

export default function AuthForm({ mode }) {
  const [formState, formAction] = useActionState(auth.bind(null, mode), {
    errors: {},
  });

  return (
    <form id='auth-form' action={formAction}>
      <div>
        <img src='/images/auth-icon.jpg' alt='A lock icon' />
      </div>
      <p>
        <label htmlFor='email'>Email</label>
        <input type='email' name='email' id='email' />
        <FormError error={formState.errors?.email} />
      </p>
      <p>
        <label htmlFor='password'>Password</label>
        <input type='password' name='password' id='password' />
        <FormError error={formState.errors?.password} />
      </p>
      <p>
        <button type='submit'>
          {mode === 'login' ? 'Login' : 'Create Account'}
        </button>
      </p>
      <p>
        {mode === 'login' && (
          <Link href='/?mode=signup'>Create an account.</Link>
        )}
        {mode === 'signup' && (
          <Link href='/?mode=login'>Login with existing account.</Link>
        )}
      </p>
    </form>
  );
}
