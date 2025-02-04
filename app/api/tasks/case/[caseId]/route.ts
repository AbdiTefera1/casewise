/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/tasks/case/[caseId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Prisma, TaskStatus } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const { caseId } = await params; 
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
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    const where: Prisma.TaskWhereInput = {
      caseId,
      case: {
        organizationId: session.user.organizationId,
        deletedAt: null
      },
      status: status as TaskStatus || undefined
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