/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/reports/financial/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth(req);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [invoiceSummary, paymentSummary, outstandingBalance, recentPayments] = 
    await Promise.all([
      prisma.invoice.groupBy({
        by: ['status'],
        _sum: { total: true },
        _count: true
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        _count: true
      }),
      prisma.invoice.aggregate({
        where: { status: 'UNPAID' },
        _sum: { total: true }
      }),
      prisma.payment.findMany({
        take: 5,
        orderBy: { paymentDate: 'desc' },
        include: {
          invoice: {
            select: {
              invoiceNumber: true,
              client: { select: { name: true } }
            }
          }
        }
      })
    ]);

    return NextResponse.json({
      invoiceSummary,
      paymentSummary,
      outstandingBalance,
      recentPayments
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate financial report' }, 
      { status: 500 }
    );
  }
}