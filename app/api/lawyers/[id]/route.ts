/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/lawyers/[id]/route.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET a specific lawyer by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const lawyer = await prisma.lawyer.findUnique({
      where: { id: Number(params.id) },
      include: {
        appointments: true,
        cases: true,
        tasks: true,
      },
    });

    if (!lawyer) {
      return new Response('Lawyer not found', { status: 404 });
    }
    return new Response(JSON.stringify(lawyer), { status: 200 });
  } catch (error) {
    return new Response('Error fetching lawyer details', { status: 500 });
  }
}

// PUT update a lawyer's details by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { firstName, lastName, email, phone, address } = await req.json();
    const updatedLawyer = await prisma.lawyer.update({
      where: { id: Number(params.id) },
      data: { firstName, lastName, email, phone, address },
    });
    return new Response(JSON.stringify(updatedLawyer), { status: 200 });
  } catch (error) {
    return new Response('Error updating lawyer', { status: 500 });
  }
}

// DELETE a lawyer by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.lawyer.delete({
      where: { id: Number(params.id) },
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response('Error deleting lawyer', { status: 500 });
  }
}
