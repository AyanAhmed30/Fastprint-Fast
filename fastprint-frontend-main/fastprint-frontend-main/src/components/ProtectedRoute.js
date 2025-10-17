'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

// ProtectedRoute: client-side guard that checks authentication and optional role
export default function ProtectedRoute({ children, allowedRoles = ['user', 'admin'] }) {
  const { user } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Wait a tick for auth context to hydrate
    const t = setTimeout(() => setChecking(false), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!checking) {
      // If no user, redirect to login
      if (!user) {
        router.replace('/login');
        return;
      }

      // Check role: assume user.account_type or user.is_admin
      const role = user?.account_type || (user?.is_admin ? 'admin' : 'user');
      if (!allowedRoles.includes(role)) {
        // unauthorized: send to home or login
        router.replace('/');
      }
    }
  }, [checking, user, allowedRoles, router]);

  if (checking) return null;
  if (!user) return null; // navigation will happen in effect
  return children;
}
