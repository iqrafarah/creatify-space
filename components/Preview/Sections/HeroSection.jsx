// components/Preview/sections/HeroSection.jsx
import React from 'react';
import Image from "next/image";

export const HeroSection = ({ 
  data, 
  isMobilePreview = false,
  className = ""
}) => {
  const layoutClass = isMobilePreview 
    ? "flex-col items-center justify-center" 
    : "flex-row items-center";
    
  const textAlignment = isMobilePreview ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`${layoutClass} flex gap-5 w-full sm:pb-12 sm:border-b sm:border-[#1e1e1e] ${className}`}>
      <Image
        src={data.image || "/default-profile.png"}
        alt="Profile"
        width={150}
        height={150}
        className="border-2 border-[#1e1e1e] w-36 h-36 max-h-36 max-w-36 rounded-full object-cover object-center flex-shrink-0"
        onError={(e) => {
          e.target.src = "/default-profile.png";
        }}
      />
      
      <div className={`flex flex-col gap-2 w-full ${textAlignment}`}>
        {data.title && (
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {data.title}
          </h1>
        )}
        
        {data.position && (
          <p className="text-xl font-semibold text-[#d5e4fd] leading-6 whitespace-pre-wrap break-words">
            {data.position}
          </p>
        )}
        
        {data.description && (
          <p className="text-base text-gray-300 leading-6 whitespace-pre-wrap">
            {data.description}
          </p>
        )}
      </div>
    </div>
  );
};