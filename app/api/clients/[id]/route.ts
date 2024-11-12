// /app/api/clients/[id]/route.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET request to retrieve a specific client by ID
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return new Response(JSON.stringify({ error: 'Client ID is required' }), { status: 400 });
    }

    const client = await prisma.client.findUnique({
      where: { id: Number(id) },
    });

    if (client) {
      return new Response(JSON.stringify(client), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: 'Client not found' }), { status: 404 });
    }
  } catch (error) {
    console.error('Error retrieving client:', error);
    return new Response(JSON.stringify({ error: 'Failed to retrieve client' }), { status: 500 });
  }
}

// PUT request to update a specific client by ID
export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return new Response(JSON.stringify({ error: 'Client ID is required' }), { status: 400 });
    }

    const { firstName, lastName, email, phone, address } = await req.json();

    const updatedClient = await prisma.client.update({
      where: { id: Number(id) },
      data: { firstName, lastName, email, phone, address },
    });

    return new Response(JSON.stringify(updatedClient), { status: 200 });
  } catch (error) {
    console.error('Error updating client:', error);
    return new Response(JSON.stringify({ error: 'Failed to update client' }), { status: 500 });
  }
}

// DELETE request to delete a specific client by ID
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return new Response(JSON.stringify({ error: 'Client ID is required' }), { status: 400 });
    }

    await prisma.client.delete({ where: { id: Number(id) } });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting client:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete client' }), { status: 500 });
  }
}
