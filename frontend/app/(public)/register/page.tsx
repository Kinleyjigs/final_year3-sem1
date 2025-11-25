'use client';

import { useEffect } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const { signUp, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      signUp();
    }
  }, [loading, isAuthenticated, signUp]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to sign up...</p>
      </div>
    </div>
  );
}
