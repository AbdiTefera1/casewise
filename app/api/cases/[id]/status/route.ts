import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json();

    const updatedCase = await prisma.case.update({
      where: { id: parseInt(params.id) },
      data: {
        status,
      },
    });

    return new Response(JSON.stringify(updatedCase), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to update case status', { status: 500 });
  }
}
