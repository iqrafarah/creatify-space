import prisma from "@/lib/db";
import { validateEmail, validateUsername } from "@/lib/validators";
import { cookies } from "next/headers";
import crypto from "crypto";
import { SendMagicLinkEmail } from "@/lib/email";

// Handles new user signup and validation
export async function POST(req) {
  try {
    const body = await req.json();
    let { email, username } = body || {};

    // Clean up user input
    email = String(email || "").trim().toLowerCase();
    username = String(username || "").trim().toLowerCase();

    // Check if email and username are valid
    if (!validateEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!validateUsername(username)) {
      return new Response(
        JSON.stringify({ error: "Invalid username. Use only letters, numbers, and underscores" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Make sure email and username aren't already taken
    const [existingEmail, existingUsername] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.user.findUnique({ where: { username } })
    ]);

    if (existingEmail) {
      return new Response(
        JSON.stringify({ error: "Email already registered. Please log in instead." }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (existingUsername) {
      return new Response(
        JSON.stringify({ error: "Username already taken. Please choose another." }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create the new user account
    await prisma.user.create({
      data: { email, username }
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Log error and return friendly message
    console.error("Signup error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create account. Please try again." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}