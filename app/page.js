// import AuthForm from '@/components/AuthForm';

// export default function Home({ searchParams }) {
//   const formMode = searchParams.mode || 'login';
//   return <AuthForm mode={formMode} />;
// }

'use client';

import { useSearchParams } from 'next/navigation';
import AuthForm from '@/components/AuthForm';

export default function Home() {
  const searchParams = useSearchParams();
  const formMode = searchParams.get('mode') || 'login';

  return <AuthForm mode={formMode} />;
}
