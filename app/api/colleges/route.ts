import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all colleges from the live Neon database
    const colleges = await prisma.college.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Send the data back to the frontend with a clear success code
    return NextResponse.json(colleges, { status: 200 });
  } catch (error) {
    console.error("Database fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch colleges from database" },
      { status: 500 }
    );
  }
}
