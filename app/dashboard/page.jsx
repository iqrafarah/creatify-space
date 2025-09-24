// pages/dashboard.jsx or components/Dashboard/DashboardPage.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import useAuth from "@/hooks/useAuth";
import useDashboardState from "@/hooks/useDashboardState";
import Sidebar from "@/components/Sidebar";
import { FormsSection } from "@/components/Dashboard/FormsSection";
import { PreviewSection } from "@/components/Preview/PreviewSection";

// Custom hook for profile management
const useProfileManagement = (isAuthorized) => {
  const [profileLoading, setProfileLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthorized) return;

    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) {
          setHasProfile(false);
          return;
        }
        
        const data = await response.json();
        setHasProfile(data.hasProfile);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setHasProfile(false);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthorized]);

  useEffect(() => {
    if (!profileLoading && !hasProfile && isAuthorized) {
      router.push("/onboarding");
    }
  }, [hasProfile, profileLoading, isAuthorized, router]);

  return { profileLoading, hasProfile };
};

export default function DashboardPage() {
  const { isAuthorized, isLoading: authLoading } = useAuth();
  const { profileLoading, hasProfile } = useProfileManagement(isAuthorized);
  const { 
    formData, 
    isMobilePreview, 
    setIsMobilePreview, 
    updateSection 
  } = useDashboardState();

  const isLoading = authLoading || profileLoading;

  console.log("Form Data:", formData);
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthorized || !hasProfile) {
    return null;
  }

    const handleColorChange = (updatedColors) => {
    setBackgroundColor(updatedColors.background);
    setHeadingsColor(updatedColors.headings);
    setPositionColor(updatedColors.position);
    setTextColor(updatedColors.text);
    setBorderColor(updatedColors.border);
    setButtonsColor(updatedColors.buttons);
  };

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

// Layout component for better organization
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