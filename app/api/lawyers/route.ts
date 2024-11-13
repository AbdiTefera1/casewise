/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/lawyers/route.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // Get query parameters for filtering and pagination
    const url = new URL(req.url);
    const page = Number(url.searchParams.get('page') || '1');
    const limit = Number(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    
    // Pagination logic
    const skip = (page - 1) * limit;

    // Filtering logic
    const lawyers = await prisma.lawyer.findMany({
      where: {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
        ],
      },
      skip,
      take: limit,
    });

    const totalLawyers = await prisma.lawyer.count({
      where: {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
        ],
      },
    });

    const totalPages = Math.ceil(totalLawyers / limit);

    return new Response(
      JSON.stringify({ data: lawyers, page, totalPages, totalLawyers }),
      { status: 200 }
    );
  } catch (error) {
    return new Response('Error fetching lawyers', { status: 500 });
  }
}


// POST create a new lawyer
export async function POST(req: Request) {
    try {
      const { firstName, lastName, email, phone, address } = await req.json();
      const newLawyer = await prisma.lawyer.create({
        data: { firstName, lastName, email, phone, address },
      });
      return new Response(JSON.stringify(newLawyer), { status: 201 });
    } catch (error) {
      return new Response('Error creating lawyer', { status: 500 });
    }
  }