/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/audit.ts
import { prisma } from './prisma';
import { auth } from './auth';
import { headers } from 'next/headers';
import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

interface AuditLogParams {
    action: string;
    entity: string;
    entityId: string;
    details?: any;
    userId?: string;
    organizationId?: string;
  }

export async function createAuditLog(
    req: Request,
    {
      action,
      entity,
      entityId,
      details,
      userId,
      organizationId,
    }: AuditLogParams
  ) {
    try {
      const headersList = headers();
      const session = await auth(req);
  
      if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }
  
      const ipAddress =
        (await headersList).get('x-forwarded-for') || (await headersList).get('x-real-ip') || null;
      const userAgent = (await headersList).get('user-agent') || null;
  
      const data: Prisma.ActivityLogCreateInput = {
        action,
        entity,
        entityId,
        details: details || {},
        user: {
          connect: { id: userId ?? session?.user?.id ?? '' }, // Relating user by ID
        },
        organization: organizationId
          ? { connect: { id: organizationId } } // Relating organization by ID
          : undefined, // Avoid adding null if not provided
        ipAddress,
        userAgent,
      };
  
      const logEntry = await prisma.activityLog.create({ data });
  
      return logEntry;
    } catch (error) {
      console.error('Failed to create audit log:', error);
      return null;
    }
  }
  