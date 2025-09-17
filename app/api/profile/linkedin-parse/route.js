import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifySessionCookie } from "@/lib/session";
import { mapLinkedInTextToEntities } from "@/lib/linkedin-map";

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
      where: { userId },
      include: {
        user: {
          select: {
            username: true,
            email: true
          }
        }
      }
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

export async function POST(req) {
  try {
    // Verify the user is authenticated
    const userId = await verifySessionCookie();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { text } = await req.json();
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    // Map the LinkedIn text to structured data
    const linkedInData = mapLinkedInTextToEntities(text);

    // Create or update the profile
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: {
        name: linkedInData.profile.name || "",
        headline: linkedInData.profile.headline || "",
        summary: linkedInData.profile.about || "", // Map about to summary field
        available: linkedInData.profile.available,
        updatedAt: new Date()
      },
      create: {
        userId,
        name: linkedInData.profile.name || "",
        headline: linkedInData.profile.headline || "",
        summary: linkedInData.profile.about || "", // Map about to summary field
        available: linkedInData.profile.available,
      }
    });

    // Delete existing experiences
    await prisma.experience.deleteMany({
      where: { userId }
    });

    // Create new experiences
    if (linkedInData.experiences && linkedInData.experiences.length > 0) {
      await prisma.experience.createMany({
        data: linkedInData.experiences.map((exp, index) => ({
          userId,
          company: exp.company,
          title: exp.title,
          duration: exp.duration,
          order: index
        }))
      });
    }

    // Delete existing skills
    await prisma.skill.deleteMany({
      where: { userId }
    });

    // Create new skills
    if (linkedInData.skills && linkedInData.skills.length > 0) {
      await prisma.skill.createMany({
        data: linkedInData.skills.map((skill, index) => ({
          userId,
          name: skill,
          order: index
        }))
      });
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated with LinkedIn data"
    });
  } catch (error) {
    console.error("LinkedIn parsing error:", error);
    return NextResponse.json(
      { error: "Failed to process LinkedIn data" },
      { status: 500 }
    );
  }
}