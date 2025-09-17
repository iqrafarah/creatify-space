import { cookies } from "next/headers";
import prisma from "@/lib/db";
import { verifySessionCookie } from "@/lib/session";

export async function GET() {
  try {
    // Use the verifySessionCookie function to get userId from cookie
    const userId = await verifySessionCookie();
    
    if (!userId) {
      return new Response(JSON.stringify({ 
        authenticated: false,
        error: "Not authenticated" 
      }), {
        status: 401,
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0"
        },
      });
    }
    
    // Get user from database
    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true
      }
    });
    
    if (!user) {
      return new Response(JSON.stringify({ 
        authenticated: false,
        error: "User not found" 
      }), {
        status: 401,
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0"
        },
      });
    }
    
    // Success - return user data
    return new Response(JSON.stringify({
      authenticated: true,
      ...user,
      createdAt: user.createdAt.toISOString()
    }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0"
      },
    });
  } catch (error) {
    console.error('Session error:', error);
    return new Response(JSON.stringify({ 
      authenticated: false,
      error: "Authentication error" 
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0"
      },
    });
  }
}