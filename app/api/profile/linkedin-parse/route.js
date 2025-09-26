import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifySessionCookie } from "@/lib/session";
import { mapLinkedInTextToEntities } from "@/lib/linkedin-map";

// Fetch full profile data for the current user
export async function GET() {
  try {
    // Check authentication
    const userId = await verifySessionCookie();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get user's profile and related data
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: { username: true, email: true }
        }
      }
    });
    
    // Get additional profile sections
    const [experiences, skills, footer] = await Promise.all([
      prisma.experience.findMany({
        where: { userId },
        orderBy: { order: 'asc' }
      }),
      prisma.skill.findMany({
        where: { userId },
        orderBy: { order: 'asc' }
      }),
      prisma.footer.findUnique({
        where: { userId }
      })
    ]);
    
    if (!profile) {
      return NextResponse.json({ 
        hasProfile: false,
        message: "Profile not found" 
      });
    }
    
    // Return complete profile data
    return NextResponse.json({
      hasProfile: true,
      profile: {
        ...profile,
        experiences,
        skills: skills.map(skill => skill.name),
        footer,
        createdAt: profile.createdAt.toISOString(),
        updatedAt: profile.updatedAt.toISOString()
      }
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

// Parse LinkedIn data and update profile
export async function POST(req) {
  try {
    const userId = await verifySessionCookie();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate input
    const { text } = await req.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // Convert LinkedIn text to structured data
    const linkedInData = mapLinkedInTextToEntities(text);

    // Update or create profile with LinkedIn data
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: {
        name: linkedInData.profile.name || "",
        headline: linkedInData.profile.headline || "",
        shortDescription: "lorem ipsum dolor sit amet...", 
        summary: linkedInData.profile.about || "",
        available: linkedInData.profile.available,
        updatedAt: new Date()
      },
      create: {
        userId,
        name: linkedInData.profile.name || "",
        headline: linkedInData.profile.headline || "",
        shortDescription: "lorem ipsum dolor sit amet...",
        summary: linkedInData.profile.about || "",
        available: linkedInData.profile.available,
      }
    });

    // Replace experiences with LinkedIn data
    await prisma.experience.deleteMany({ where: { userId } });
    if (linkedInData.experiences?.length) {
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

    // Replace skills with LinkedIn data
    await prisma.skill.deleteMany({ where: { userId } });
    if (linkedInData.skills?.length) {
      await prisma.skill.createMany({
        data: linkedInData.skills.map((skill, index) => ({
          userId,
          name: skill,
          order: index
        }))
      });
    }

    // Create default footer if none exists
    const existingFooter = await prisma.footer.findUnique({ where: { userId } });
    if (!existingFooter) {
      await prisma.footer.create({
        data: {
          userId,
          title: "Let's Connect!",
          description: "I'm always open to discussing new projects...",
          contactUrl: linkedInData.profile.email || "hello@example.com",
          cvUrl: "https://example.com/resume.pdf"
        }
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