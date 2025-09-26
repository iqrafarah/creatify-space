import React, { useEffect, useState, useCallback } from "react";
import { fetchProfile, updateProfile } from "@/lib/profileService";
import { useNotifications } from "@/hooks/useNotifications";
import { useFormWithChangeDetection } from "@/hooks/useFormWithChangeDetection";
import { FormField } from "@/components/Forms/FormField";
import { ActionButtons } from "@/components/Forms/ActionButtons";
import { NotificationList } from "@/components/Notifications/NotificationList";
import LoadingForm from "@/components/Forms/LoadingForm";

// Handles about section data management and updates
export default function About({ aboutDataChange, profile }) {
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { notifications, addNotification } = useNotifications();

  // Form state handling
  const {
    formData,
    isChanged,
    updateField,
    saveChanges,
    resetChanges,
    setFormData,
  } = useFormWithChangeDetection({
    summary: "",
  });

  const stableAboutDataChange = useCallback(aboutDataChange, []);

  // Load initial data
  useEffect(() => {
    if (hasLoaded) return;

    const loadSummary = async () => {
      try {
        let summaryData = profile 
          ? { summary: profile.summary || "" }
          : await fetchAndFormatProfile();

        setFormData(summaryData);
        saveChanges(summaryData);
        setHasLoaded(true);
      } catch (error) {
        console.error("Error loading summary:", error);
        addNotification("Failed to load summary data");
      } finally {
        setIsLoading(false);
      }
    };

    loadSummary();
  }, [profile, hasLoaded, setFormData, saveChanges, addNotification]);

  // Update parent component
  useEffect(() => {
    if (!isLoading && hasLoaded && stableAboutDataChange && !isChanged) {
      stableAboutDataChange({ about: formData.summary });
    }
  }, [isLoading, hasLoaded, stableAboutDataChange, isChanged]);

  const notifyParentOfChanges = useCallback(() => {
    stableAboutDataChange?.({ about: formData.summary });
  }, [formData.summary, stableAboutDataChange]);

  // Event handlers
  const handleInputChange = (e) => {
    updateField(e.target.name, e.target.value);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const currentProfile = await fetchProfile();
      const currentData = currentProfile?.hasProfile ? currentProfile.profile : {};
      
      const response = await updateProfile({
        ...currentData,
        summary: formData.summary,
      });

      if (response?.success) {
        saveChanges({ summary: formData.summary });
        addNotification("About section saved successfully🎉");
        notifyParentOfChanges();
      } else {
        addNotification(`Failed to save: ${response?.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error during save:", error);
      addNotification("Failed to save about section");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    const originalData = resetChanges();
    stableAboutDataChange?.({ about: originalData.summary });
  };

  if (isLoading) return <LoadingForm />;

  return (
    <>
      <form onSubmit={handleSave}>
        <FormField
          label="About me"
          name="summary"
          placeholder="Tell us about yourself..."
          value={formData.summary}
          onChange={handleInputChange}
          multiline
          rows={6}
        />

        {isChanged && (
          <ActionButtons
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isSaving}
            saveDisabled={!formData.summary.trim()}
          />
        )}
      </form>

      <NotificationList notifications={notifications} />
    </>
  );
}

// Helper function to fetch and format profile data
async function fetchAndFormatProfile() {
  const response = await fetchProfile();
  return response?.hasProfile && response.profile
    ? { summary: response.profile.summary || "" }
    : { summary: "" };
}