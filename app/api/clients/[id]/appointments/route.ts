// /app/api/clients/[id]/appointments/route.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET request to retrieve appointments for a specific client by ID
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').slice(-2, -1)[0]; // Extract the client ID from the URL

    if (!id) {
      return new Response(JSON.stringify({ error: 'Client ID is required' }), { status: 400 });
    }

    const appointments = await prisma.appointment.findMany({
      where: { clientId: Number(id) },
    });

    return new Response(JSON.stringify(appointments), { status: 200 });
  } catch (error) {
    console.error('Error retrieving appointments:', error);
    return new Response(JSON.stringify({ error: 'Failed to retrieve appointments' }), { status: 500 });
  }
}
