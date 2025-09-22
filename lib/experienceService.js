// lib/fetchExperience.js

export async function fetchExperience() {
  try {
    const response = await fetch("/api/experience");
    if (!response.ok) {
      return {
        hasExperience: false,
        error: `Experience API returned ${response.status}: ${response.statusText}`,
      };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return { hasExperience: false, error: error.message };
  }
}

export async function createExperience(experienceData) {
  try {
    const response = await fetch("/api/experience", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(experienceData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || `Failed to create experience: ${response.status}`,
      };
    }

    const data = await response.json();
    return { success: true, experience: data.experience };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateExperience(experienceData) {
  try {
    const response = await fetch("/api/experience", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(experienceData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || `Failed to update experience: ${response.status}`,
      };
    }

    const data = await response.json();
    return { success: true, experience: data.experience };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteExperience(experienceId) {
  try {
    const response = await fetch("/api/experience", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: experienceId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || `Failed to delete experience: ${response.status}`,
      };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}