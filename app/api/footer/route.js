// /app/api/footer/route.js
import { NextResponse } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import prisma from "@/lib/db";

// GET: Fetch footer data for the current user
export async function GET() {
  try {
    const userId = await verifySessionCookie();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's footer data - use findFirst instead of findUnique
    const footer = await prisma.footer.findFirst({
      where: { userId },
    });

    console.log("footer", footer);

    // If no footer exists yet, return an empty object
    if (!footer) {
      return NextResponse.json({ 
        title: "",
        description: "",
        contactUrl: "",
      });
    }

    return NextResponse.json(footer);
  } catch (error) {
    console.error("Footer fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch footer" }, { status: 500 });
  }
}

// PUT: Update the footer data
export async function PUT(request) {
  try {
    const userId = await verifySessionCookie();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { title, description, contactUrl} = data;

    // Check if footer exists for this user
    const existingFooter = await prisma.footer.findFirst({
      where: { userId },
    });

    let footer;

    if (existingFooter) {
      // Update existing footer
      footer = await prisma.footer.updateMany({
        where: { userId },
        data: {
          title: title || "",
          description: description || "",
          contactUrl: contactUrl || "",
        },
      });
      
      // Get the updated footer to return
      const updatedFooter = await prisma.footer.findFirst({
        where: { userId }
      });
      
      return NextResponse.json({ 
        success: true, 
        ...updatedFooter 
      });
    } else {
      // Create new footer
      footer = await prisma.footer.create({
        data: {
          userId,
          title: title || "",
          description: description || "",
          contactUrl: contactUrl || "",
        },
      });
      
      return NextResponse.json({ 
        success: true, 
        ...footer 
      });
    }
  } catch (error) {
    console.error("Footer update error:", error);
    return NextResponse.json({ 
      success: false,
      error: "Failed to update footer" 
    }, { status: 500 });
  }
}