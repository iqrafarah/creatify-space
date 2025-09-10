import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/session";

export async function GET() {
  try {
    // Get cookie to clear
    const cookie = clearSessionCookie();
    
    // Create redirect response
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`);
    
    // Clear the session cookie
    response.cookies.set(cookie.name, cookie.value, cookie.options);
    
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    // Even if error, redirect to login
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`);
  }
}