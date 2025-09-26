import { cookies } from "next/headers";
import prisma from "@/lib/db";
import { verifySessionCookie } from "@/lib/session";
import { RateLimiter } from "@/lib/rateLimit";

const rateLimiter = new RateLimiter();

const COMMON_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store, max-age=0"
};

// Checks if user is logged in and returns their data
export async function GET(req) {
  try {
    // Check rate limit first
    const ip = req.headers.get('x-forwarded-for') || 'localhost';
    const rateLimit = await rateLimiter.checkLimit(ip);

    if (!rateLimit.isAllowed) {
      return new Response(JSON.stringify({ 
        error: "Too many requests" 
      }), {
        status: 429,
        headers: {
          ...COMMON_HEADERS,
          "X-RateLimit-Remaining": rateLimit.remaining,
          "X-RateLimit-Reset": rateLimit.reset
        }
      });
    }

    // Check if user has valid session cookie
    const userId = await verifySessionCookie();
    
    if (!userId) {
      return new Response(JSON.stringify({ 
        authenticated: false,
        error: "Not authenticated" 
      }), {
        status: 401,
        headers: COMMON_HEADERS
      });
    }
    
    // Get basic user info from database
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
        headers: COMMON_HEADERS
      });
    }
    
    // Return user data if everything is ok
    return new Response(JSON.stringify({
      authenticated: true,
      ...user,
      createdAt: user.createdAt.toISOString()
    }), {
      status: 200,
      headers: COMMON_HEADERS
    });
  } catch (error) {
    console.error('Session error:', error);
    return new Response(JSON.stringify({ 
      authenticated: false,
      error: "Authentication error" 
    }), {
      status: 500,
      headers: COMMON_HEADERS
    });
  }
}