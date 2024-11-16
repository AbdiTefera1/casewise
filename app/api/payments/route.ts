/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validatePaymentData } from '@/lib/validators';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const validation = validatePaymentData(data);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Get the invoice to verify it exists and check status
    const invoice = await prisma.invoice.findUnique({
      where: { id: data.invoiceId }
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    if (invoice.status === 'PAID') {
      return NextResponse.json(
        { error: 'Invoice is already paid' },
        { status: 400 }
      );
    }

    // Create payment and update invoice in a transaction
    const payment = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          invoiceId: data.invoiceId,
          amount: data.amount,
          paymentDate: new Date(data.paymentDate),
          method: data.method,
          reference: data.reference,
          notes: data.notes,
        }
      });

    // Calculate total payments for this invoice
const totalPayments = await tx.payment.aggregate({
  where: { invoiceId: data.invoiceId },
  _sum: { amount: true },
});

// Safely handle the possibility of null
const totalPaid = totalPayments._sum?.amount ?? 0;

// Update invoice status if fully paid
if (totalPaid >= invoice.total) {
  await tx.invoice.update({
    where: { id: data.invoiceId },
    data: { status: 'PAID' },
  });
}


      return payment;
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');
    const invoiceId = searchParams.get('invoiceId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = {};
    
    if (invoiceId) {
      where.invoiceId = invoiceId;
    }

    if (startDate && endDate) {
      where.paymentDate = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          invoice: {
            select: {
              invoiceNumber: true,
              client: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { paymentDate: 'desc' }
      }),
      prisma.payment.count({ where })
    ]);

    return NextResponse.json({
      payments,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });
  } catch (error) {
    console.error('Payment listing error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}
