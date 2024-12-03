/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/invoices/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { validateInvoiceData, calculateInvoiceTotals } from '@/lib/validators';
import { Prisma } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const session = await auth(request);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if(session.user.organizationId === null){
      throw new Error("Organization Id cannot null!")
    }

    const data = await request.json();
    
    const validationResult = validateInvoiceData(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }

    // Calculate totals
    const { subtotal, tax, total } = calculateInvoiceTotals(data.items);

    // Generate invoice number
    const lastInvoice = await prisma.invoice.findFirst({
      where: { organizationId: session.user.organizationId },
      orderBy: { invoiceNumber: 'desc' }
    });
    
    const nextInvoiceNumber = lastInvoice 
      ? String(Number(lastInvoice.invoiceNumber) + 1).padStart(6, '0')
      : '000001';

      interface InvoiceItem {
        description: string;
        quantity: number;
        rate: number;
      }

      const items: InvoiceItem[] = data.items;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: nextInvoiceNumber,
        clientId: data.clientId,
        caseId: data.caseId,
        dueDate: new Date(data.dueDate),
        notes: data.notes,
        terms: data.terms,
        status: 'UNPAID',
        subtotal,
        tax,
        total,
        organizationId: session.user.organizationId,
        createdById: session.user.id,
        items: {
          create: items.map((item: InvoiceItem) => ({
            description: item.description, 
            quantity: item.quantity,
            rate: item.rate,
            amount: item.quantity * item.rate
          }))
        }
      },
      include: {
        items: true,
        client: {
          select: {
            id: true,
            firstName: true,
            email: true,
            
          }
        },
        case: {
          select: {
            id: true,
            title: true,
            caseNumber: true
          }
        }
      }
    });

    return NextResponse.json({ invoice }, { status: 201 });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth(request);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if(session.user.organizationId === null){
      throw new Error("Organization Id cannot null!")
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const minAmount = searchParams.get('minAmount');
    const maxAmount = searchParams.get('maxAmount');

    const skip = (page - 1) * limit;

    const where: Prisma.InvoiceWhereInput = {
      organizationId: session.user.organizationId,
      OR: search ? [
        { invoiceNumber: { contains: search } },
        { client: { firstName: { contains: search, mode: 'insensitive' } } },
        { case: { title: { contains: search, mode: 'insensitive' } } }
      ] : undefined,
      createdAt: {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined
      },
      total: {
        gte: minAmount ? parseFloat(minAmount) : undefined,
        lte: maxAmount ? parseFloat(maxAmount) : undefined
      }
    };

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          client: {
            select: {
              id: true,
              firstName: true,
              email: true,
            }
          },
          case: {
            select: {
              id: true,
              title: true,
              caseNumber: true
            }
          }
        }
      }),
      prisma.invoice.count({ where })
    ]);

    return NextResponse.json({
      invoices,
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