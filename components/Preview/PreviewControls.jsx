import React from 'react';

const PreviewButton = ({ active, onClick, icon, ariaLabel }) => {
  const icons = {
    mobile: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="w-6 h-6">
        <path 
          d="M4 2.5C4 2.22386 4.22386 2 4.5 2H10.5C10.7761 2 11 2.22386 11 2.5V12.5C11 12.7761 10.7761 13 10.5 13H4.5C4.22386 13 4 12.7761 4 12.5V2.5ZM4.5 1C3.67157 1 3 1.67157 3 2.5V12.5C3 13.3284 3.67157 14 4.5 14H10.5C11.3284 14 12 13.3284 12 12.5V2.5C12 1.67157 11.3284 1 10.5 1H4.5ZM6 11.65C5.8067 11.65 5.65 11.8067 5.65 12C5.65 12.1933 5.8067 12.35 6 12.35H9C9.1933 12.35 9.35 12.1933 9.35 12C9.35 11.8067 9.1933 11.65 9 11.65H6Z" 
          fill="currentColor" 
          fillRule="evenodd" 
          clipRule="evenodd" 
        />
      </svg>
    ),
    desktop: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" 
        />
      </svg>
    )
  };

  return (
    <button
      className={`focus:bg-gray-100 px-3 h-9 rounded-md transition-colors ${active ? "bg-gray-200" : ""}`}
      onClick={onClick}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {icons[icon]}
    </button>
  );
};

export const PreviewControls = ({ 
  isMobilePreview, 
  setIsMobilePreview,
  className = "flex gap-5"
}) => {
  return (
    <div className={className}>
      <PreviewButton 
        active={isMobilePreview}
        onClick={() => setIsMobilePreview(true)}
        icon="mobile"
        ariaLabel="Mobile preview"
      />
      <PreviewButton 
        active={!isMobilePreview}
        onClick={() => setIsMobilePreview(false)}
        icon="desktop"
        ariaLabel="Desktop preview"
      />
    </div>
  );
};