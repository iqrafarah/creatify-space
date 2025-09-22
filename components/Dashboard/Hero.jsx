// components/Dashboard/Hero.jsx
import React, { useEffect, useState, useCallback } from "react";
import { fetchProfile, updateProfile } from "@/lib/profileService";
import { useNotifications } from "@/hooks/useNotifications";
import { useFormWithChangeDetection } from "@/hooks/useFormWithChangeDetection";
import { ProfileImageUpload } from "@/components/Forms/ProfileImageUpload";
import { FormField } from "@/components/Forms/FormField";
import { ActionButtons } from "@/components/Forms/ActionButtons";
import { NotificationList } from "@/components/Notifications/NotificationList";
import LoadingForm from "@/components/Forms/LoadingForm";

export default function Hero({ heroDataChange, profile }) {
  const [profileImage, setProfileImage] = useState("/placeholder-profile.png");
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
    name: "",
    position: "",
    description: "",
  });

  // Memoize heroDataChange to prevent unnecessary re-renders
  const stableHeroDataChange = useCallback(heroDataChange, []);

  // Load profile data - ONLY ONCE
  useEffect(() => {
    if (hasLoaded) return; // Prevent multiple loads

    const loadProfile = async () => {
      try {
        let profileData;

        if (profile) {
          profileData = {
            name: profile.name || "",
            position: profile.headline || "",
            description: profile.shortDescription || "",
            image: profile.imageUrl || "/logo.svg",
          };
        } else {
          const response = await fetchProfile();
          if (response?.hasProfile) {
            const p = response.profile;
            profileData = {
              name: p.name || "",
              position: p.headline || "",
              description: p.shortDescription || "",
              image: p.imageUrl || "/logo.svg",
            };
          } else {
            profileData = {
              name: "",
              position: "",
              description: "",
              image: "/placeholder-profile.png",
            };
          }
        }

        setFormData(profileData);
        setProfileImage(profileData.image);
        saveChanges(profileData);
        setHasLoaded(true); // Mark as loaded
      } catch (error) {
        console.error("Error loading profile:", error);
        addNotification("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [profile, hasLoaded, setFormData, saveChanges, addNotification]);

  // Send updates to parent - but only after loading is complete
  useEffect(() => {
    if (!isLoading && hasLoaded && stableHeroDataChange) {
      stableHeroDataChange({
        title: formData.name,
        position: formData.position, 
        description: formData.description,
        image: profileImage
      });
    }
  }, [formData, profileImage, isLoading, hasLoaded, stableHeroDataChange]);

  const handleInputChange = (e) => {
    updateField(e.target.name, e.target.value);
  };

  const handleImageChange = (newImage) => {
    setProfileImage(newImage);
    updateField("image", newImage);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const requestBody = {
      name: formData.name,
      headline: formData.position,
      shortDescription: formData.description,
      imageUrl: profileImage,
    };

    try {
      const response = await updateProfile(requestBody);

      if (response?.success) {
        const updatedData = { ...formData, image: profileImage };
        saveChanges(updatedData);
        addNotification("Hero updated successfully🎉");
      } else {
        addNotification(
          `Failed to save: ${response?.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error during save:", error);
      addNotification("Failed to save hero section");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    
    // Get the original saved data
    const originalData = resetChanges();
    
    // Reset the profile image to the saved version
    const savedImage = originalData.image || "/logo.svg";
    setProfileImage(savedImage);
    
    // Update parent with the reset data
    if (stableHeroDataChange) {
      stableHeroDataChange({
        title: originalData.name,
        position: originalData.position,
        description: originalData.description,
        image: savedImage,
      });
    }
  };

  if (isLoading) {
    return <LoadingForm />;
  }

  return (
    <>
      <form onSubmit={handleSave}>
        <ProfileImageUpload
          profileImage={profileImage}
          onImageChange={handleImageChange}
        />

        <FormField
          label="Name"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleInputChange}
          required
        />

        <FormField
          label="Position"
          name="position"
          placeholder="Full Stack Developer"
          value={formData.position}
          onChange={handleInputChange}
        />

        <FormField
          label="Description"
          name="description"
          placeholder="This is an example hero section."
          value={formData.description}
          onChange={handleInputChange}
          multiline
          rows={6}
        />

        {isChanged && (
          <ActionButtons
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isSaving}
            saveDisabled={!formData.name.trim()}
          />
        )}
      </form>

      <NotificationList notifications={notifications} />
    </>
  );
}