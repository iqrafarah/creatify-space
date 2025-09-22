// components/Preview/sections/AboutSection.jsx
import React from 'react';

export const AboutSection = ({ 
  data, 
  className = "flex flex-col gap-2 my-7 items-start border-b pb-7 border-[#1e1e1e]"
}) => {
  if (!data?.about) return null;
  
  return (
    <div className={className}>
      <h2 className="text-xl font-semibold">About me</h2>
      <p className="text-lg text-left text-gray-300 leading-relaxed whitespace-pre-wrap">
        {data.about}
      </p>
    </div>
  );
};