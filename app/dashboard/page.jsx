"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";
import useAuth from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import Hero from "@/components/Dashboard/Hero";
import About from "@/components/Dashboard/About";
import Experience from "@/components/Dashboard/Experience";
import Skills from "@/components/Dashboard/Skills";
// import Portfolio from "@/components/Dashboard/Portfolio";
import Footer from "@/components/Dashboard/Footer";

export default function DashboardPage() {
  const { user, isAuthorized, isLoading } = useAuth();
  const [profileLoading, setProfileLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const router = useRouter();

  // Section states
  const [heroFormData, setHeroFormData] = useState({
    title: "",
    position: "",
    description: "",
    image: "",
  });
  const [aboutFormData, setAboutFormData] = useState({ about: "" });
  const [experiences, setExperiences] = useState([]);
  const [skillsFormData, setSkillsFormData] = useState({
    skills: ["JavaScript", "Next.js", "Tailwind CSS", "React", "MongoDB", "Design"],
  });
  // const [portfolios, setPortfolios] = useState([]);
  const [footerFormData, setFooterFormData] = useState({
    title: "",
    description: "",
    email: "",
  });

  // Preview mode
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  // Fetch profile logic (optional, adjust as needed)
  useEffect(() => {
    if (isAuthorized) {
      fetchProfile();
    }
  }, [isAuthorized]);

  async function fetchProfile() {
    try {
      const response = await fetch("/api/profile");
      if (!response.ok) {
        setHasProfile(false);
        setProfileLoading(false);
        return;
      }
      const data = await response.json();
      if (data.hasProfile) {
        setHasProfile(true);
        // Optionally set form data from profile here
      } else {
        setHasProfile(false);
      }
    } catch {
      setHasProfile(false);
    } finally {
      setProfileLoading(false);
    }
  }

  useEffect(() => {
    if (!profileLoading && !hasProfile && isAuthorized) {
      router.push("/onboarding");
    }
  }, [hasProfile, profileLoading, isAuthorized, router]);

  if (isLoading || profileLoading) {
    return <LoadingSpinner />;
  }
  if (!isAuthorized || !hasProfile) {
    return null;
  }

  // Handlers for each section
  const handleHeroDataChange = (newData) => setHeroFormData(newData);
  const handleAboutDataChange = (newData) => setAboutFormData(newData);
  const handleExperienceUpdate = (updatedExperiences) => setExperiences(updatedExperiences);
  const handleSkillsUpdate = (updatedSkills) => setSkillsFormData(updatedSkills);
  // const handlePortfolioUpdate = (updatedPortfolios) => setPortfolios(updatedPortfolios);
  const handleFooterUpdate = (updatedFooter) => setFooterFormData(updatedFooter);
  const toggleMobilePreview = () => setIsMobilePreview((prev) => !prev);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[var(--lightGray)] overflow-auto lg:overflow-hidden overflow-x-hidden">
      <Sidebar />
      <div className="bg-white w-full flex flex-col lg:flex-row flex-wrap p-4 sm:px-6 py-8 border-l border-[#e7e5e4]">
        <div className="flex flex-col lg:flex-row gap-6 h-full w-full">
          {/* Left: Forms */}
          <div className="w-full lg:w-2/5 flex flex-col gap-4 shadow-none rounded-lg h-fit lg:h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto mb-10">
              <div className="grid gap-4 w-full">
                <Hero heroDataChange={handleHeroDataChange} />
                <About aboutDataChange={handleAboutDataChange} />
                <Experience onUpdate={handleExperienceUpdate} />
                <Skills skillsFormData={skillsFormData} setSkillsFormData={handleSkillsUpdate} />
                {/* <Portfolio portfolios={portfolios} onUpdate={handlePortfolioUpdate} /> */}
                <Footer footerDataChange={handleFooterUpdate} />
              </div>
            </div>
          </div>
          {/* Right: Preview */}
          <div className="w-full lg:w-3/5 flex flex-col gap-4 shadow-none rounded-lg h-fit lg:h-full overflow-hidden">
            <h3 className="font-semibold tracking-tight text-lg leading-5 mb-2">Preview</h3>
            <div className="flex gap-5">
              <button
                className={`focus:bg-gray-100 px-3 h-9 rounded-md ${isMobilePreview ? "bg-gray-200" : ""}`}
                onClick={toggleMobilePreview}
              >
                {/* Mobile icon */}
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="w-6 h-6">
                  <path
                    d="M4 2.5C4 2.22386 4.22386 2 4.5 2H10.5C10.7761 2 11 2.22386 11 2.5V12.5C11 12.7761 10.7761 13 10.5 13H4.5C4.22386 13 4 12.7761 4 12.5V2.5ZM4.5 1C3.67157 1 3 1.67157 3 2.5V12.5C3 13.3284 3.67157 14 4.5 14H10.5C11.3284 14 12 13.3284 12 12.5V2.5C12 1.67157 11.3284 1 10.5 1H4.5ZM6 11.65C5.8067 11.65 5.65 11.8067 5.65 12C5.65 12.1933 5.8067 12.35 6 12.35H9C9.1933 12.35 9.35 12.1933 9.35 12C9.35 11.8067 9.1933 11.65 9 11.65H6Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              <button
                className={`focus:bg-gray-100 px-3 h-9 rounded-md ${!isMobilePreview ? "bg-gray-200" : ""}`}
                onClick={toggleMobilePreview}
              >
                {/* Desktop icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
                  ></path>
                </svg>
              </button>
            </div>
            <div
              className={`${
                isMobilePreview ? "max-w-[390px] mx-auto" : "w-full"
              } bg-[#0d0d0d] text-white overflow-y-auto mt-2 p-6 shadow-lg border lg:pb-20 rounded-3xl pt-10 overflow-x-hidden transition-all flex-col sm:flex-row items-center gap-6 text-center`}
              style={{ transition: "max-width 0.3s ease-in-out" }}
            >
              {/* Hero Section */}
              <div
                className={`${
                  isMobilePreview
                    ? " flex-col items-center justify-center"
                    : "flex-row items-center"
                } flex flex-row gap-5 w-full sm:pb-12 sm:border-b sm:border-[#1e1e1e]`}
              >
                <Image
                  src={heroFormData.image || "/default-profile.png"}
                  alt="Hero"
                  width={150}
                  height={150}
                  className="border-2 border-[#1e1e1e] w-36 h-36 max-h-36 max-w-36 rounded-full object-cover object-center"
                />
                <div className={`${isMobilePreview ? "flex flex-col" : "items-start"} flex flex-col gap-2 w-full`}>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{heroFormData.title}</h1>
                  <p className="text-xl sm:text-xl font-semibold text-[#d5e4fd] leading-6 whitespace-pre-wrap break-words">{heroFormData.position}</p>
                  <p className="text-base text-gray-300 text-center sm:text-left leading-6 whitespace-pre-wrap">{heroFormData.description}</p>
                </div>
              </div>
              {/* About Section */}
              {aboutFormData.about && (
                <div className="flex flex-col gap-2 my-7 items-start border-b pb-7 border-[#1e1e1e]">
                  <h2 className="text-xl font-semibold">About me</h2>
                  <p className="text-lg text-left text-gray-300">{aboutFormData.about}</p>
                </div>
              )}
              {/* Experience Section */}
              {experiences && experiences.length > 0 && (
                <div className="flex flex-col gap-6 items-start justify-center mb-5 pb-14 sm:border-b sm:border-[#1e1e1e]">
                  <h2 className="text-xl font-semibold">Experience</h2>
                  <div className={`${isMobilePreview ? "flex-col items-center justify-center" : "grid-cols-2"} grid gap-x-7 gap-y-3 w-full`}>
                    {experiences.map((exp, index) => (
                      <div key={index} className="flex flex-row w-full gap-2 mt-5">
                        <div className="flex flex-row items-center gap-4 w-full">
                          <div className="w-15 h-10 min-w-10 rounded-full flex items-center justify-center">
                            <Image
                              src={exp.logo || "/default-logo.png"}
                              width={65}
                              height={65}
                              alt="logo"
                              className="w-[65px] h-[65px] min-w-10 rounded-full object-cover bg-[#f5f5f5] flex items-center justify-center border border-[#1e1e1e]"
                            />
                          </div>
                          <div className="flex flex-col">
                            <p className="text-base tracking-tight line-clamp-1 font-semibold text-start transition-all leading-normal">{exp.company}</p>
                            <p className="text-sm tracking-tight line-clamp-1 text-start transition-all text-muted-foreground leading-normal">{exp.period}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Skills Section */}
              {skillsFormData && skillsFormData.skills.length > 0 && (
                <div className="flex flex-col gap-6 my-8 items-start border-b pb-12 border-[#1e1e1e]">
                  <h2 className="text-xl font-semibold">Skills</h2>
                  <div className="flex flex-wrap gap-3">
                    {skillsFormData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="flex font-medium items-center justify-center bg-[#121212] border border-[#252525] px-8 h-10 min-w-[80px] rounded-full w-fit text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {/* Portfolio Section */}
              {/* {portfolios && portfolios.length > 0 && (
                <div className="flex flex-col gap-6 my-2 pb-14 sm:border-b sm:border-[#1e1e1e]">
                  <h2 className="text-2xl font-semibold text-left">Portfolio</h2>
                  <div className={`${isMobilePreview ? "grid-cols-1" : "grid-cols-2"} grid gap-x-2 gap-y-3 w-full`}>
                    {portfolios.map((port, index) => (
                      <div key={index} className="w-full gap-2">
                        <Link href={port.href} target="_blank">
                          <Image
                            src={port.image || "/default-portfolio.png"}
                            width={600}
                            height={230}
                            alt="portfolio"
                            className="w-full h-[230px] rounded-md border border-[#1e1e1e] object-cover"
                          />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}
              {/* Footer Section */}
              {footerFormData && (
                <div className="flex flex-col items-center justify-center gap-6 my-14 h-fit lg:max-h-[200px]">
                  <div className="flex flex-col items-center gap-4">
                    <h1 className="text-2xl font-bold text-center">{footerFormData.title}</h1>
                    <p className="text-lg text-center text-gray-300 sm:px-10">{footerFormData.description}</p>
                    {footerFormData.email && footerFormData.title && footerFormData.description && (
                      <Link href={`mailto:${footerFormData.email}`}>
                        <button className="bg-primary hover:bg-btn text-base mt-2 h-14 px-6 py-2 w-[190px] max-w-43 rounded-full font-semibold capitalize">
                          say Hello
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}