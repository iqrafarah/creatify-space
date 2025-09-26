import { NextResponse } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import prisma from "@/lib/db";

// Fetch footer data for the current user
export async function GET() {
  try {
    const userId = await verifySessionCookie();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get footer data, returns null if none exists
    const footer = await prisma.footer.findFirst({
      where: { userId },
    });

    // Return empty footer if none exists yet
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
    return NextResponse.json(
      { error: "Failed to fetch footer" },
      { status: 500 }
    );
  }
}

// Update footer data
export async function PUT(request) {
  try {
    const userId = await verifySessionCookie();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { title, description, contactUrl } = data;

    // Check if user already has a footer
    const existingFooter = await prisma.footer.findFirst({
      where: { userId },
    });

    let footer;

    if (existingFooter) {
      // Update existing footer data
      footer = await prisma.footer.updateMany({
        where: { userId },
        data: {
          title: title || "",
          description: description || "",
          contactUrl: contactUrl || "",
        },
      });

      // Get updated data to return
      const updatedFooter = await prisma.footer.findFirst({
        where: { userId },
      });

      return NextResponse.json({
        success: true,
        ...updatedFooter,
      });
    }
  } catch (error) {
    console.error("Footer update error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update footer",
      },
      { status: 500 }
    );
  }
}
