// components/Forms/ActionButtons.jsx
import React from "react";

export const ActionButtons = ({
  onSave,
  onCancel,
  onDelete,
  showDelete = false,
  isLoading = false,
  saveText = "Save",
  cancelText = "Cancel",
  showCancel = true,
  saveDisabled = false,
  cancelDisabled = false,
  className = "w-full flex gap-2 h-min mt-5",
}) => {

  return (
    <div className={className}>
      <button
        onClick={onSave}
        disabled={isLoading || saveDisabled}
        className={`flex items-center justify-center font-medium bg-black hover:bg-btn text-white py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${
          showCancel ? "w-1/2" : "w-full"
        }`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
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

      {showDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center w-fit px-4 py-2 justify-center rounded-md text-sm border border-input hover:bg-red-100 hover:border-red-300 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
            data-slot="icon"
            className="w-4 h-4 text-red-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            ></path>
          </svg>
        </button>
      )}
    </div>
  );
};
