import React from 'react';
import Hero from "@/components/Dashboard/Hero";
import About from "@/components/Dashboard/About";
import Experience from "@/components/Dashboard/Experience";
import Skills from "@/components/Dashboard/Skills";
import Footer from "@/components/Dashboard/Footer";

export const FormsSection = ({ 
  formData, 
  updateSection,
  className = "w-full lg:w-2/5 flex flex-col gap-4 shadow-none rounded-lg h-fit lg:h-full overflow-hidden"
}) => {
  return (
    <div className={className}>
      <div className="flex-1 overflow-y-auto mb-10">
        <div className="grid gap-4 w-full">
          <Hero 
            heroDataChange={(data) => updateSection('hero', data)} 
          />
          
          <About 
            aboutDataChange={(data) => updateSection('about', data)} 
          />
          
          <Experience 
            onUpdate={(data) => updateSection('experiences', data)} 
          />
          
          <Skills 
            skillsDataChange={(data) => {
              console.log("Skills data being sent to dashboard state:", data);
              // Wrap skill names in the expected format
              updateSection('skills', { skills: data });
            }} 
            skills={formData.skills?.skills || formData.skills || []}
          />
          
          <Footer 
            footerDataChange={(data) => updateSection('footer', data)} 
          />
        </div>
      </div>
    </div>
  );
};