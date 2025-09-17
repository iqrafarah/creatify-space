"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import LoadingSpinner from "@/components/LoadingSpinner";
import useAuth from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user, isAuthorized, isLoading, handleLogout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("about");
  const router = useRouter();

  // First useEffect - fetch profile when authorized
  useEffect(() => {
    if (isAuthorized) {
      fetchProfile();
    }
  }, [isAuthorized]);

  // Second useEffect - redirect when no profile
  useEffect(() => {
    if (!profileLoading && !hasProfile && isAuthorized) {
      router.push("/onboarding");
    }
  }, [hasProfile, profileLoading, isAuthorized, router]);

  async function fetchProfile() {
    try {
      const response = await fetch("/api/profile");

      // If response is not OK, throw an error
      if (!response.ok) {
        console.error(
          `Profile API returned ${response.status}: ${response.statusText}`
        );
        setHasProfile(false);
        setProfileLoading(false);
        return;
      }

      // Try to parse the JSON
      const data = await response.json();

      if (data.hasProfile) {
        setProfile(data.profile);
        setHasProfile(true);
      } else {
        setHasProfile(false);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setHasProfile(false);
    } finally {
      setProfileLoading(false);
    }
  }

  if (isLoading || profileLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthorized) {
    return null;
  }

  if (!hasProfile) {
    return null;
  }

  // Portfolio sections based on your design
  const sections = [
    { id: "about", label: "About" },
    { id: "experiences", label: "Experiences" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Rest of your component remains the same */}
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        {/* Your existing code */}
        {/* ... */}
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {/* Your existing sections */}
        {/* ... */}
      </main>
    </div>
  );
}