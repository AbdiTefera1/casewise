/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/lawyers/[id]/tasks/route.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const tasks = await prisma.task.findMany({
      where: { lawyerId: Number(params.id) },
    });
    return new Response(JSON.stringify(tasks), { status: 200 });
  } catch (error) {
    return new Response('Error fetching lawyer tasks', { status: 500 });
  }
}
