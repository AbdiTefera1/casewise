import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        caseId: parseInt(params.id),
      },
    });

    return new Response(JSON.stringify(tasks), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to retrieve tasks', { status: 500 });
  }
}
