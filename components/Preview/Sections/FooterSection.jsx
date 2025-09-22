// components/Preview/sections/FooterSection.jsx
import React from 'react';
import Link from "next/link";

export const FooterSection = ({ 
  data, 
  className = "flex flex-col items-center justify-center gap-6 my-14 h-fit lg:max-h-[200px]"
}) => {
  if (!data) return null;

  const showContactButton = data.email && data.title && data.description;

  return (
    <div className={className}>
      <div className="flex flex-col items-center gap-4 text-center">
        {data.title && (
          <h1 className="text-2xl font-bold">{data.title}</h1>
        )}
        
        {data.description && (
          <p className="text-lg text-gray-300 sm:px-10 leading-relaxed">
            {data.description}
          </p>
        )}
        
        {showContactButton && (
          <Link href={`mailto:${data.email}`}>
            <button className="bg-primary hover:bg-btn text-base mt-2 h-14 px-6 py-2 w-[190px] max-w-43 rounded-full font-semibold capitalize transition-colors">
              Say Hello
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};