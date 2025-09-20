// lib/fetchProfile.js
export async function fetchProfile() {
  try {
    const response = await fetch("/api/profile");
    if (!response.ok) {
      return {
        hasProfile: false,
        error: `Profile API returned ${response.status}: ${response.statusText}`,
      };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return { hasProfile: false, error: error.message };
  }
}


export async function updateProfile(data) {
  try {
    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: {"Content-Type": "application/json", },
      credentials: "include",
      body: JSON.stringify(data),
    });
    
    return await response.json();
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}