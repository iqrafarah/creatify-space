'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          if (isMounted) {
            setIsLoading(false);
            setTimeout(() => router.push('/login'), 100);
          }
          return;
        }
        
        const userData = await response.json();
        
        if (isMounted) {
          setUser(userData);
          setIsAuthorized(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (isMounted) {
          setIsLoading(false);
          setTimeout(() => router.push('/login'), 100);
        }
      }
    }
    
    checkAuth();
    
    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { user, isAuthorized, isLoading, handleLogout };
}