//app/api/userData/[username]/route.js

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { username } = params;
    
    console.log("API received request for username:", username);
    
    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Fetch user data from all related tables based on username
    const userData = await prisma.user.findUnique({
      where: { username: username },
      include: {
        profile: true,
        experiences: { // Changed from experience to experiences
          orderBy: {
            order: 'asc'
          }
        },
        skills: true, // Changed from skill to skills
        footer: true // Added footer relation if it exists
      },
    });

    if (!userData) {
      console.log(`User not found for username: ${username}`);
      // Return mock data if user not found
      return NextResponse.json({
        userData: {
          colors: { backgroundColor: '#000', textColor: '#fff', headingColor: '#fff', borderColor: '#333' },
          hero: true,
          about: { about: true, text: "This is mock data for testing" },
          experiences: [{
            company: "Example Corp",
            title: "Frontend Developer",
            duration: "2020-Present",
            logo: "/logo.svg",
            order: 1
          }],
          skills: [{ 
            skills: ["React", "Next.js", "JavaScript"] 
          }],
          footer: {
            title: "Let's work together",
            description: "I'm available for freelance projects"
          }
        }
      });
    }
    
    console.log("Returning userData for:", username);
    return NextResponse.json({ userData });

  } catch (error) {
    console.error("User data fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data", details: error.message },
      { status: 500 }
    );
  }
}