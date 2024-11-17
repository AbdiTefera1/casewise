/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/reports/lawyer-performance/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth(req);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const lawyers = await prisma.user.findMany({
      where: { role: 'LAWYER' },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            cases: true,
            tasks: true
          }
        },
        cases: {
          select: {
            status: true
          }
        },
        tasks: {
          select: {
            status: true
          }
        }
      }
    });

    const performanceData = lawyers.map(lawyer => ({
      id: lawyer.id,
      name: lawyer.name,
      totalCases: lawyer._count.cases,
      totalTasks: lawyer._count.tasks,
      completedCases: lawyer.cases.filter(c => c.status === 'ARCHIVED').length,
      completedTasks: lawyer.tasks.filter(t => t.status === 'COMPLETED').length
    }));

    return NextResponse.json({
      performanceData,
      totalLawyers: lawyers.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate lawyer performance report' }, 
      { status: 500 }
    );
  }
}