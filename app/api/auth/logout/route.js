import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/session";

// Handles user logout by clearing session and redirecting to login page
export async function GET() {
  try {
    // Get settings for clearing the session cookie
    const cookie = clearSessionCookie();
    
    // Set up redirect to login page
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`);
    
    // Remove the session cookie from browser
    response.cookies.set(cookie.name, cookie.value, cookie.options);
    
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    // Redirect to login even if there's an error clearing cookies
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`);
  }
}