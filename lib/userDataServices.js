// lib/userDataServices.js
import prisma from '@/lib/db';

// Client-side function (browser)
export function fetchUserData(username) {
  if (!username) {
    return Promise.reject(new Error("Username is required"));
  }
  
  return fetch(`/api/userData/${username}`, { method: "GET" })
    .then((res) => {
      if (!res.ok) {
        console.error(`Failed to fetch userData: ${res.status}`);
        throw new Error(`Failed to fetch userData: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("API response data:", data);
      return data;
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
      return { error: error.message };
    });
}


export async function getUserDataServer(username) {
  if (!username) {
    throw new Error("Username is required");
  }

  try {
    const userData = await prisma.user.findUnique({
      where: { username },
      include: {
        profile: true,
        experiences: {
          orderBy: { order: 'asc' }
        },
        skills: {
          orderBy: { order: 'asc' }
        },
        Footer: true
      },
    });

    return userData;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
}

// Universal function that works on both client and server
export async function fetchUserDataUniversal(username) {
  // Check if we're on the server or client
  if (typeof window === 'undefined') {
    // Server-side: use direct DB access
    return getUserDataServer(username);
  } else {
    // Client-side: use API
    return fetchUserData(username);
  }
}