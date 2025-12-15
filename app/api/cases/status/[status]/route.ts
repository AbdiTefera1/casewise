/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/cases/status/[status]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { CaseStatus } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ status: string }> }
) {
  try {
    const { status } = await params;

    // Validate that the incoming status is a valid CaseStatus enum value
    const upperStatus = status.toUpperCase() as keyof typeof CaseStatus;
    if (!(upperStatus in CaseStatus)) {
      return NextResponse.json(
        {
          error: `Invalid status. Valid values are: ${Object.values(CaseStatus).join(', ')}`
        },
        { status: 400 }
      );
    }

    const validStatus = CaseStatus[upperStatus]; // Properly typed as CaseStatus

    const session = await auth(request);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.organizationId === null) {
      throw new Error('organizationId cannot be null');
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const skip = (page - 1) * limit;

    const where = {
      organizationId: session.user.organizationId,
      status: validStatus, // Now correctly defined and type-safe
      deletedAt: null,
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
              name: true,
            },
          },
        },
      }),
      prisma.case.count({ where }),
    ]);

    return NextResponse.json({
      cases,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Cases status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}