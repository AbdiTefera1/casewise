/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/appointments/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { validateAppointmentData } from '@/lib/validators';

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

    const appointment = await prisma.appointment.findFirst({
      where: {
        id: params.id,
        organizationId: session.user.organizationId
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
            name: true,
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

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ appointment });
    
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

    const appointment = await prisma.appointment.findFirst({
      where: {
        id: params.id,
        organizationId: session.user.organizationId
      }
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    const data = await request.json();
    
    const validationResult = validateAppointmentData(data, true);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }

    if (data.startTime && data.endTime) {
      // Check for time slot availability
      const existingAppointment = await prisma.appointment.findFirst({
        where: {
          id: { not: params.id },
          lawyerId: appointment.lawyerId,
          startTime: {
            lte: new Date(data.endTime)
          },
          endTime: {
            gte: new Date(data.startTime)
          },
          status: {
            not: 'CANCELLED'
          }
        }
      });

      if (existingAppointment) {
        return NextResponse.json(
          { error: 'Time slot is not available' },
          { status: 409 }
        );
      }
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: params.id },
      data: {
        ...data,
        startTime: data.startTime ? new Date(data.startTime) : undefined,
        endTime: data.endTime ? new Date(data.endTime) : undefined
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
            name: true,
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

    return NextResponse.json({ appointment: updatedAppointment });
    
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

    const appointment = await prisma.appointment.findFirst({
      where: {
        id: params.id,
        organizationId: session.user.organizationId
      }
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    await prisma.appointment.update({
      where: { id: params.id },
      data: { status: 'CANCELLED' }
    });

    return NextResponse.json(
      { message: 'Appointment cancelled successfully' },
      { status: 200 }
    );
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}