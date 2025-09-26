import { NextResponse } from 'next/server';
import { verifySessionCookie } from '@/lib/session';
import prisma from '@/lib/db'; 

// Handles profile publish state toggle
export async function POST(request) {
  try {
    // Verify user is authenticated
    const userId = await verifySessionCookie();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }    

    // Get current user's publish state
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { isPublished: true }
    });

    // Check if profile exists
    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Toggle the publish state
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: { isPublished: !profile.isPublished }
    });

    // Return success with new state
    return NextResponse.json({ 
      isPublished: updatedProfile.isPublished,
      message: `Profile ${updatedProfile.isPublished ? 'published' : 'unpublished'} successfully`
    });

  } catch (error) {
    console.error('Toggle publish error:', error);
    return NextResponse.json(
      { error: "Failed to update publish status" },
      { status: 500 }
    );
  }
}