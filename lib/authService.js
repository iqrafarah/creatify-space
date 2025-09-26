export async function loginWithEmail(email) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const { error } = await response
        .json()
        .catch(() => ({
          error: "Failed to send magic link. Please try again.",
        }));
      return { success: false, error: error || "Failed to send magic link. Please try again." };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function signupWithEmail(email, username) {
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username }),
    });

    if (!response.ok) {
      const { error } = await response.json().catch(() => ({
        error: "Failed to create account. Please try again.",
      }));
      return { success: false, error: error || "Failed to create account. Please try again." };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}