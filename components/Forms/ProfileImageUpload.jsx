import React, { useRef } from 'react';
import Image from "next/image";

const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-8 h-8 text-white absolute z-20"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
    />
  </svg>
);

export const ProfileImageUpload = ({
  profileImage,
  onImageChange,
  size = 100,
  className = ""
}) => {
  const inputRef = useRef(null);

  // Open file dialog when container is clicked
  const handleContainerClick = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onImageChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageError = (e) => {
    e.target.src = "/logo.svg";
  };

  return (
    <div
      className={`relative rounded-full bg-gray-100 flex items-center justify-center cursor-pointer ${className}`}
      style={{ width: size, height: size }}
      onClick={handleContainerClick}
      tabIndex={0}
      role="button"
      aria-label="Upload profile image"
      onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') handleContainerClick(); }}
    >
      <input
        ref={inputRef}
        id="profile-image-upload"
        className="hidden"
        accept="image/*"
        type="file"
        onChange={handleImageChange}
        tabIndex={-1}
      />

      <div className="absolute inset-0 border-dotted border-[var(--input)] rounded-full overflow-hidden">
        {profileImage && (
          <>
            <Image
              src={profileImage}
              alt="Profile"
              fill
              className="object-cover object-center"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-black opacity-30"></div>
          </>
        )}
      </div>

      <UploadIcon />
    </div>
  );
};