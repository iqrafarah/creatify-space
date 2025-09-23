// components/Dashboard/Footer.jsx
import React, { useEffect, useState, useCallback } from "react";
import { fetchFooter, updateFooter } from "@/lib/footerService";
import { useNotifications } from "@/hooks/useNotifications";
import { useFormWithChangeDetection } from "@/hooks/useFormWithChangeDetection";
import { FormField } from "@/components/Forms/FormField";
import { ActionButtons } from "@/components/Forms/ActionButtons";
import { NotificationList } from "@/components/Notifications/NotificationList";
import LoadingForm from "@/components/Forms/LoadingForm";

export default function Footer({ footerDataChange, initialData }) {
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
    title: "",
    description: "",
    contactUrl: "",  // Using contactUrl field from schema
    cvUrl: ""        // Including cvUrl from schema
  });

  // Memoize footerDataChange to prevent unnecessary re-renders
  const stableFooterDataChange = useCallback(footerDataChange, []);

  // Load footer data - ONLY ONCE
  useEffect(() => {
    if (hasLoaded) return; // Prevent multiple loads

    const loadFooter = async () => {
      setIsLoading(true);
      try {
        let footerData;

        if (initialData) {
          footerData = {
            title: initialData.title || "",
            description: initialData.description || "",
            contactUrl: initialData.contactUrl || "",
            cvUrl: initialData.cvUrl || ""
          };
        } else {
          const response = await fetchFooter();
          if (response?.success) {
            const f = response.footer;
            footerData = {
              title: f.title || "",
              description: f.description || "",
              contactUrl: f.contactUrl || "",
              cvUrl: f.cvUrl || ""
            };
          } else {
            footerData = {
              title: "",
              description: "",
              contactUrl: "",
              cvUrl: ""
            };
          }
        }

        setFormData(footerData);
        saveChanges(footerData);
        setHasLoaded(true); // Mark as loaded
      } catch (error) {
        console.error("Error loading footer data:", error);
        addNotification("Failed to load footer data");
      } finally {
        setIsLoading(false);
      }
    };

    loadFooter();
  }, [initialData, hasLoaded, setFormData, saveChanges, addNotification]);

  // Send updates to parent - but only after loading is complete
  useEffect(() => {
    if (!isLoading && hasLoaded && stableFooterDataChange && !isChanged) {
      stableFooterDataChange({
        title: formData.title,
        description: formData.description, 
        contactUrl: formData.contactUrl,
        cvUrl: formData.cvUrl
      });
    }
  }, [formData, isLoading, hasLoaded, stableFooterDataChange, isChanged]);

  const notifyParentOfChanges = useCallback(() => {
    if (stableFooterDataChange) {
      stableFooterDataChange({
        title: formData.title,
        description: formData.description,
        contactUrl: formData.contactUrl,
        cvUrl: formData.cvUrl
      });
    }
  }, [formData, stableFooterDataChange]);

  const handleInputChange = (e) => {
    updateField(e.target.name, e.target.value);
  };

  const handleSave = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (isSaving) return;
    
    setIsSaving(true);

    try {
      const response = await updateFooter({
        title: formData.title,
        description: formData.description,
        contactUrl: formData.contactUrl,
        cvUrl: formData.cvUrl
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

  const handleCancel = (e) => {
    if (e?.preventDefault) e.preventDefault();
    
    // Get the original saved data
    const originalData = resetChanges();
    setFormData(originalData);
    
    // Update parent with the reset data
    if (stableFooterDataChange) {
      stableFooterDataChange({
        title: originalData.title,
        description: originalData.description,
        contactUrl: originalData.contactUrl,
        cvUrl: originalData.cvUrl
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
          name="contactUrl"  // Using contactUrl field for email
          placeholder="example@example.com"
          value={formData.contactUrl}
          onChange={handleInputChange}
        />

        <FormField
          label="CV/Resume URL"
          name="cvUrl"
          placeholder="https://example.com/resume.pdf"
          value={formData.cvUrl}
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