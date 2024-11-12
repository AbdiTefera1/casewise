import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { lawyerId } = await request.json();

    const updatedCase = await prisma.case.update({
      where: { id: parseInt(params.id) },
      data: {
        lawyerId,
      },
    });

    return new Response(JSON.stringify(updatedCase), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to assign lawyer', { status: 500 });
  }
}
