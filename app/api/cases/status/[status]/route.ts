/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/cases/status/[status]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { CaseStatus } from '@prisma/client';

export async function GET(
    request: NextRequest,
  { params }: { params: Promise<{ status: CaseStatus }> }
) {
  try {
    const { status } = await params; 
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


    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const skip = (page - 1) * limit;

    const where = {
      organizationId: session.user.organizationId,
      status: status,
      deletedAt: null
    };

    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          lawyer: {
            select: {
              id: true,
              email: true,
              name: true
            }
          },
        }
      }),
      prisma.case.count({ where })
    ]);

    return NextResponse.json({
      cases,
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