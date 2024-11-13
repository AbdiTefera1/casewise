/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/lawyers/[id]/appointments/route.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { lawyerId: Number(params.id) },
    });
    return new Response(JSON.stringify(appointments), { status: 200 });
  } catch (error) {
    return new Response('Error fetching lawyer appointments', { status: 500 });
  }
}
