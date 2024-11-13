import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const taskId = request.url.split('/').pop()
  const { lawyerId } = await request.json()

  if (!lawyerId) {
    return new Response(JSON.stringify({ error: 'Lawyer ID is required' }), { status: 400 })
  }

  const assignedTask = await prisma.task.update({
    where: { id: Number(taskId) },
    data: { lawyerId },
  })

  return new Response(JSON.stringify(assignedTask), { status: 200 })
}
