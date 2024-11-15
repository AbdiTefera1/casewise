/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/appointments/lawyer/[lawyerId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { AppointmentStatus, Prisma } from '@prisma/client';

export async function GET(
  request: Request,
  { params }: { params: { lawyerId: string } }
) {
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
    const upcoming = searchParams.get('upcoming') === 'true';
    const date = searchParams.get('date');

    const skip = (page - 1) * limit;

    const where: Prisma.AppointmentWhereInput = {
      lawyerId: params.lawyerId,
      organizationId: session.user.organizationId,
      status: status as AppointmentStatus || undefined,
      startTime: date ? {
        gte: new Date(date),
        lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
      } : upcoming ? {
        gte: new Date()
      } : undefined
    };

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startTime: 'asc' },
        include: {
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