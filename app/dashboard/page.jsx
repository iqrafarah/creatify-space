"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import useAuth from "@/hooks/useAuth";
import useDashboardState from "@/hooks/useDashboardState";
import Sidebar from "@/components/Sidebar";
import { FormsSection } from "@/components/Dashboard/FormsSection";
import { PreviewSection } from "@/components/Preview/PreviewSection";
import {fetchProfile } from "@/lib/profileService"

// Manages profile fetching and validation
const useProfileManagement = (isAuthorized) => {
  const [profileLoading, setProfileLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const router = useRouter();

  // Fetch profile data when authorized
  useEffect(() => {
    if (!isAuthorized) return;

    const fetchProfileData = async () => {
      try {
        const data = await fetchProfile();
        setHasProfile(data.hasProfile);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setHasProfile(false);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfileData();
  }, [isAuthorized]);

  // Redirect to onboarding if no profile exists
  useEffect(() => {
    if (!profileLoading && !hasProfile && isAuthorized) {
      router.push("/onboarding");
    }
  }, [hasProfile, profileLoading, isAuthorized, router]);

  return { profileLoading, hasProfile };
};

// Main Dashboard Component
export default function DashboardPage() {
  const { isAuthorized, isLoading: authLoading } = useAuth();
  const { profileLoading, hasProfile } = useProfileManagement(isAuthorized);
  const { 
    formData, 
    isMobilePreview, 
    setIsMobilePreview, 
    updateSection 
  } = useDashboardState();

  // Handle theme color changes
  const handleColorChange = (updatedColors) => {
    setBackgroundColor(updatedColors.background);
    setHeadingsColor(updatedColors.headings);
    setPositionColor(updatedColors.position);
    setTextColor(updatedColors.text);
    setBorderColor(updatedColors.border);
    setButtonsColor(updatedColors.buttons);
  };

  // Loading and authorization checks
  const isLoading = authLoading || profileLoading;
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthorized || !hasProfile) return null;

  return (
    <DashboardLayout>
      <FormsSection 
        formData={formData} 
        updateSection={updateSection} 
      />
      <PreviewSection 
        formData={formData} 
        handleColorChange={handleColorChange}
        isMobilePreview={isMobilePreview}
        setIsMobilePreview={setIsMobilePreview}
      />
    </DashboardLayout>
  );
}

// Layout wrapper for dashboard structure
const DashboardLayout = ({ children }) => (
  <div className="flex flex-col lg:flex-row h-screen bg-[var(--lightGray)] overflow-auto lg:overflow-hidden overflow-x-hidden">
    <Sidebar />
    <div className="bg-white w-full flex flex-col lg:flex-row flex-wrap p-4 sm:px-6 py-8 border-l border-[#e7e5e4] overflow-scroll">
      <div className="flex flex-col lg:flex-row gap-6 h-full w-full">
        {children}
      </div>
    </div>
  </div>
);