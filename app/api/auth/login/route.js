import prisma from "@/lib/db";
import { validateEmail } from "@/lib/validators";
import { cookies } from "next/headers";
import crypto from "crypto";
import { SendMagicLinkEmail } from "@/lib/email";

// Handles login requests using magic links (passwordless login)
export async function POST(req) {
  try {
    const body = await req.json();
    let { email } = body || {};

    // Clean up email input
    email = String(email || "")
      .trim()
      .toLowerCase();

    // Check if email is valid
    if (!validateEmail(email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if user exists in database
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return new Response(
        JSON.stringify({
          error: "No account found with this email. Please sign up.",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create a secure random token for magic link
    const token = crypto.randomBytes(32).toString("hex");
    
    // Token expires in 15 minutes
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    
    // Save the token in database linked to user
    try {
      const createdToken = await prisma.verificationToken.create({
        data: {
          token,
          userId: user.id,
          expiresAt,
        },
      });
      console.log("Verification token created:", createdToken);
    } catch (tokenError) {
      console.error("Error creating verification token:", tokenError);
      return new Response(JSON.stringify({ error: "Failed to create verification token" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create magic link URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const magicLink = `${baseUrl}/api/auth/verify?token=${token}`;
    
    // Send login email with magic link
    await SendMagicLinkEmail(email, magicLink);

    // Return success response
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}