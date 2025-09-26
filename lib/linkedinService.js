export async function uploadLinkedInPdf(file) {
  try {
    const formData = new FormData();
    formData.append("linkedinPdf", file);

    const response = await fetch("/api/profile/linkedin-upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      return {
        text: null,
        error: `Upload API returned ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    return { text: null, error: error.message };
  }
}

export async function parseLinkedInText(text) {
  try {
    const response = await fetch("/api/profile/linkedin-parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Parse API returned ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    return { success: false, error: error.message };
  }
}


