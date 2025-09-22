// components/Dashboard/Experience.jsx
import React, { useState, useEffect, useCallback } from "react";
import ExperienceForm from "./ExperienceForm";
import Image from "next/image";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationList } from "@/components/Notifications/NotificationList";
import LoadingForm from "@/components/Forms/LoadingForm";
import { 
  fetchExperience, 
  createExperience, 
  updateExperience, 
  deleteExperience 
} from "@/lib/experienceService";

export default function Experience({ onUpdate }) {
  const [experiences, setExperiences] = useState([]);
  const [editingIndices, setEditingIndices] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { notifications, addNotification } = useNotifications();

  // Memoize onUpdate to prevent unnecessary re-renders
  const stableOnUpdate = useCallback(onUpdate, []);

  // Load experiences - ONLY ONCE
  useEffect(() => {
    if (hasLoaded) return;

    const loadExperiences = async () => {
      try {
        const response = await fetchExperience();
        if (response.error) {
          console.error("Error fetching experiences:", response.error);
          addNotification("Failed to load experiences");
          setExperiences([]);
        } else {
          setExperiences(response.experiences || []);
        }
        setHasLoaded(true);
      } catch (error) {
        console.error("Error loading experiences:", error);
        addNotification("Failed to load experiences");
        setExperiences([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadExperiences();
  }, [hasLoaded, addNotification]);

  // Update parent component when experiences change
  useEffect(() => {
    if (!isLoading && hasLoaded && stableOnUpdate) {
      stableOnUpdate(experiences);
    }
  }, [experiences, isLoading, hasLoaded, stableOnUpdate]);

  const addExperience = async (newExperience) => {
    try {
      const response = await createExperience(newExperience);
      if (response.success) {
        addNotification("Experience saved successfully🎉");
        const updatedExperiences = [...experiences, response.experience];
        setExperiences(updatedExperiences);
        toggleEdit(-1); // Close the add form
      } else {
        addNotification(`Failed to add experience: ${response.error}`);
      }
    } catch (error) {
      console.error("Error adding experience:", error);
      addNotification("Failed to add experience");
    }
  };

  const handleDeleteExperience = async (id) => {
    try {
      const response = await deleteExperience(id);
      if (response.success) {
        addNotification("Experience deleted successfully🚀");
        const updatedExperiences = experiences.filter((exp) => exp.id !== id);
        setExperiences(updatedExperiences);
      } else {
        addNotification(`Failed to delete experience: ${response.error}`);
      }
    } catch (error) {
      console.error("Error deleting experience:", error);
      addNotification("Failed to delete experience");
    }
  };

  const handleUpdateExperience = async (updatedExperience, index) => {
    try {
      const experienceWithId = {
        ...updatedExperience,
        id: experiences[index].id
      };
      const response = await updateExperience(experienceWithId);
      if (response.success) {
        addNotification("Experience updated successfully🚀");
        const updatedExperiences = experiences.map((exp, idx) =>
          idx === index ? response.experience : exp
        );
        setExperiences(updatedExperiences);
        toggleEdit(index); // Close the edit form
      } else {
        addNotification(`Failed to update experience: ${response.error}`);
      }
    } catch (error) {
      console.error("Error updating experience:", error);
      addNotification("Failed to update experience");
    }
  };

  const toggleEdit = (index) => {
    const newEditingIndices = new Set(editingIndices);
    if (newEditingIndices.has(index)) {
      newEditingIndices.delete(index);
    } else {
      newEditingIndices.add(index);
    }
    setEditingIndices(newEditingIndices);
  };

  if (isLoading) {
    return <LoadingForm />;
  }

  return (
    <>
      <div className="flex flex-col gap-2 transition-all mt-5">
        <p className="text-muted text-md sm:text-sm">Experiences</p>
        
        {experiences.map((exp, index) =>
          editingIndices.has(index) ? (
            <ExperienceForm
              key={`edit-${index}`}
              experience={exp}
              onSave={(updatedExperience) => handleUpdateExperience(updatedExperience, index)}
              onCancel={() => toggleEdit(index)}
              onDelete={() => handleDeleteExperience(exp.id)}
            />
          ) : (
            <ExperienceCard
              key={`card-${index}`}
              experience={exp}
              onClick={() => toggleEdit(index)}
            />
          )
        )}

        {editingIndices.has(-1) && (
          <ExperienceForm
            key="add-new"
            experience={{ company: "", title: "", period: "", logo: "" }}
            onSave={addExperience}
            onCancel={() => toggleEdit(-1)}
            onDelete={() => {}} // No-op for add form
          />
        )}

        <button
          onClick={() => toggleEdit(-1)}
          disabled={editingIndices.has(-1)}
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium bg-white w-full px-4 py-2 rounded-md border border-[#e7e5e4] hover:bg-[#f5f5f5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Add Experience
        </button>
      </div>

      <NotificationList notifications={notifications} />
    </>
  );
}

// Extracted component for better organization
const ExperienceCard = ({ experience, onClick }) => (
  <div
    className="rounded-lg border border-[var(--input)] bg-card text-card-foreground shadow hover:bg-[#f5f5f5] cursor-pointer transition-all w-full"
    onClick={onClick}
  >
    <div className="w-full flex flex-row gap-4 p-4">
      <div className="w-10 h-10 min-w-10 rounded-lg bg-[#f5f5f5] flex items-center justify-center">
        <Image
          src={experience.logo || "/logo.svg"}
          width={40}
          height={40}
          className="w-[40px] h-[40px] min-w-10 rounded-full object-cover bg-[#f5f5f5] flex items-center justify-center border border-[#364061]"
          alt={experience.company}
          onError={(e) => {
            e.target.src = "/logo.svg";
          }}
        />
      </div>
      <div className="flex flex-col">
        <p className="text-sm tracking-tight line-clamp-1 font-bold text-start transition-all leading-normal">
          {experience.company}
        </p>
        <p className="text-sm tracking-tight line-clamp-1 text-start transition-all text-muted-foreground leading-normal">
          {experience.duration}
        </p>
      </div>
    </div>
  </div>
);