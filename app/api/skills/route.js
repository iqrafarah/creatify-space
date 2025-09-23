// /app/api/skills/route.js
import { NextResponse } from "next/server";
import { verifySessionCookie } from "@/lib/session";
import prisma from "@/lib/db";

// GET: Fetch all skills for the current user
export async function GET() {
  try {
    const userId = await verifySessionCookie();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const skills = await prisma.skill.findMany({
      where: { userId },
      orderBy: { id: "asc" },
    });

    return NextResponse.json({ skills });
  } catch (error) {
    console.error("Skills fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

// POST: Add a new skill for the current user
export async function POST(request) {
  try {
    const userId = await verifySessionCookie();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const name = (data.name || "").trim();

    if (!name) {
      return NextResponse.json({ error: "Skill name is required" }, { status: 400 });
    }

    const newSkill = await prisma.skill.create({
      data: { userId, name, order: parseInt(data.order, 10) || 0 },
    });

    return NextResponse.json({ success: true, skill: newSkill }, { status: 201 });
  } catch (error) {
    console.error("Skill creation error:", error);
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}

// PUT: Update an existing skill
export async function PUT(request) {
  try {
    const userId = await verifySessionCookie();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    if (!data.id) {
      return NextResponse.json({ error: "Skill ID is required" }, { status: 400 });
    }

    const skill = await prisma.skill.findUnique({ where: { id: data.id } });
    if (!skill || skill.userId !== userId) {
      return NextResponse.json({ error: "Skill not found or unauthorized" }, { status: 404 });
    }

    const name = (data.name ?? skill.name).trim();

    const updatedSkill = await prisma.skill.update({
      where: { id: data.id },
      data: { name },
    });

    return NextResponse.json({ success: true, skill: updatedSkill });
  } catch (error) {
    console.error("Skill update error:", error);
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}

// DELETE: Remove a skill by ID
export async function DELETE(request) {
  try {
    const userId = await verifySessionCookie();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Skill ID is required" }, { status: 400 });
    }

    const skill = await prisma.skill.findUnique({ where: { id } });
    if (!skill || skill.userId !== userId) {
      return NextResponse.json({ error: "Skill not found or unauthorized" }, { status: 404 });
    }

    await prisma.skill.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Skill delete error:", error);
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
