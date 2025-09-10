import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createSessionCookie } from "@/lib/session";

export async function GET(request) {
  try {
    // Get token from URL
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    
    if (!token) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login?error=invalid-token`);
    }
    
    // Find token in database
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });
    
    // Check if token exists and is valid
    if (!verificationToken) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login?error=invalid-token`);
    }
    
    // Check if token is expired
    if (new Date() > verificationToken.expiresAt) {
      // Delete expired token
      await prisma.verificationToken.delete({ where: { id: verificationToken.id } });
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login?error=expired-token`);
    }
    
    // Token is valid, set session cookie using your implementation
    const cookie = createSessionCookie(verificationToken.userId);
    
    // Create response for redirect
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`);
    
    // Set cookie on response
    response.cookies.set(cookie.name, cookie.value, cookie.options);
    
    // Delete used token (one-time use)
    await prisma.verificationToken.delete({ where: { id: verificationToken.id } });
    
    return response;
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login?error=server-error`);
  }
}