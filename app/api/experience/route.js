import { NextResponse } from 'next/server';
import { verifySessionCookie } from '@/lib/session';
import prisma from "@/lib/db";

// Get all experiences for the logged-in user
export async function GET() {
  try {
    const userId = await verifySessionCookie();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get experiences sorted by their order
    const experiences = await prisma.experience.findMany({
      where: { userId },
      orderBy: { order: "asc" },
    });

    if (!experiences) {
      return NextResponse.json(
        { error: "No experiences found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ experiences });
  } catch (error) {
    console.error("Experiences fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
      { status: 500 }
    );
  }
}

// Update an existing experience
export async function PUT(request) {
  try {
    const userId = await verifySessionCookie();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    
    // Make sure experience exists and belongs to user
    if (data.id) {
      const experience = await prisma.experience.findUnique({
        where: { id: data.id }
      });
      
      if (!experience || experience.userId !== userId) {
        return NextResponse.json({ error: "Experience not found or unauthorized" }, { status: 404 });
      }
      
      const updatedExperience = await prisma.experience.update({
        where: { id: data.id },
        data: {
          title: data.title,
          company: data.company,
          duration: data.duration,
          logo: data.logo,
          order: data.order
        }
      });
      
      return NextResponse.json({ success: true, experience: updatedExperience });
    } 
  } catch (error) {
    console.error("Experience update error:", error);
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
  }
}

// Delete an experience entry
export async function DELETE(request) {
  try {
    const userId = await verifySessionCookie();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Experience ID is required" }, { status: 400 });
    }

    // Verify ownership before deleting
    const experience = await prisma.experience.findUnique({
      where: { id }
    });

    if (!experience || experience.userId !== userId) {
      return NextResponse.json({ error: "Experience not found or unauthorized" }, { status: 404 });
    }

    await prisma.experience.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Experience delete error:", error);
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}

// Add a new experience entry
export async function POST(request) {
  try {
    const userId = await verifySessionCookie();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    
    // Create with default values for optional fields
    const newExperience = await prisma.experience.create({
      data: {
        userId,
        title: data.title || "",
        company: data.company || "",
        duration: data.duration || "",
        logo: data.logo || "/logo.svg",
        order: data.order || 0
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      experience: newExperience 
    }, { status: 201 });
  } catch (error) {
    console.error("Experience creation error:", error);
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
  }
}