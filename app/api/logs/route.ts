/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/logs/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

interface Props {
  params: { id: string }
}

export async function GET(request: Request, { params }: Props) {
  try {
    const session = await auth(request);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const log = await prisma.activityLog.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    if (!log) {
      return NextResponse.json(
        { error: 'Log entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(log);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve log entry' },
      { status: 500 }
    );
  }
}

