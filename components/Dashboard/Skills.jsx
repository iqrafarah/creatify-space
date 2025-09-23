import React, { useEffect, useState, useCallback } from "react";
import { fetchSkills, updateSkill, addSkill, deleteSkill } from "@/lib/skillsService";
import { useNotifications } from "@/hooks/useNotifications";
import { useFormWithChangeDetection } from "@/hooks/useFormWithChangeDetection";
import { FormField } from "@/components/Forms/FormField";
import { ActionButtons } from "@/components/Forms/ActionButtons";
import { NotificationList } from "@/components/Notifications/NotificationList";
import LoadingForm from "@/components/Forms/LoadingForm";

function textToList(text) {
  return (text || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((name) => ({ name }))
    .filter((x) => x.name.length > 0);
}

function listToText(list) {
  return (list || [])
    .map(({ name }) => name)
    .join(", ");
}

export default function Skills({ skillsDataChange, skills }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [serverSkills, setServerSkills] = useState([]); // [{id, name}]
  const { notifications, addNotification } = useNotifications();

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

  const stableSkillsDataChange = useCallback(skillsDataChange, []);

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

        if (list.length === 0 && skills) {
          if (Array.isArray(skills)) {
            list = skills.map(skill => typeof skill === 'string' ? { name: skill } : skill);
          } else if (typeof skills?.skills === "string") {
            list = textToList(skills.skills);
          } else if (Array.isArray(skills?.skills)) {
            list = skills.skills.map(skill => typeof skill === 'string' ? { name: skill } : skill);
          }
        }

        const normalized = (list || []).map((s) => ({
          id: s.id,
          name: s.name?.trim() || "",
        }));

        setServerSkills(normalized);

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

  useEffect(() => {
    if (!isLoading && hasLoaded && stableSkillsDataChange && !isChanged) {
      // Transform skills string to array before sending to parent
      const skillsArray = textToList(formData.skills).map(item => item.name);
      console.log("Initial skills data to parent:", skillsArray);
      stableSkillsDataChange(skillsArray);
    }
  }, [isLoading, hasLoaded, stableSkillsDataChange, isChanged, formData.skills]);

  const notifyParentOfChanges = useCallback(() => {
    if (stableSkillsDataChange) {
      // Transform skills string to array before sending to parent
      const skillsArray = textToList(formData.skills).map(item => item.name);
      console.log("Notifying parent of skills change:", skillsArray);
      stableSkillsDataChange(skillsArray);
    }
  }, [formData.skills, stableSkillsDataChange]);

  const handleInputChange = (e) => {
    updateField(e.target.name, e.target.value);
  };

  // Diff current textarea vs serverSkills, then call add/update/delete
  const handleSave = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);

    try {
      const desiredList = textToList(formData.skills); // [{name}]
      
      // Index server by name (case-insensitive) to match human input
      const serverByName = new Map(
        serverSkills.map((s) => [s.name.toLowerCase(), s])
      );
      const desiredByName = new Map(
        desiredList.map((s) => [s.name.toLowerCase(), s])
      );

      const toAdd = [];
      const toUpdate = [];
      const seenOnServer = new Set();

      // Add or update (just name changes)
      for (const { name } of desiredList) {
        const key = name.toLowerCase();
        const existing = serverByName.get(key);
        if (!existing) {
          toAdd.push({ name });
        } else {
          seenOnServer.add(existing.id);
          // No level to check, so no updates needed for existing skills
          // unless the name case changed
          if (existing.name !== name) {
            toUpdate.push({ id: existing.id, name });
          }
        }
      }

      // Delete (anything on server not present in desired)
      const toDelete = serverSkills
        .filter((s) => !desiredByName.has(s.name.toLowerCase()))
        .map((s) => s.id)
        .filter(Boolean);

      // Execute mutations (sequential for simpler error surfacing)
      for (const data of toAdd) {
        const res = await addSkill(data);
        if (!res?.success) {
          throw new Error(res?.error || `Failed to add "${data.name}"`);
        }
      }

      for (const data of toUpdate) {
        const res = await updateSkill(data);
        if (!res?.success) {
          throw new Error(res?.error || `Failed to update "${data.name}"`);
        }
      }

      for (const id of toDelete) {
        const res = await deleteSkill(id);
        if (!res?.success) {
          throw new Error(res?.error || "Failed to delete a skill");
        }
      }

      // Refresh from server to get canonical list and ids
      let fresh = [];
      try {
        const api = await fetchSkills();
        fresh = Array.isArray(api?.skills) ? api.skills : [];
      } catch {
        // If refresh fails, synthesize from desiredList (ids will be missing until next load)
        fresh = desiredList;
      }

      const normalized = (fresh || []).map((s) => ({
        id: s.id,
        name: s.name?.trim() || "",
      }));

      setServerSkills(normalized);

      const text = listToText(normalized);
      saveChanges({ skills: text });
      // Keep the current text (user already sees it), but sync formData to canonical format
      setFormData({ skills: text });

      addNotification("Skills saved successfully 🎉");
      notifyParentOfChanges();
    } catch (error) {
      console.error("Error during save:", error);
      addNotification(error?.message || "Failed to save skills");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = (e) => {
    if (e?.preventDefault) e.preventDefault();
    const originalData = resetChanges();
    setFormData(originalData);
    if (stableSkillsDataChange) {
      // Transform skills string to array before sending to parent
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