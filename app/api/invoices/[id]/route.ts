/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/invoices/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { calculateInvoiceTotals } from '@/lib/validators';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: params.id,
        organizationId: session.user.organizationId
      },
      include: {
        items: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        case: {
          select: {
            id: true,
            title: true,
            caseNumber: true
          }
        },
        payments: true
      }
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ invoice });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: params.id,
        organizationId: session.user.organizationId
      }
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    if (data.items) {
      const { subtotal, tax, total } = calculateInvoiceTotals(data.items);
      
      // Update items
      await prisma.invoiceItem.deleteMany({
        where: { invoiceId: params.id }
      });

      interface InvoiceItem {
        description: string;
        quantity: number;
        rate: number;
      }

      const items: InvoiceItem[] = data.items;

      await prisma.invoiceItem.createMany({
        data: items.map((item: InvoiceItem) => ({
          invoiceId: params.id,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.quantity * item.rate,
        })),
      });

      data.subtotal = subtotal;
      data.tax = tax;
      data.total = total;
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        notes: data.notes,
        terms: data.terms,
        status: data.status,
        subtotal: data.subtotal,
        tax: data.tax,
        total: data.total
      },
      include: {
        items: true,
        client: {
          select: {
            id: true,
            name: true,
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

    return NextResponse.json({ invoice: updatedInvoice });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: params.id,
        organizationId: session.user.organizationId
      }
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Check if invoice can be deleted (e.g., no payments)
    const payments = await prisma.payment.count({
      where: { invoiceId: params.id }
    });

    if (payments > 0) {
      return NextResponse.json(
        { error: 'Cannot delete invoice with payments' },
        { status: 400 }
      );
    }

    await prisma.invoice.delete({
      where: { id: params.id }
    });

    return NextResponse.json(
      { message: 'Invoice deleted successfully' }
    );
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}