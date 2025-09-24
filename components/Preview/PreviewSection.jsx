// components/Preview/PreviewSection.jsx
import React from 'react';
import { PreviewControls } from './PreviewControls';
import { PreviewContent } from './PreviewContent';

export const PreviewSection = ({ 
  formData, 
  isMobilePreview, 
  setIsMobilePreview,
  handleColorChange,
  className = "w-full lg:w-3/5 flex flex-col gap-4 shadow-none rounded-lg h-fit lg:h-full overflow-hidden"
}) => {
  return (
    <div className={className}>
      <h3 className="font-semibold tracking-tight text-lg leading-5 mb-2">
        Preview
      </h3>
      
      <PreviewControls 
        isMobilePreview={isMobilePreview}
        setIsMobilePreview={setIsMobilePreview}
      />
      
      <PreviewContent 
        formData={formData}
        handleColorChange={handleColorChange}
        isMobilePreview={isMobilePreview}
      />
    </div>
  );
};