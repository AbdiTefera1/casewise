/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { validateTaskData } from '@/lib/validators';
import { Prisma, TaskPriority, TaskStatus } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const session = await auth(request);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.organizationId === null){
        throw new Error("Organization Id cannot null!")
    }

    const data = await request.json();
    console.log("Before validation!")

    const validationResult = validateTaskData(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }
    console.log("After validation!")

    const { 
      title,
      description,
      priority,
      status,
      caseId,
      assignedTo,
      clientId,
      startDate,
      deadline
    } = data;
    // Check if the case exists and user has access
    const case_ = await prisma.case.findFirst({
      where: {
        id: data.caseId,
        organizationId: session.user.organizationId,
        deletedAt: null
      }
    });

    if (!case_) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        status,
        caseId,
        assignedTo,
        clientId,
        startDate,
        deadline,
        organizationId: session.user.organizationId
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        case: {
          select: {
            id: true,
            title: true,
            caseNumber: true
          }
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return NextResponse.json({ task }, { status: 201 });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth(request);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.organizationId === null){
        throw new Error("Organization Id cannot null!")
    }
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const deadline = searchParams.get('deadline');
    const priority = searchParams.get('priority');

    const skip = (page - 1) * limit;

    const where: Prisma.TaskWhereInput = {
      case: {
        organizationId: session.user.organizationId,
        deletedAt: null
      },
      OR: search ? [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ] : undefined,
      status: status as TaskStatus || undefined,
      priority: priority as TaskPriority || undefined,
      deadline: deadline ? {
        gte: new Date(deadline),
        lt: new Date(new Date(deadline).setDate(new Date(deadline).getDate() + 1))
      } : undefined,
      assignedTo: session.user.role === 'LAWYER' ? session.user.id : undefined
    };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { priority: 'desc' },
          { deadline: 'asc' }
        ],
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          case: {
            select: {
              id: true,
              title: true,
              caseNumber: true
            }
          },
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}