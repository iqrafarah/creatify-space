// hooks/useFormWithChangeDetection.js
import { useState } from 'react';

export const useFormWithChangeDetection = (initialData) => {
  const [formData, setFormData] = useState(initialData);
  const [savedData, setSavedData] = useState(initialData);
  const [isChanged, setIsChanged] = useState(false);

  const updateField = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsChanged(true);
  };

  const updateMultipleFields = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setIsChanged(true);
  };

  const saveChanges = (data) => {
    const dataToSave = data || formData;
    setSavedData(dataToSave);
    setFormData(dataToSave);
    setIsChanged(false);
  };

  const resetChanges = () => {
    setFormData(savedData);
    setIsChanged(false);
    return savedData;
  };

  const setFormData_ = (data) => {
    setFormData(data);
    setSavedData(data);
    setIsChanged(false);
  };

  return {
    formData,
    savedData,
    isChanged,
    updateField,
    updateMultipleFields,
    saveChanges,
    resetChanges,
    setFormData: setFormData_
  };
};