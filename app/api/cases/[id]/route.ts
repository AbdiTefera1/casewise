import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const caseDetail = await prisma.case.findUnique({
      where: {
        id: parseInt(params.id),
      },
      include: {
        client: true,
        lawyer: true,
        tasks: true,
        appointment: true,
        document: true,
        invoice: true,
      },
    });

    if (!caseDetail) {
      return new Response('Case not found', { status: 404 });
    }

    return new Response(JSON.stringify(caseDetail), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Something went wrong', { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { title, description, status, priority, deadline } = await request.json();

    const updatedCase = await prisma.case.update({
      where: { id: parseInt(params.id) },
      data: {
        title,
        description,
        status,
        priority,
        deadline,
      },
    });

    return new Response(JSON.stringify(updatedCase), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to update case', { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.case.delete({
      where: { id: parseInt(params.id) },
    });

    return new Response('Case deleted successfully', { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to delete case', { status: 500 });
  }
}
