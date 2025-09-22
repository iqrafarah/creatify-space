// components/Forms/FormField.jsx
import React from 'react';

export const FormField = ({ 
  label, 
  name, 
  placeholder, 
  value, 
  onChange, 
  type = "text",
  multiline = false,
  rows = 4,
  required = false,
  disabled = false,
  className = "",
  containerClassName = "mt-5 flex flex-col gap-2"
}) => {
  const baseInputClassName = "flex w-full rounded-md border border-[var(--input)] px-4";
  const inputClassName = multiline 
    ? `${baseInputClassName} py-2 ${className}` 
    : `${baseInputClassName} h-10 text-black ${className}`;

  return (
    <div className={containerClassName}>
      <label htmlFor={name} className="text-muted text-md sm:text-sm">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {multiline ? (
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          className={inputClassName}
          value={value || ""}
          onChange={onChange}
          rows={rows}
          required={required}
          disabled={disabled}
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          placeholder={placeholder}
          className={inputClassName}
          value={value || ""}
          onChange={onChange}
          required={required}
          disabled={disabled}
        />
      )}
    </div>
  );
};