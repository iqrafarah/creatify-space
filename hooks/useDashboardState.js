// hooks/useDashboardState.js
import { useState } from 'react';

const initialFormData = {
  hero: { title: "", position: "", description: "", image: "" },
  about: { about: "" },
  experiences: [],
   skills: { skills: [] },
  footer: { title: "", description: "", email: "" }
};

export const useDashboardState = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  const updateSection = (section, data) => {
    setFormData(prev => ({ ...prev, [section]: data }));
  };

  const updateMultipleSections = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const resetSection = (section) => {
    setFormData(prev => ({ 
      ...prev, 
      [section]: initialFormData[section] 
    }));
  };

  const resetAllSections = () => {
    setFormData(initialFormData);
  };

  const toggleMobilePreview = () => {
    setIsMobilePreview(prev => !prev);
  };

  return {
    formData,
    isMobilePreview,
    setIsMobilePreview,
    toggleMobilePreview,
    updateSection,
    updateMultipleSections,
    resetSection,
    resetAllSections
  };
};
export default useDashboardState;