export async function fetchPublishState() {
  try {
    const response = await fetch(`/api/profile`);
    if (!response.ok) {
      return {
        isPublished: false,
        error: `Profile API returned ${response.status}: ${response.statusText}`,
      };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return { isPublished: false, error: error.message };
  }
}

export async function togglePublish(isPublished) {
  try {
    const response = await fetch("/api/togglePublish", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isPublished }),
      credentials: 'include', // Important for sending cookies
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error toggling publish status:", error);
    throw error;
  }
}