// components/Dashboard/ExperienceForm.jsx
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FormField } from "@/components/Forms/FormField";
import { ActionButtons } from "@/components/Forms/ActionButtons";

export default function ExperienceForm({ 
  experience, 
  onSave, 
  onCancel, 
  onDelete 
}) {
  const [formData, setFormData] = useState({
    company: experience?.company || "",
    period: experience?.period || "",
    logo: experience?.logo || ""
  });
  const [logoFile, setLogoFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Handle logo file upload
  useEffect(() => {
    if (logoFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(logoFile);
    }
  }, [logoFile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
    }
  };

  const handleSave = async () => {
    if (!formData.company.trim()) {
      return; // Don't save if company name is empty
    }

    setIsSaving(true);
    try {
      const experienceData = {
        ...experience,
        ...formData
      };
      await onSave(experienceData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (experience?._id && onDelete) {
      onDelete(experience._id);
    }
  };

  const isValid = formData.company.trim() && formData.period.trim();

  return (
    <div className="rounded-lg border bg-card text-card-foreground p-4 shadow-sm w-full">
      <div className="flex flex-col gap-4">
        <FormField
          label="Company"
          name="company"
          placeholder="Example Company"
          value={formData.company}
          onChange={handleInputChange}
          required
        />

          <FormField
          label="Title"
          name="title"
          placeholder="Example Title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />


        <FormField
          label="Period"
          name="period"
          placeholder="Jan 2023 - Present"
          value={formData.period}
          onChange={handleInputChange}
          required
        />

        <div className="flex flex-col gap-2">
          <label className="text-muted text-sm">
            Company Logo
          </label>
          <div className="flex gap-3 items-center">
            <LogoUpload
              logo={formData.logo}
              onLogoChange={handleLogoChange}
            />
            <div className="flex-1 flex gap-2">
              <ActionButtons
                onSave={handleSave}
                onCancel={onCancel}
                isLoading={isSaving}
                saveDisabled={!isValid}
                showCancel={true}
                className="flex gap-2"
              />
              {onDelete && experience?._id && (
                <DeleteButton onDelete={handleDelete} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Logo upload component
const LogoUpload = ({ logo, onLogoChange }) => (
  <label className="inline-flex items-center p-1 justify-center rounded-md text-sm border border-input cursor-pointer bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={onLogoChange}
    />
    {logo ? (
      <Image
        src={logo}
        alt="Logo preview"
        width={35}
        height={30}
        className="w-[35px] h-[30px] rounded-full object-cover bg-[#f5f5f5] border border-[#364061]"
        onError={(e) => {
          e.target.src = "/default-logo.png";
        }}
      />
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-8 h-8 text-gray-600"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    )}
  </label>
);

// Delete button component
const DeleteButton = ({ onDelete }) => (
  <button
    onClick={onDelete}
    className="inline-flex items-center w-fit px-3 py-2 justify-center rounded-md text-sm border border-input hover:bg-red-50 hover:border-red-300 transition-colors"
    title="Delete experience"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-4 h-4 text-red-500"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244 2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
      />
    </svg>
  </button>
);