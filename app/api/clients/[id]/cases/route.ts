// /app/api/clients/[id]/cases/route.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET request to retrieve cases for a specific client by ID
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').slice(-2, -1)[0]; // Extract the client ID from the URL

    if (!id) {
      return new Response(JSON.stringify({ error: 'Client ID is required' }), { status: 400 });
    }

    const cases = await prisma.case.findMany({
      where: { clientId: Number(id) },
    });

    return new Response(JSON.stringify(cases), { status: 200 });
  } catch (error) {
    console.error('Error retrieving cases:', error);
    return new Response(JSON.stringify({ error: 'Failed to retrieve cases' }), { status: 500 });
  }
}
