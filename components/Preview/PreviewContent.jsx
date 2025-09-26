import React from 'react';
import { useState } from 'react';
import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { SkillsSection } from './sections/SkillsSection';
import { FooterSection } from './sections/FooterSection';
import LoadingForm from '@/components/Forms/LoadingForm';
import ColorPalette from '@/components/Dashboard/Colors';

export const PreviewContent = ({ 
  formData, 
  isMobilePreview = false,
  handleColorChange,
  className = ""
}) => {

  const containerClass = isMobilePreview ? "max-w-[390px] mx-auto" : "w-full";
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); 
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingForm />;
  }
  

  return (
    <div
      className={`${containerClass} bg-[#0d0d0d] text-white overflow-y-auto mt-2 p-6 shadow-lg border lg:pb-20 rounded-3xl pt-10 overflow-x-hidden transition-all flex-col items-center gap-6 ${className}`}
      style={{ transition: "max-width 0.3s ease-in-out" }}
    >
      <HeroSection 
        data={formData.hero} 
        hireMe={formData.footer.contactUrl}
        isMobilePreview={isMobilePreview}
      />
      
      <AboutSection 
        data={formData.about} 
        heroImage={formData.hero.image}
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
        heroImage={formData.hero.image}
      />
      
      {/* <ColorPalette onColorChange={handleColorChange} /> */}
    </div>
  );
};