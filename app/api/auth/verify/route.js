import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createSessionCookie } from "@/lib/session";

// Handles magic link verification and user login
export async function GET(request) {
  try {
    // Get token from magic link URL
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    
    if (!token) {
      console.log("No token provided");
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login?error=invalid-token`);
    }
    
    // Look up token and associated user in database
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });
    
    if (!verificationToken) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login?error=invalid-token`);
    }
    
    // Check if magic link has expired
    if (new Date() > verificationToken.expiresAt) {
      await prisma.verificationToken.delete({ where: { id: verificationToken.id } });
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login?error=expired-token`);
    }
    
    // Create session for valid login
    const cookie = createSessionCookie(verificationToken.userId);
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`);
    response.cookies.set(cookie.name, cookie.value, cookie.options);
    
    // Remove used token for security
    await prisma.verificationToken.delete({ where: { id: verificationToken.id } });
    
    return response;
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login?error=server-error`);
  }
}