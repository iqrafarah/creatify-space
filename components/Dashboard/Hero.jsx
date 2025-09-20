import React, { useEffect, useState } from "react";
import Image from "next/image";
import Notification from "@/components/Toast";
import { fetchProfile, updateProfile } from "@/lib/fetchProfile";

export default function Hero({ heroDataChange, profile }) {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    description: "",
  });
  const [profileImage, setProfileImage] = useState("/placeholder-profile.png");
  const [savedData, setSavedData] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataUpdated, setDataUpdated] = useState(false);

  // Load data on mount or when profile prop changes
  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);

      try {
        let heroData;
        if (profile) {
          // Use provided profile prop
          heroData = {
            name: profile.name || "",
            position: profile.headline || "",
            description: profile.shortDescription || "",
            image: profile.imageUrl || "/logo.svg",
          };
        } else {
          // Fallback: fetch from API
          const profileData = await fetchProfile();
          if (profileData && profileData.hasProfile) {
            const p = profileData.profile;
            console.log("Fetched profile data:", p);

            heroData = {
              name: p.name || "",
              position: p.headline || "",
              description: p.shortDescription || "",
              image: p.imageUrl || "/logo.svg",
            };
          } else {
            heroData = {
              name: "",
              position: "",
              description: "",
              image: "/placeholder-profile.png",
            };
          }
        }

        setFormData({
          name: heroData.name,
          position: heroData.position,
          description: heroData.description,
        });
        setProfileImage(heroData.image);
        setSavedData(heroData);
        localStorage.setItem("heroData", JSON.stringify(heroData));
      } catch (error) {
        console.error("Error loading profile:", error);
        addNotification("Failed to load profile data");
      } finally {
        setIsLoading(false);
        setDataUpdated(true);
      }
    };

    loadProfileData();
  }, [profile]);

  useEffect(() => {
    if (!isLoading && dataUpdated) {
      heroDataChange({
        name: formData.name || "",
        position: formData.position || "",
        description: formData.description || "",
        image: profileImage,
      });
      setDataUpdated(false);
    }
  }, [isLoading, dataUpdated, formData, profileImage, heroDataChange]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setIsChanged(true);
    setDataUpdated(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setIsChanged(true);
        setDataUpdated(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const addNotification = (message) => {
    setNotifications((prev) => [...prev, { key: Date.now(), message }]);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Map form fields to API fields
    const requestBody = {
      name: formData.name,
      headline: formData.position, // <-- API expects 'headline'
      shortDescription: formData.description, // <-- API expects 'shortDescription'
      imageUrl: profileImage, // <-- API expects 'imageUrl'
    };

    console.log("Saving profile with data:", requestBody);
    setIsChanged(false);

    try {
      const response = await updateProfile(requestBody);

      if (response && response.success) {
        addNotification("Hero updated successfully🎉");
        const updatedData = { ...formData, image: profileImage };
        setSavedData(updatedData);
        setFormData(updatedData);
        localStorage.setItem("heroData", JSON.stringify(updatedData));
        setDataUpdated(true);
      } else {
        addNotification(
          `Failed to save: ${response?.error || "Unknown error"}`
        );
      }
    } catch (error) {
      addNotification("Failed to save hero section");
      console.error("Error during save:", error);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setFormData(savedData);
    setProfileImage(savedData.image || "/placeholder-profile.png");
    setIsChanged(false);
    setDataUpdated(true);
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading hero section...</div>;
  }

  return (
    <>
      <form>
        <div className="relative w-[100px] h-[100px] rounded-full bg-gray-100 flex items-center justify-center cursor-pointer">
          <input
            id="file"
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            accept="image/*"
            type="file"
            onChange={handleImageChange}
            aria-label="Upload profile image"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute inset-0 border rounded-full overflow-hidden">
            {profileImage && (
              <>
                <Image
                  src={profileImage}
                  alt="Profile"
                  fill
                  className="object-cover object-center"
                  onError={(e) => {
                    e.target.src = "/placeholder-profile.png";
                  }}
                />
                <div className="absolute inset-0 bg-black opacity-30"></div>
              </>
            )}
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
            className="w-8 h-8 text-white absolute z-20"
            onClick={() => document.getElementById("file").click()}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            ></path>
          </svg>
        </div>
        <div className="mt-5 flex flex-col gap-2">
          <p className="text-muted text-md sm:text-sm">name</p>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            className="flex h-10 w-full rounded-md border border-[var(--input)] px-4 text-black"
            value={formData.name || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="mt-5 flex flex-col gap-2">
          <p className="text-muted text-md sm:text-sm">Position</p>
          <input
            type="text"
            name="position"
            placeholder="Full Stack Developer"
            className="flex h-10 w-full rounded-md border border-[var(--input)] px-4"
            value={formData.position || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="mt-5 flex flex-col gap-2">
          <p className="text-muted text-md sm:text-sm">Description</p>
          <textarea
            name="description"
            placeholder="This is an example hero section."
            className="flex h-32 w-full rounded-md border border-[var(--input)] px-4 py-2"
            value={formData.description || ""}
            onChange={handleInputChange}
          />
        </div>
        {isChanged && (
          <div className="w-full flex gap-2 h-min mt-5">
            <button
              onClick={handleSave}
              className="flex items-center justify-center w-1/2 font-medium bg-black hover:bg-btn text-white py-2 rounded-md"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center justify-center w-1/2 bg-white font-medium text-gray-600 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
      {notifications.map((notification) => (
        <Notification
          key={notification.key}
          message={notification.message}
          duration={3000}
        />
      ))}
    </>
  );
}
