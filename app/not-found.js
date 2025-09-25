"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const pathname = usePathname();
  
  // Extract potential username from pathname
  const getUsername = () => {
    const segments = pathname.split('/').filter(segment => segment.length > 0);
    return segments.length === 1 ? segments[0] : null;
  };

  const username = getUsername();

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto w-full"> 
        {username ? (
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-medium text-white tracking-tight">
                404
              </h1>
              <div className="space-y-2">
                <p className="text-xl text-[#d1d5db]">
                  <span className="text-[#6b7280]">/{username}</span> doesn't exist yet
                </p>
                <p className="text-[#9ca3af] text-sm">
                  But it could be yours
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href="/signup" className="flex-1">
                <button className="w-full bg-white text-black font-medium px-6 py-3 rounded-lg hover:bg-[#f5f5f5] transition-colors duration-200">
                  Claim username
                </button>
              </Link>
              
              <Link href="/" className="flex-1">
                <button className="w-full bg-transparent text-[#d1d5db] font-medium px-6 py-3 rounded-lg border border-[#374151] hover:border-[#4b5563] transition-colors duration-200">
                  Go home
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-medium text-white tracking-tight">
                404
              </h1>
              <p className="text-xl text-[#d1d5db]">
                Page not found
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/">
                <button className="w-full bg-white text-black font-medium px-6 py-3 rounded-lg hover:bg-[#f5f5f5] transition-colors duration-200">
                  Go home
                </button>
              </Link>
              
              <Link href="/signup">
                <button className="w-full bg-transparent text-[#d1d5db] font-medium px-6 py-3 rounded-lg border border-[#374151] hover:border-[#4b5563] transition-colors duration-200">
                  Create portfolio
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}