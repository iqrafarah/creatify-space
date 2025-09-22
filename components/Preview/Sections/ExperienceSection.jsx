// components/Preview/sections/ExperienceSection.jsx
import React from 'react';
import Image from "next/image";

const ExperienceItem = ({ experience }) => (
  <div className="flex flex-row w-full gap-2 mt-5">
    <div className="flex flex-row items-center gap-4 w-full">
      <div className="w-15 h-10 min-w-10 rounded-full flex items-center justify-center flex-shrink-0">
        <Image
          src={experience.logo || "/default-logo.png"}
          width={65}
          height={65}
          alt={`${experience.company} logo`}
          className="w-[65px] h-[65px] min-w-10 rounded-full object-cover bg-[#f5f5f5] border border-[#1e1e1e]"
          onError={(e) => {
            e.target.src = "/default-logo.png";
          }}
        />
      </div>
      
      <div className="flex flex-col min-w-0 flex-1">
        <p className="text-base tracking-tight line-clamp-1 font-semibold text-start leading-normal">
          {experience.company}
        </p>
        <p className="text-sm tracking-tight line-clamp-1 text-start text-muted-foreground leading-normal">
          {experience.period}
        </p>
        {experience.position && (
          <p className="text-sm tracking-tight line-clamp-1 text-start text-gray-400 leading-normal">
            {experience.position}
          </p>
        )}
      </div>
    </div>
  </div>
);

export const ExperienceSection = ({ 
  data, 
  isMobilePreview = false,
  className = "flex flex-col gap-6 items-start justify-center mb-5 pb-14 sm:border-b sm:border-[#1e1e1e]"
}) => {
  if (!data || data.length === 0) return null;

  const gridClass = isMobilePreview 
    ? "flex flex-col gap-3 w-full" 
    : "grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-3 w-full";

  return (
    <div className={className}>
      <h2 className="text-xl font-semibold">Experience</h2>
      <div className={gridClass}>
        {data.map((exp, index) => (
          <ExperienceItem key={index} experience={exp} />
        ))}
      </div>
    </div>
  );
};