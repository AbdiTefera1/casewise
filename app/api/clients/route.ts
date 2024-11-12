// /app/api/clients/route.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET request handler to fetch all clients with filtering and pagination
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const { name, email, phone, page = '1', pageSize = '10' } = Object.fromEntries(url.searchParams);

    // Convert `page` and `pageSize` to integers
    const pageNumber = parseInt(page as string, 10) || 1;
    const size = parseInt(pageSize as string, 10) || 10;
    const skip = (pageNumber - 1) * size;

    // Fetch total count for pagination metadata
    const totalClients = await prisma.client.count({
      where: {
        firstName: name ? { contains: name as string, mode: 'insensitive' } : undefined,
        email: email ? { contains: email as string, mode: 'insensitive' } : undefined,
        phone: phone ? { contains: phone as string, mode: 'insensitive' } : undefined,
      },
    });

    // Fetch clients with filters and pagination
    const clients = await prisma.client.findMany({
      where: {
        firstName: name ? { contains: name as string, mode: 'insensitive' } : undefined,
        email: email ? { contains: email as string, mode: 'insensitive' } : undefined,
        phone: phone ? { contains: phone as string, mode: 'insensitive' } : undefined,
      },
      skip,
      take: size,
    });

    // Response with pagination metadata and data
    return new Response(
      JSON.stringify({
        totalClients,
        page: pageNumber,
        pageSize: size,
        totalPages: Math.ceil(totalClients / size),
        clients, // The array of clients for the current page
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving clients:', error);
    return new Response(JSON.stringify({ error: 'Failed to retrieve clients' }), { status: 500 });
  }
}

// POST request handler to create a new client
export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, phone, address } = await req.json();

    // Create new client in the database
    const newClient = await prisma.client.create({
      data: { firstName, lastName, email, phone, address },
    });

    // Return the created client data
    return new Response(JSON.stringify(newClient), { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return new Response(JSON.stringify({ error: 'Failed to create client' }), { status: 500 });
  }
}
