/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/appointments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { validateAppointmentData } from '@/lib/validators';
import { AppointmentStatus, Prisma } from '@prisma/client';
// import { create } from 'domain';

export async function POST(request: NextRequest) {
  try {
    const session = await auth(request);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.organizationId === null) {
      throw new Error("organizationId cannot be null");
    }

    const data = await request.json();
    const validationResult = validateAppointmentData(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }


    // Convert times to UTC
const startTime = new Date(data.startTime).toISOString();
const endTime = new Date(data.endTime).toISOString();

// Check for time slot availability
const existingAppointment = await prisma.appointment.findFirst({
  where: {
    lawyerId: data.lawyerId,
    appointmentDate: new Date(data.appointmentDate), 
    status: { not: 'CANCELLED' },
    OR: [
      {
        startTime: { lte: startTime },
        endTime: { gte: startTime }
      },
      {
        startTime: { lte: endTime },
        endTime: { gte: endTime }
      },
      {
        startTime: { gte: startTime },
        endTime: { lte: endTime }
      }
    ]
  }
});

if (existingAppointment) {
  return NextResponse.json(
    { error: 'Time slot is not available' },
    { status: 409 }
  );
}

    const appointment = await prisma.appointment.create({
      data: {
        ...data,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        appointmentDate: new Date(data.appointmentDate),
        organizationId: session.user.organizationId,
        updatedAt: new Date(),
        createdAt: new Date()
      },
      include: {
        lawyer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        client: {
          select: {
            id: true,
            firstName: true,
            email: true
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

    return NextResponse.json({ appointment }, { status: 201 });
    
  } catch (error) {
    return NextResponse.json(
      { error: `Internal server error ${error}` },
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const where: Prisma.AppointmentWhereInput = {
      OR: search ? [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { lawyer: { name: { contains: search, mode: 'insensitive' } } },
        { client: { firstName: { contains: search, mode: 'insensitive' } } }
      ] : undefined,
      status: status as AppointmentStatus || undefined,
      startTime: date ? {
        gte: new Date(date),
        lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
      } : undefined,
      organizationId: session.user.organizationId
    };

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startTime: 'asc' },
        include: {
          lawyer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          client: {
            select: {
              id: true,
              firstName: true,
              email: true
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
      prisma.appointment.count({ where })
    ]);

    return NextResponse.json({
      appointments,
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