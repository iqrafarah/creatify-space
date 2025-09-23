export async function fetchSkills() {
  const res = await fetch("/api/skills", { method: "GET" });
  if (!res.ok) {
    const msg = `Failed to fetch skills: ${res.status}`;
    throw new Error(msg);
  }
  return res.json();
}

// Add (create) a new skill
export async function addSkill(data) {
  const res = await fetch("/api/skills", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("Error adding skill:", json);
    return {
      success: false,
      error: json?.error || `POST /api/skills ${res.status}`,
    };
  }
  return json;
}

// Update an existing skill
export async function updateSkill(data) {
  const res = await fetch("/api/skills", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("Error updating skill:", json);
    return {
      success: false,
      error: json?.error || `PUT /api/skills ${res.status}`,
    };
  }
  return json;
}

// Delete a skill by ID (JSON body)
export async function deleteSkill(id) {
  const res = await fetch("/api/skills", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("Error deleting skill:", json);
    return {
      success: false,
      error: json?.error || `DELETE /api/skills ${res.status}`,
    };
  }
  return json;
}
