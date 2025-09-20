import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifySessionCookie } from "@/lib/session";

export async function GET() {
  try {
    const userId = await verifySessionCookie();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const profile = await prisma.profile.findUnique({
      where: { userId }
    });

    const experiences = await prisma.experience.findMany({
      where: { userId },
      orderBy: { order: 'asc' }
    });

    const skills = await prisma.skill.findMany({
      where: { userId },
      orderBy: { order: 'asc' }
    });

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

export async function PUT(request) {
  try {
    const userId = await verifySessionCookie();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Only allow updating certain fields
    const { name, headline, shortDescription, imageUrl } = body;

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        name,
        headline,
        shortDescription,
        imageUrl,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      profile: {
        ...updatedProfile,
        createdAt: updatedProfile.createdAt.toISOString(),
        updatedAt: updatedProfile.updatedAt.toISOString()
      }
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}