import prisma from "@/lib/db";
import { validateEmail } from "@/lib/validators";
import { cookies } from "next/headers";
import crypto from "crypto";
import { SendMagicLinkEmail } from "@/lib/email";

export async function POST(req) {
  try {
    const body = await req.json();
    let { email } = body || {};

    // normalize
    email = String(email || "")
      .trim()
      .toLowerCase();

    // validate
    if (!validateEmail(email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // find by email
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

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    
    // Set expiration (15 minutes from now)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    
    // Save token to database with user ID
    await prisma.verificationToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    // Build magic link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const magicLink = `${baseUrl}/api/auth/verify?token=${token}`;
    
    // Send magic link email
    await SendMagicLinkEmail(email, magicLink);

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