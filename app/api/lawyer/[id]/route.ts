/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/lawyers/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { validateLawyerData } from '@/lib/validators';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; 
    const session = await auth(request);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const lawyer = await prisma.user.findUnique({
      where: {
        id,
        organizationId: session.user.organizationId,
        role: 'LAWYER',
        deletedAt: null
      },
      include: {
        lawyer: true,
        cases: {
          where: {
            deletedAt: null
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10,
          include: {
            client: {
              select: {
                id: true,
                firstName: true,
                email: true
              }
            }
          }
        },
        appointments: {
          where: {
            startTime: {
              gte: new Date()
            }
          },
          orderBy: {
            startTime: 'asc'
          },
          take: 10
        },
        _count: {
          select: {
            cases: {
              where: {
                status: 'ACTIVE'
              }
            }
          }
        }
      }
    });

    if (!lawyer) {
      return NextResponse.json(
        { error: 'Lawyer not found' },
        { status: 404 }
      );
    }

    const { password: _, ...lawyerWithoutPassword } = lawyer;
    return NextResponse.json({ lawyer: lawyerWithoutPassword });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; 
    const session = await auth(request);
    
    if (session?.user.role !== 'ADMIN' && session?.user.id !== id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    const validationResult = validateLawyerData(data, true);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }

    const { lawyer: lawyerData, ...userData } = data;

    const updatedLawyer = await prisma.user.update({
      where: {
        id: id,
        organizationId: session.user.organizationId,
        role: 'LAWYER'
      },
      data: {
        ...userData,
        lawyer: lawyerData ? {
          update: lawyerData
        } : undefined
      },
      include: {
        lawyer: true
      }
    });

    const { password: _, ...lawyerWithoutPassword } = updatedLawyer;
    return NextResponse.json({ lawyer: lawyerWithoutPassword });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; 
    const session = await auth(request);
    
    if (session?.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const activeCases = await prisma.case.count({
      where: {
        lawyerId: id,
        status: 'ACTIVE',
        deletedAt: null
      }
    });

    if (activeCases > 0) {
      return NextResponse.json(
        { error: 'Cannot delete lawyer with active cases' },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.user.update({
        where: {
          id,
          organizationId: session.user.organizationId,
          role: 'LAWYER'
        },
        data: {
          deletedAt: new Date(),
          lawyer: {
            update: {
              status: 'INACTIVE'
            }
          }
        }
      }),
      prisma.case.updateMany({
        where: {
          lawyerId: id,
          status: {
            not: 'ACTIVE'
          }
        },
        data: {
          lawyerId: undefined
        }
      })
    ]);

    return NextResponse.json(
      { message: 'Lawyer profile deleted successfully' },
      { status: 200 }
    );
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}