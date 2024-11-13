import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const taskId = request.url.split('/').pop()

  const task = await prisma.task.findUnique({
    where: { id: Number(taskId) },
    include: {
      case: true,
      lawyer: true,
    },
  })

  if (!task) {
    return new Response(JSON.stringify({ error: 'Task not found' }), { status: 404 })
  }

  return new Response(JSON.stringify(task), { status: 200 })
}

export async function PUT(request: Request) {
  const taskId = request.url.split('/').pop()
  const { title, description, priority, status, dueDate } = await request.json()

  const updatedTask = await prisma.task.update({
    where: { id: Number(taskId) },
    data: {
      title,
      description,
      priority,
      status,
      dueDate: new Date(dueDate),
    },
  })

  return new Response(JSON.stringify(updatedTask), { status: 200 })
}

export async function DELETE(request: Request) {
  const taskId = request.url.split('/').pop()

  await prisma.task.delete({
    where: { id: Number(taskId) },
  })

  return new Response(null, { status: 204 })
}
