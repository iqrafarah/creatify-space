'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/session', {
          // Include credentials for cookie-based auth
          credentials: 'include',
          // Prevent caching to ensure fresh auth state
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          if (isMounted) {
            setIsLoading(false);
            // Small delay before redirect to avoid flash
            setTimeout(() => router.replace('/login'), 100);
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
          setTimeout(() => router.replace('/login'), 100);
        }
      }
    }
    
    checkAuth();
    
    // Cleanup to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleLogout() {
    try {
      setIsLoading(true);
      await fetch('/api/auth/logout', { credentials: 'include' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Creatify Space</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-right">
              <p className="text-gray-900 font-medium">{user?.username || 'User'}</p>
              <p className="text-gray-500">{user?.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Welcome to your dashboard</h2>
              <p className="mt-1 text-sm text-gray-500">
                Your account was created on {new Date(user?.createdAt).toLocaleDateString()}.
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">What's next?</h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h4 className="text-base font-medium text-gray-900">Complete your profile</h4>
                    <p className="mt-1 text-sm text-gray-500">Add more details to personalize your experience.</p>
                  </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h4 className="text-base font-medium text-gray-900">Explore templates</h4>
                    <p className="mt-1 text-sm text-gray-500">Browse our collection of portfolio templates.</p>
                  </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h4 className="text-base font-medium text-gray-900">Upload your resume</h4>
                    <p className="mt-1 text-sm text-gray-500">Import your skills and experience from a PDF.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}