// src/app/api/payments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth} from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: {
        invoice: {
          select: {
            invoiceNumber: true,
            total: true,
            client: {
              select: {
                firstName: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Payment fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete payment and update invoice status in a transaction
    await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: params.id },
        include: { invoice: true }
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      await tx.payment.delete({
        where: { id: params.id }
      });

      // Recalculate total payments for the invoice
      const totalPayments = await tx.payment.aggregate({
        where: { invoiceId: payment.invoiceId },
        _sum: { amount: true }
      });

      // Update invoice status if no longer fully paid
      if ((totalPayments._sum.amount ?? 0) < payment.invoice.total) {
        await tx.invoice.update({
          where: { id: payment.invoiceId },
          data: { status: 'UNPAID' }
        });
      }
    });

    return NextResponse.json(
      { message: 'Payment deleted successfully' },
      { status: 200 }
    );
} catch (error) {
    console.error('Payment deletion error:', error);
  
    if (error instanceof Error) {
      if (error.message === 'Payment not found') {
        return NextResponse.json(
          { error: 'Payment not found' },
          { status: 404 }
        );
      }
    }
  
    return NextResponse.json(
      { error: 'Failed to delete payment' },
      { status: 500 }
    );
  }
  
}