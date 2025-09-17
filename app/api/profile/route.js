import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifySessionCookie } from "@/lib/session";

export async function GET() {
  try {
    // Verify the user is authenticated
    const userId = await verifySessionCookie();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Check if user has a profile
    const profile = await prisma.profile.findUnique({
      where: { userId }
    });
    
    // Get user's experiences (if any)
    const experiences = await prisma.experience.findMany({
      where: { userId },
      orderBy: { order: 'asc' }
    });
    
    // Get user's skills (if any)
    const skills = await prisma.skill.findMany({
      where: { userId },
      orderBy: { order: 'asc' }
    });
    
    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        email: true
      }
    });
    
    if (!profile) {
      return NextResponse.json({ 
        hasProfile: false,
        message: "Profile not found" 
      });
    }
    
    // Return the profile data
    return NextResponse.json({
      hasProfile: true,
      profile: {
        ...profile,
        user,
        experiences,
        skills: skills.map(skill => skill.name),
        createdAt: profile.createdAt.toISOString(),
        updatedAt: profile.updatedAt.toISOString()
      }
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}