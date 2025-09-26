import React, { useEffect, useState, useCallback } from "react";
import { fetchProfile, updateProfile } from "@/lib/profileService";
import { useNotifications } from "@/hooks/useNotifications";
import { useFormWithChangeDetection } from "@/hooks/useFormWithChangeDetection";
import { ProfileImageUpload } from "@/components/Forms/ProfileImageUpload";
import { FormField } from "@/components/Forms/FormField";
import { ActionButtons } from "@/components/Forms/ActionButtons";
import { NotificationList } from "@/components/Notifications/NotificationList";
import LoadingForm from "@/components/Forms/LoadingForm";
import { Switch } from "@/components/Forms/Switch";

// Handles hero/profile section data management and updates
export default function Hero({ heroDataChange, profile }) {
  const [profileImage, setProfileImage] = useState("/placeholder-profile.png");
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
    name: "",
    position: "",
    description: "",
    available: false,
  });

  // Memoize callback to avoid unnecessary re-renders
  const stableHeroDataChange = useCallback(heroDataChange, []);

  // Load profile data on mount
  useEffect(() => {
    if (hasLoaded) return;

    const loadProfile = async () => {
      try {
        let profileData;

        if (profile) {
          profileData = {
            name: profile.name || "",
            position: profile.headline || "",
            description: profile.shortDescription || "",
            image: profile.imageUrl || "/logo.svg",
            available: profile.available || false,
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
              available: p.available || false,
            };
          } else {
            profileData = {
              name: "",
              position: "",
              description: "",
              image: "/logo.svg",
              available: false,
            };
          }
        }

        setFormData(profileData);
        setProfileImage(profileData.image);
        saveChanges(profileData);
        setHasLoaded(true);
      } catch (error) {
        console.error("Error loading profile:", error);
        addNotification("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [profile, hasLoaded, setFormData, saveChanges, addNotification]);

  // Notify parent when data is loaded and not changed
  useEffect(() => {
    if (!isLoading && hasLoaded && stableHeroDataChange) {
      stableHeroDataChange({
        title: formData.name,
        position: formData.position,
        description: formData.description,
        image: profileImage,
        available: formData.available || false,
      });
    }
  }, [formData, profileImage, isLoading, hasLoaded, stableHeroDataChange]);

  // Handle input changes
  const handleInputChange = (e) => {
    updateField(e.target.name, e.target.value);
  };

  // Handle profile image changes
  const handleImageChange = (newImage) => {
    setProfileImage(newImage);
    updateField("image", newImage);
  };

  // Handle availability switch
  const handleAvailabilityChange = (checked) => {
    updateField("available", checked);
  };

  // Save profile data
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const requestBody = {
      name: formData.name,
      headline: formData.position,
      shortDescription: formData.description,
      imageUrl: profileImage,
      available: formData.available,
    };

    try {
      const response = await updateProfile(requestBody);

      if (response?.success) {
        const updatedData = { ...formData, image: profileImage };
        saveChanges(updatedData);
        addNotification("Profile changes saved🎉");
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

  // Cancel and reset changes
  const handleCancel = (e) => {
    e.preventDefault();
    const originalData = resetChanges();
    const savedImage = originalData.image || "/logo.svg";
    setProfileImage(savedImage);

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

        <div className="flex items-center justify-between py-4 ">
          <div className="space-y-0.5">
            <label className="text-sm font-medium">Available for Work</label>
            <p className="text-xs text-gray-400">
              Show others you're open to new opportunities
            </p>
          </div>
          <Switch
            checked={Boolean(formData.available)}
            onCheckedChange={handleAvailabilityChange}
            className="data-[state=checked]: bg-[var(--primary)]"
          />
        </div>

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