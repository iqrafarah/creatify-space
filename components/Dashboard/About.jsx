// components/Dashboard/About.jsx
import React, { useEffect, useState, useCallback } from "react";
import { fetchProfile, updateProfile } from "@/lib/profileService";
import { useNotifications } from "@/hooks/useNotifications";
import { useFormWithChangeDetection } from "@/hooks/useFormWithChangeDetection";
import { FormField } from "@/components/Forms/FormField";
import { ActionButtons } from "@/components/Forms/ActionButtons";
import { NotificationList } from "@/components/Notifications/NotificationList";
import LoadingForm from "@/components/Forms/LoadingForm";

export default function About({ aboutDataChange, profile }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { notifications, addNotification } = useNotifications();

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

  // Memoize aboutDataChange to prevent unnecessary re-renders
  const stableAboutDataChange = useCallback(aboutDataChange, []);

  // Load summary data - ONLY ONCE
  useEffect(() => {
    if (hasLoaded) return; // Prevent multiple loads

    const loadSummary = async () => {
      try {
        let summaryData;
        
        if (profile) {
          summaryData = {
            summary: profile.summary || "",
          };
        } else {
          const response = await fetchProfile();
          if (response?.hasProfile && response.profile) {
            summaryData = {
              summary: response.profile.summary || "",
            };
          } else {
            summaryData = { summary: "" };
          }
        }

        setFormData(summaryData);
        saveChanges(summaryData);
        setHasLoaded(true); // Mark as loaded
      } catch (error) {
        console.error("Error loading summary:", error);
        addNotification("Failed to load summary data");
      } finally {
        setIsLoading(false);
      }
    };

    loadSummary();
  }, [profile, hasLoaded, setFormData, saveChanges, addNotification]);

  // Send updates to parent - but only after loading is complete and not on every keystroke
  useEffect(() => {
    // Only notify parent when data is fully loaded, not during typing
    if (!isLoading && hasLoaded && stableAboutDataChange && !isChanged) {
      stableAboutDataChange({
        about: formData.summary
      });
    }
  }, [isLoading, hasLoaded, stableAboutDataChange, isChanged]);

  // Separate effect to handle parent updates when form is saved
  const notifyParentOfChanges = useCallback(() => {
    if (stableAboutDataChange) {
      stableAboutDataChange({
        about: formData.summary
      });
    }
  }, [formData.summary, stableAboutDataChange]);

  const handleInputChange = (e) => {
    updateField(e.target.name, e.target.value);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // First, get the current profile data to avoid overwriting other fields
    try {
      const currentProfile = await fetchProfile();
      const currentData = currentProfile?.hasProfile ? currentProfile.profile : {};
      
      // Create a request that preserves existing data and updates the summary
      const requestBody = {
        name: currentData.name || "",
        headline: currentData.headline || "",
        shortDescription: currentData.shortDescription || "",
        imageUrl: currentData.imageUrl || "",
        summary: formData.summary,
      };
      
      const response = await updateProfile(requestBody);

      if (response?.success) {
        const updatedData = { summary: formData.summary };
        saveChanges(updatedData);
        addNotification("About section saved successfully🎉");
        // Notify parent after successful save
        notifyParentOfChanges();
      } else {
        addNotification(
          `Failed to save: ${response?.error || "Unknown error"}`
        );
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
    
    // Get the original saved data
    const originalData = resetChanges();
    
    // Update parent with the reset data
    if (stableAboutDataChange) {
      stableAboutDataChange({
        about: originalData.summary
      });
    }
  };

  if (isLoading) {
    return <LoadingForm />;
  }

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