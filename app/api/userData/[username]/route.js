import { NextResponse } from 'next/server';
import prisma from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { username } = params;
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

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
      return NextResponse.json({ error: 'User not found' }, { 
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return NextResponse.json(userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}