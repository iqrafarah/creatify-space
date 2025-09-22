// components/Forms/ActionButtons.jsx
import React from 'react';

export const ActionButtons = ({ 
  onSave, 
  onCancel, 
  isLoading = false,
  saveText = "Save",
  cancelText = "Cancel",
  showCancel = true,
  saveDisabled = false,
  cancelDisabled = false,
  className = "w-full flex gap-2 h-min mt-5"
}) => {
  return (
    <div className={className}>
      <button
        onClick={onSave}
        disabled={isLoading || saveDisabled}
        className={`flex items-center justify-center font-medium bg-black hover:bg-btn text-white py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${
          showCancel ? 'w-1/2' : 'w-full'
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </>
        ) : (
          saveText
        )}
      </button>
      
      {showCancel && (
        <button
          onClick={onCancel}
          disabled={isLoading || cancelDisabled}
          className="flex items-center justify-center w-1/2 bg-white font-medium text-gray-600 py-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cancelText}
        </button>
      )}
    </div>
  );
};