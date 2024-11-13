import { PrismaClient } from '@prisma/client';
import { TaskStatus } from '@prisma/client'

const prisma = new PrismaClient();

export async function PATCH(request: Request) {
  const taskId = request.url.split('/').pop()
  const { status } = await request.json()

  if (!Object.values(TaskStatus).includes(status)) {
    return new Response(JSON.stringify({ error: 'Invalid status' }), { status: 400 })
  }

  const updatedTask = await prisma.task.update({
    where: { id: Number(taskId) },
    data: { status },
  })

  return new Response(JSON.stringify(updatedTask), { status: 200 })
}
