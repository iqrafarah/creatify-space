'use client';

import { useState } from "react";
import CopyButton from "@/components/CopyButton";
import PublishButton from "@/components/PublishButton";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";

export default function Sidebar() {
  const [isPublished, setIsPublished] = useState(false);
  const { user, handleLogout } = useAuth();
  const username = user?.username;
  const email = user?.email;

  const handlePublishToggle = (newPublishState) => {
    setIsPublished(newPublishState);
  };    

  return (
    <div className="flex flex-col justify-between h-fit sm:h-screen lg:w-1/4 p-4 mx-2">
      <div className="h-full border-b-[0.5px] mb-5">
        <h1 className="font-semibold text-2xl">Dashboard</h1>
        <p className="text-muted text-base mb-3">
          Everything relevant to your Creatify
        </p>

        {username && <CopyButton textToCopy={`Creatify.space/${username}`} />}

        <div className="w-full flex flex-col gap-2 mt-10">
          <Link href="/dashboard">
            <button className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 w-full justify-start hover:bg-white focus:bg-white focus:shadow-sm focus:border focus:border-input">
              Design
            </button>
          </Link>
          <button
            className="disabled focus:disabled inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-55 h-9 px-4 py-2 w-full justify-start hover:bg-white"
            disabled
          >
            Themes
          </button>
          <button
            className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-55 h-9 px-4 py-2 w-full justify-start hover:bg-white"
            disabled
          >
            Analytics
          </button>
          <Link href="/settings">
            <button className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 w-full justify-start hover:bg-white focus:bg-white focus:shadow-sm focus:border focus:border-input">
              Settings
            </button>
          </Link>
        </div>
      </div>
      <div className="h-fit sm:h-1/3">
        <PublishButton
          username={username}
          email={email}
          initialPublishState={isPublished}
          onPublishToggle={handlePublishToggle}
        />
        
        <button
          onClick={handleLogout}
          className="mt-4 inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 w-full justify-start hover:bg-red-50 text-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}