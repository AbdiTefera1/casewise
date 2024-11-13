/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Filtering criteria
  const caseId = searchParams.get('caseId')
  const lawyerId = searchParams.get('lawyerId')
  const status = searchParams.get('status')
  const priority = searchParams.get('priority')
  const dueDate = searchParams.get('dueDate')

  // Pagination
  const page = Number(searchParams.get('page')) || 1
  const pageSize = Number(searchParams.get('pageSize')) || 10
  const skip = (page - 1) * pageSize
  const take = pageSize

  // Prisma query with filters and pagination
  const tasks = await prisma.task.findMany({
    where: {
      ...(caseId && { caseId: Number(caseId) }),
      ...(lawyerId && { lawyerId: Number(lawyerId) }),
      ...(status && { status: status.toUpperCase() as any }),
      ...(priority && { priority: priority.toUpperCase() as any }),
      ...(dueDate && { dueDate: new Date(dueDate) }),
    },
    skip, // Skip items for pagination
    take, // Limit the number of results
    include: {
      case: true,
      lawyer: true,
    },
  })

  // Count for pagination metadata
  const totalTasks = await prisma.task.count({
    where: {
      ...(caseId && { caseId: Number(caseId) }),
      ...(lawyerId && { lawyerId: Number(lawyerId) }),
      ...(status && { status: status.toUpperCase() as any }),
      ...(priority && { priority: priority.toUpperCase() as any }),
      ...(dueDate && { dueDate: new Date(dueDate) }),
    },
  })

  const totalPages = Math.ceil(totalTasks / pageSize)

  // Return tasks with pagination metadata
  return new Response(
    JSON.stringify({
      tasks,
      pagination: {
        totalTasks,
        totalPages,
        currentPage: page,
        pageSize,
      },
    }),
    { status: 200 }
  )
}


export async function POST(request: Request) {
    try {
      const taskData = await request.json()
  
      const newTask = await prisma.task.create({
        data: taskData,
      })
  
      return new Response(JSON.stringify(newTask), { status: 201 })
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid data' }), { status: 400 })
    }
  }