import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Get search and location terms from the user's browser request
  const search = searchParams.get("search") || "";
  const location = searchParams.get("location") || "";
  
  try {
    const colleges = await prisma.college.findMany({
      where: {
        AND: [
          { name: { contains: search, mode: "insensitive" } },
          location ? { location: { contains: location, mode: "insensitive" } } : {},
        ],
      },
      orderBy: {
        rating: "desc", // Sort by highest rating first
      },
    });

    return NextResponse.json(colleges);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch colleges" }, { status: 500 });
  }
}