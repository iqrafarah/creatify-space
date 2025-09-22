// components/Preview/PreviewContent.jsx
import React from 'react';
import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { SkillsSection } from './sections/SkillsSection';
import { FooterSection } from './sections/FooterSection';

export const PreviewContent = ({ 
  formData, 
  isMobilePreview = false,
  className = ""
}) => {

  const containerClass = isMobilePreview ? "max-w-[390px] mx-auto" : "w-full";

  return (
    <div
      className={`${containerClass} bg-[#0d0d0d] text-white overflow-y-auto mt-2 p-6 shadow-lg border lg:pb-20 rounded-3xl pt-10 overflow-x-hidden transition-all flex-col items-center gap-6 ${className}`}
      style={{ transition: "max-width 0.3s ease-in-out" }}
    >
      <HeroSection 
        data={formData.hero} 
        isMobilePreview={isMobilePreview}
      />
      
      <AboutSection 
        data={formData.about} 
      />
      
      <ExperienceSection 
        data={formData.experiences} 
        isMobilePreview={isMobilePreview}
      />
      
      <SkillsSection 
        data={formData.skills} 
      />
      
      <FooterSection 
        data={formData.footer} 
      />
    </div>
  );
};