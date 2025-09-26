export async function fetchFooter() {
  try {
    const res = await fetch("/api/footer", { method: "GET" });
    if (!res.ok) {
      console.error(`Failed to fetch footer: ${res.status}`);
      return { success: false, error: `Failed to fetch footer data: ${res.status}` };
    }
    const data = await res.json();
    return { success: true, footer: data };
  } catch (error) {
    console.error("Error fetching footer:", error);
    return { success: false, error: error.message };
  }
}

export async function updateFooter(data) {
  try {
    const res = await fetch("/api/footer", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      console.error(`Failed to update footer: ${res.status}`);
      const errorData = await res.json().catch(() => ({}));
      return { 
        success: false, 
        error: errorData?.error || `Failed to update footer: ${res.status}` 
      };
    }
    
    const responseData = await res.json();
    return { success: true, footer: responseData };
  } catch (error) {
    console.error("Error updating footer:", error);
    return { success: false, error: error.message };
  }
}