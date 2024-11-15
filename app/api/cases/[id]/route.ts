/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/cases/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(
  request: Request,
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

    if(session.user.organizationId === null){
        throw new Error("organizationId cannot be null");
    }

    const case_ = await prisma.case.findUnique({
      where: {
        id: params.id,
        organizationId: session.user.organizationId,
        deletedAt: null
      },
      include: {
        lawyer: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
      }
    });

    if (!case_) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ case: case_ });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
    request: Request,
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
  
      if(session.user.organizationId === null){
        throw new Error("organizationId cannot be null");
    }

      const data = await request.json();
      const { status, assignedToId, ...updateData } = data;
  
      // Create activity log entry
      const activityData: {
        caseId: string;
        userId: string;
        changes: Record<string, { from: any; to: any }>;
      } = {
        caseId: params.id,
        userId: session.user.id,
        changes: {}
      };
  
      if (status) {
        activityData.changes['status'] = { from: undefined, to: status };
      }
      if (assignedToId) {
        activityData.changes['assignedTo'] = { from: undefined, to: assignedToId };
      }
  
      const [updatedCase] = await prisma.$transaction([
        prisma.case.update({
          where: {
            id: params.id,
            organizationId: session.user.organizationId
          },
          data: {
            ...updateData,
            status,
            lawyerId: assignedToId,
            updatedAt: new Date()
          },
          include: {
            lawyer: {
              select: {
                id: true,
                email: true,
                name: true
              }
            }
          }
        }),
      ]);
  
      return NextResponse.json({ case: updatedCase });
      
    } catch (error) {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
  

export async function DELETE(
  request: Request,
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

    if(session.user.organizationId === null){
        throw new Error("organizationId cannot be null");
    }

    await prisma.$transaction([
      prisma.case.update({
        where: {
          id: params.id,
          organizationId: session.user.organizationId
        },
        data: { 
          deletedAt: new Date(),
        }
      }),
    ]);

    return NextResponse.json(
      { message: 'Case deleted successfully' },
      { status: 200 }
    );
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}