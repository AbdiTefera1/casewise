/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/tasks/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { validateTaskData } from '@/lib/validators';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const task = await prisma.task.findFirst({
      where: {
        id: params.id,
        case: {
          organizationId: session.user.organizationId
        }
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
            caseNumber: true,
            client: {
              select: {
                id: true,
                firstName: true
              }
            }
          }
        }
      }
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ task });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const task = await prisma.task.findFirst({
      where: {
        id: params.id,
        case: {
          organizationId: session.user.organizationId
        }
      }
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    const data = await request.json();
    
    const validationResult = validateTaskData(data, true);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }

    const updatedTask = await prisma.task.update({
      where: { id: params.id },
      data,
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
        }
      }
    });

    return NextResponse.json({ task: updatedTask });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const task = await prisma.task.findFirst({
      where: {
        id: params.id,
        case: {
          organizationId: session.user.organizationId
        }
      }
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    await prisma.task.delete({
      where: { id: params.id }
    });

    return NextResponse.json(
      { message: 'Task deleted successfully' },
      { status: 200 }
    );
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}