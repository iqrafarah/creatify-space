import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FormField } from "@/components/Forms/FormField";
import { ActionButtons } from "@/components/Forms/ActionButtons";
import LoadingForm from "@/components/Forms/LoadingForm";

export default function ExperienceForm({
  experience,
  onSave,
  onCancel,
  onDelete,
}) {
  const [formData, setFormData] = useState({
    company: experience?.company || "",
    title: experience?.title || "",
    period: experience?.duration || "", // Keep as period in form for UX
    logo: experience?.logo || "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const isNewExperience = !experience?.id;
  const [isLoading, setIsLoading] = useState(true);

  // Set loading state to false after component mounts
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Handle logo file upload
  useEffect(() => {
    if (logoFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(logoFile);
    }
  }, [logoFile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
    }
  };

  const handleSave = async () => {
    if (!formData.company.trim() || !formData.period.trim()) {
      return; // Don't save if required fields are empty
    }

    setIsSaving(true);
    try {
      const experienceData = {
        ...experience,
        company: formData.company,
        title: formData.title,
        duration: formData.period, // Map period to duration for API
        logo: formData.logo,
      };
      await onSave(experienceData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    console.log("Experience object on delete:", experience);
    const expId = experience.id;
    if (expId) {
      onDelete(expId);
    } else {
      console.error("No ID found for deletion.");
    }
  };

  const isValid = formData.company.trim() && formData.period.trim();

  if (isLoading) {
    return <LoadingForm />;
  }

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
          label="Job Title"
          name="title"
          placeholder="Software Engineer"
          value={formData.title}
          onChange={handleInputChange}
          required
        />

        <FormField
          label="Duration"
          name="period"
          placeholder="Jan 2023 - Present"
          value={formData.period}
          onChange={handleInputChange}
          required
        />

        <div className="flex flex-col gap-2">
          <label className="text-muted text-sm">Company Logo</label>
          <div className="flex gap-3 items-center">
            <LogoUpload logo={formData.logo} onLogoChange={handleLogoChange} />
            <div className="w-full flex gap-2">
              <ActionButtons
                onSave={handleSave}
                onCancel={onCancel}
                onDelete={handleDelete}
                showDelete={!isNewExperience}
                isLoading={isSaving}
                saveDisabled={!isValid}
                showCancel={true}
                className="w-full flex gap-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// Logo upload component
const LogoUpload = ({ logo, onLogoChange }) => (
  <label className="inline-flex items-center p-1 justify-center rounded-md text-sm border border-[var(--input)] cursor-pointer bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
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
