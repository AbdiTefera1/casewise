// app/api/tasks/priority/[priorityId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Prisma, TaskPriority, TaskStatus } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ priorityId: string }> }  // ← Changed to priorityId
) {
  try {
    const { priorityId } = await params;  // ← Now priorityId
    const session = await auth(request);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.organizationId === null) {
      throw new Error("Organization Id cannot be null!");
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const statusParam = searchParams.get('status');

    const skip = (page - 1) * limit;

    // Validate and convert priorityId to uppercase enum value
    const upperPriority = priorityId.toUpperCase();
    if (!(upperPriority in TaskPriority)) {
      return NextResponse.json(
        {
          error: `Invalid priority. Valid values: ${Object.values(TaskPriority).join(', ')}`
        },
        { status: 400 }
      );
    }

    const validPriority = upperPriority as TaskPriority;

    // Optional status validation
    let validStatus: TaskStatus | undefined;
    if (statusParam) {
      const upperStatus = statusParam.toUpperCase();
      if (!(upperStatus in TaskStatus)) {
        return NextResponse.json(
          {
            error: `Invalid status. Valid values: ${Object.values(TaskStatus).join(', ')}`
          },
          { status: 400 }
        );
      }
      validStatus = upperStatus as TaskStatus;
    }

    const where: Prisma.TaskWhereInput = {
      priority: validPriority,
      case: {
        organizationId: session.user.organizationId,
        deletedAt: null
      },
      status: validStatus,
      assignedTo: session.user.role === 'LAWYER' ? session.user.id : undefined
    };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { deadline: 'asc' },
        include: {
          assignee: {
            select: { id: true, name: true, email: true }
          },
          case: {
            select: { id: true, title: true, caseNumber: true }
          }
        }
      }),
      prisma.task.count({ where })
    ]);

    return NextResponse.json({
      tasks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Tasks by priority error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}