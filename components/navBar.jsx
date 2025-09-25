"use client";

import React, { useState, useEffect, useMemo } from "react";
import ProfileMenu from "./ProfileMenu";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import CopyButton from "@/components/CopyButton";
import PublishButton from "@/components/PublishButton";
import { fetchProfile } from "@/lib/profileService";

const NAV_HEIGHT = 64; // keep navbar height stable to prevent layout shift

export default function NavBar({ hideContainer }) {
  const { isAuthorized, isLoading: authLoading } = useAuth();
  const [openProfile, setOpenProfile] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  const pathname = usePathname();

  useEffect(() => setHydrated(true), []);

  const isUserProfilePage = (pathname) => {
    const pathSegments = pathname.split("/").filter((segment) => segment.length > 0);

    if (pathSegments.length === 1) {
      const segment = pathSegments[0];
      const knownRoutes = [
        "login",
        "signup",
        "onboarding",
        "theme",
        "dashboard",
        "profile",
        "settings",
        "about",
        "contact",
        "work",
        "blog",
        "api",
        "404",
        "500",
        "auth",
      ];
      return !knownRoutes.includes(segment.toLowerCase());
    }
    return false;
  };

  const hiddenPaths = ["/login", "/signup", "/onboarding", "/theme"];
  const shouldHide = hiddenPaths.includes(pathname) || isUserProfilePage(pathname);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      if (!isAuthorized || authLoading) {
        setProfile(null);
        setIsPublished(false);
        setProfileLoading(false);
        return;
      }

      try {
        setProfileLoading(true);
        const data = await fetchProfile();
        if (!mounted) return;

        if (data?.hasProfile) {
          setProfile(data.profile);
          setIsPublished(Boolean(data.profile?.isPublished));
        } else {
          setProfile(null);
          setIsPublished(false);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        if (mounted) {
          setProfile(null);
          setIsPublished(false);
        }
      } finally {
        if (mounted) setProfileLoading(false);
      }
    };

    loadProfile();
    return () => {
      mounted = false;
    };
  }, [isAuthorized, authLoading]);

  const handlePublishToggle = (newPublishState) => setIsPublished(newPublishState);
  const handleProfileToggle = () => setOpenProfile((prev) => !prev);

  // Only reveal controls after hydration + auth (+ profile if authorized) are ready
  const readyToShowControls = useMemo(
    () => hydrated && !authLoading && (!isAuthorized || (isAuthorized && !profileLoading)),
    [hydrated, authLoading, isAuthorized, profileLoading]
  );

  if (shouldHide) return null;

  return (
    <div
      className={`${hideContainer ? "w-full" : "border-b border-[#e7e5e4] bg-[var(--lightGray)]"} relative`}
      style={{ minHeight: NAV_HEIGHT }}
    >
      <div className="flex flex-row items-center justify-between" style={{ height: NAV_HEIGHT }}>
        <div className="w-1/4 mx-2 pl-4 flex items-center">
          <Link href="/" aria-label="Home">
            <Image
              src="/logo.svg"
              priority
              alt="logo"
              width={35}
              height={35}
              className="object-cover rounded-lg"
            />
          </Link>
        </div>

        {!readyToShowControls ? (
          // Skeleton keeps height & prevents flashes
          <div className="pr-4">
            <div className="h-10 w-32 animate-pulse bg-gray-200 rounded" />
          </div>
        ) : !isAuthorized ? (
          <div className="pr-4">
            <Link href="/auth">
              <button className="bg-inherit px-4 py-2 rounded-md border-2 border-[#e7e7e7] hover:bg-[#f5f5f5] text-sm">
                Sign in / sign up
              </button>
            </Link>
          </div>
        ) : !profile ? (
          <div className="pr-4">
            <div className="h-10 w-32 bg-gray-100 border border-[#e7e7e7] rounded flex items-center justify-center text-xs text-gray-500">
              No profile
            </div>
          </div>
        ) : (
          <div className="border-l border-[#e7e5e4] w-full flex justify-between items-center pr-4">
            <div className="relative flex items-center gap-4 p-4">
              <div className="flex items-center gap-2">
                <PublishButton
                  username={profile.user.username}
                  email={profile.user.email}
                  initialPublishState={isPublished}
                  onPublishToggle={handlePublishToggle}
                />
                <CopyButton textToCopy={`Creatify.space/${profile.user.username}`} />
              </div>
            </div>

            <button
              onClick={handleProfileToggle}
              aria-label="Open profile menu"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary cursor-pointer mr-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-user h-4 w-4"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
          </div>
        )}
      </div>

      {profile && openProfile && <ProfileMenu />}
    </div>
  );
}
