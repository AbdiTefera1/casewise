/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/reports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth(req);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [totalCases, totalClients, totalLawyers, totalDocuments] = 
    await Promise.all([
      prisma.case.count(),
      prisma.client.count(),
      prisma.user.count({
        where: { role: 'LAWYER' }
      }),
      prisma.document.count()
    ]);

    return NextResponse.json({
      totalCases,
      totalClients,
      totalLawyers,
      totalDocuments
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate general report' }, 
      { status: 500 }
    );
  }
}