import React, { useEffect, useState, useCallback } from "react";
import { fetchSkills, updateSkill, addSkill, deleteSkill } from "@/lib/skillsService";
import { useNotifications } from "@/hooks/useNotifications";
import { useFormWithChangeDetection } from "@/hooks/useFormWithChangeDetection";
import { FormField } from "@/components/Forms/FormField";
import { ActionButtons } from "@/components/Forms/ActionButtons";
import { NotificationList } from "@/components/Notifications/NotificationList";
import LoadingForm from "@/components/Forms/LoadingForm";

// Turns a comma-separated string into a list of skill objects
function textToList(text) {
  return (text || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((name) => ({ name }))
    .filter((x) => x.name.length > 0);
}

// Turns a list of skill objects into a comma-separated string
function listToText(list) {
  return (list || [])
    .map(({ name }) => name)
    .join(", ");
}

// This component lets you view, add, edit, and delete your skills
export default function Skills({ skillsDataChange, skills }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [serverSkills, setServerSkills] = useState([]); // Skills from the server
  const { notifications, addNotification } = useNotifications();

  // Handles the form state and change detection
  const {
    formData,
    isChanged,
    updateField,
    saveChanges,
    resetChanges,
    setFormData,
  } = useFormWithChangeDetection({
    skills: "",
  });

  // Makes sure the callback doesn't change unless needed
  const stableSkillsDataChange = useCallback(skillsDataChange, []);

  // Load skills from the server or props when the component mounts
  useEffect(() => {
    if (hasLoaded) return;

    const load = async () => {
      setIsLoading(true);
      try {
        let api = null;
        try {
          api = await fetchSkills(); 
        } catch (err) {
          console.error("fetchSkills error:", err);
        }

        let list = Array.isArray(api?.skills) ? api.skills : [];

        // If nothing from API, try to use the skills prop
        if (list.length === 0 && skills) {
          if (Array.isArray(skills)) {
            list = skills.map(skill => typeof skill === 'string' ? { name: skill } : skill);
          } else if (typeof skills?.skills === "string") {
            list = textToList(skills.skills);
          } else if (Array.isArray(skills?.skills)) {
            list = skills.skills.map(skill => typeof skill === 'string' ? { name: skill } : skill);
          }
        }

        // Make sure each skill has the right shape
        const normalized = (list || []).map((s) => ({
          id: s.id,
          name: s.name?.trim() || "",
        }));

        setServerSkills(normalized);

        // Show skills as a comma-separated string in the form
        const text = listToText(normalized);
        setFormData({ skills: text });
        saveChanges({ skills: text });
        setHasLoaded(true);
      } catch (error) {
        console.error("Error loading skills:", error);
        addNotification("Failed to load skills data");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [skills, hasLoaded, setFormData, saveChanges, addNotification]);

  // Tell the parent component about the skills when loaded and not changed
  useEffect(() => {
    if (!isLoading && hasLoaded && stableSkillsDataChange && !isChanged) {
      // Convert the string to an array before sending
      const skillsArray = textToList(formData.skills).map(item => item.name);
      stableSkillsDataChange(skillsArray);
    }
  }, [isLoading, hasLoaded, stableSkillsDataChange, isChanged, formData.skills]);

  // Helper to notify parent when skills change
  const notifyParentOfChanges = useCallback(() => {
    if (stableSkillsDataChange) {
      const skillsArray = textToList(formData.skills).map(item => item.name);
      stableSkillsDataChange(skillsArray);
    }
  }, [formData.skills, stableSkillsDataChange]);

  // Update form when user types
  const handleInputChange = (e) => {
    updateField(e.target.name, e.target.value);
  };

  // Save skills to the server (add, update, delete as needed)
  const handleSave = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);

    try {
      const desiredList = textToList(formData.skills); // [{name}]
      
      // Match up skills by name (case-insensitive)
      const serverByName = new Map(
        serverSkills.map((s) => [s.name.toLowerCase(), s])
      );
      const desiredByName = new Map(
        desiredList.map((s) => [s.name.toLowerCase(), s])
      );

      const toAdd = [];
      const toUpdate = [];
      const seenOnServer = new Set();

      // Figure out which skills to add or update
      for (const { name } of desiredList) {
        const key = name.toLowerCase();
        const existing = serverByName.get(key);
        if (!existing) {
          toAdd.push({ name });
        } else {
          seenOnServer.add(existing.id);
          // Only update if the name's case changed
          if (existing.name !== name) {
            toUpdate.push({ id: existing.id, name });
          }
        }
      }

      // Figure out which skills to delete
      const toDelete = serverSkills
        .filter((s) => !desiredByName.has(s.name.toLowerCase()))
        .map((s) => s.id)
        .filter(Boolean);

      // Add new skills
      for (const data of toAdd) {
        const res = await addSkill(data);
        if (!res?.success) {
          throw new Error(res?.error || `Failed to add "${data.name}"`);
        }
      }

      // Update skills if needed
      for (const data of toUpdate) {
        const res = await updateSkill(data);
        if (!res?.success) {
          throw new Error(res?.error || `Failed to update "${data.name}"`);
        }
      }

      // Delete removed skills
      for (const id of toDelete) {
        const res = await deleteSkill(id);
        if (!res?.success) {
          throw new Error(res?.error || "Failed to delete a skill");
        }
      }

      // Get the latest skills from the server
      let fresh = [];
      try {
        const api = await fetchSkills();
        fresh = Array.isArray(api?.skills) ? api.skills : [];
      } catch {
        // If refresh fails, just use what the user entered
        fresh = desiredList;
      }

      const normalized = (fresh || []).map((s) => ({
        id: s.id,
        name: s.name?.trim() || "",
      }));

      setServerSkills(normalized);

      // Update the form with the latest skills
      const text = listToText(normalized);
      saveChanges({ skills: text });
      setFormData({ skills: text });

      addNotification("Skills changes saved 🎉");
      notifyParentOfChanges();
    } catch (error) {
      console.error("Error during save:", error);
      addNotification(error?.message || "Failed to save skills");
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel changes and reset the form
  const handleCancel = (e) => {
    if (e?.preventDefault) e.preventDefault();
    const originalData = resetChanges();
    setFormData(originalData);
    if (stableSkillsDataChange) {
      const skillsArray = textToList(originalData.skills).map(item => item.name);
      stableSkillsDataChange(skillsArray);
    }
  };

  if (isLoading) {
    return <LoadingForm />;
  }

  return (
    <>
      <form onSubmit={handleSave}>
        <FormField
          label="Skills"
          name="skills"
          placeholder="List your skills (e.g. React, JavaScript, CSS, Node.js)"
          value={formData.skills}
          onChange={handleInputChange}
          multiline
          rows={4}
        />

        {isChanged && (
          <ActionButtons
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isSaving}
            saveDisabled={!formData.skills.trim()}
          />
        )}
      </form>
      <NotificationList notifications={notifications} />
    </>
  );
}