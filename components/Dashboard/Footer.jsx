import React, { useEffect, useState, useCallback } from "react";
import { fetchFooter, updateFooter } from "@/lib/footerService";
import { useNotifications } from "@/hooks/useNotifications";
import { useFormWithChangeDetection } from "@/hooks/useFormWithChangeDetection";
import { FormField } from "@/components/Forms/FormField";
import { ActionButtons } from "@/components/Forms/ActionButtons";
import { NotificationList } from "@/components/Notifications/NotificationList";
import LoadingForm from "@/components/Forms/LoadingForm";

// Handles footer section data management and updates
export default function Footer({ footerDataChange, initialData }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false); 
  const { notifications, addNotification } = useNotifications();

  // Form state management
  const {
    formData,
    isChanged,
    updateField,
    saveChanges,
    resetChanges,
    setFormData,
  } = useFormWithChangeDetection({
    title: "",
    description: "",
    contactUrl: "",
  });

  // Memoize callback to avoid unnecessary re-renders
  const stableFooterDataChange = useCallback(footerDataChange, []);

  // Load footer data on mount
  useEffect(() => {
    if (hasLoaded) return;

    const loadFooter = async () => {
      setIsLoading(true);
      try {
        let footerData;

        if (initialData) {
          footerData = {
            title: initialData.title || "",
            description: initialData.description || "",
            contactUrl: initialData.contactUrl || "",
          };
        } else {
          const response = await fetchFooter();
          if (response?.success) {
            const f = response.footer;
            footerData = {
              title: f.title || "",
              description: f.description || "",
              contactUrl: f.contactUrl || "",
            };
          } else {
            footerData = {
              title: "",
              description: "",
              contactUrl: "",
            };
          }
        }

        setFormData(footerData);
        saveChanges(footerData);
        setHasLoaded(true);
      } catch (error) {
        console.error("Error loading footer data:", error);
        addNotification("Failed to load footer data");
      } finally {
        setIsLoading(false);
      }
    };

    loadFooter();
  }, [initialData, hasLoaded, setFormData, saveChanges, addNotification]);

  // Notify parent when data is loaded and not changed
  useEffect(() => {
    if (!isLoading && hasLoaded && stableFooterDataChange && !isChanged) {
      stableFooterDataChange({
        title: formData.title,
        description: formData.description, 
        contactUrl: formData.contactUrl,
      });
    }
  }, [formData, isLoading, hasLoaded, stableFooterDataChange, isChanged]);

  // Memoized function to notify parent of changes
  const notifyParentOfChanges = useCallback(() => {
    if (stableFooterDataChange) {
      stableFooterDataChange({
        title: formData.title,
        description: formData.description,
        contactUrl: formData.contactUrl,
      });
    }
  }, [formData, stableFooterDataChange]);

  // Handle input changes
  const handleInputChange = (e) => {
    updateField(e.target.name, e.target.value);
  };

  // Save footer data
  const handleSave = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (isSaving) return;
    
    setIsSaving(true);

    try {
      const response = await updateFooter({
        title: formData.title,
        description: formData.description,
        contactUrl: formData.contactUrl,
      });

      if (response?.success) {
        saveChanges(formData);
        addNotification("Footer updated successfully 🎉");
        notifyParentOfChanges();
      } else {
        addNotification(
          `Failed to save: ${response?.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error during save:", error);
      addNotification("Failed to save footer section");
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel and reset changes
  const handleCancel = (e) => {
    if (e?.preventDefault) e.preventDefault();
    const originalData = resetChanges();
    setFormData(originalData);
    if (stableFooterDataChange) {
      stableFooterDataChange({
        title: originalData.title,
        description: originalData.description,
        contactUrl: originalData.contactUrl,
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
          label="Title"
          name="title"
          placeholder="Let's create awesome products!"
          value={formData.title}
          onChange={handleInputChange}
        />

        <FormField
          label="Description"
          name="description"
          placeholder="This is an example footer section."
          value={formData.description}
          onChange={handleInputChange}
        />

        <FormField
          label="Email to contact"
          name="contactUrl"
          placeholder="example@example.com"
          value={formData.contactUrl}
          onChange={handleInputChange}
        />

        {isChanged && (
          <ActionButtons
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isSaving}
          />
        )}
      </form>

      <NotificationList notifications={notifications} />
    </>
  );
}