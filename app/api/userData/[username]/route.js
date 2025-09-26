import { NextResponse } from 'next/server';
import prisma from "@/lib/db";

export async function GET(request, { params }) {
  const { username } = params;
  
  try {
    const userData = await prisma.user.findUnique({
      where: { username },
      include: {
        profile: true,
        experiences: {
          orderBy: { order: "asc" },
        },
        skills: {
          orderBy: { order: "asc" },
        },
        Footer: true,
      },
    });

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}