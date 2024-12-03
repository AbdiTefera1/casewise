/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/reports/case-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth(req);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [casesByStatus, recentCases] = await Promise.all([
      prisma.case.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.case.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          lawyer: { select: { name: true } },
          client: { select: { firstName: true } }
        }
      })
    ]);

    return NextResponse.json({
      statusDistribution: casesByStatus,
      recentCases
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate case status report' }, 
      { status: 500 }
    );
  }
}