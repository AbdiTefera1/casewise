/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/clients/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { validateCreateClientData } from '@/lib/validators';
import { generateClientNumber } from '@/lib/utils'
import { Prisma, ClientStatus, CompanyType } from '@prisma/client';

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

    // Validate client data
    const validationResult = validateCreateClientData(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }

    const {
      firstName,
      middleName,
      lastName,
      email,
      contactInfo,
      type,
      status,
      companyName,
      gender,
      industry,
      website,
      notes,
      customFields
    } = data;

    const client = await prisma.client.create({
      data: {
        firstName,
        middleName,
        lastName,
        email,
        type,
        gender,
        companyName,
        contactInfo,
        industry,
        website,
        notes,
        status,
        customFields,
        organizationId: session.user.organizationId,
        clientNumber: await generateClientNumber(session.user.organizationId)
      },
      include: {
        cases: {
          select: {
            id: true,
            title: true,
            status: true,
          },
          where: {
            deletedAt: null
          },
          take: 5,
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            cases: {
              where: {
                deletedAt: null
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ client }, { status: 201 });

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

    if (session.user.organizationId === null) {
      throw new Error("organizationId cannot be null");
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const industry = searchParams.get('industry');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    const where: Prisma.ClientWhereInput = {
      organizationId: session.user.organizationId,
      deletedAt: null,
      OR: search ? [
        { firstName: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { clientNumber: { contains: search, mode: 'insensitive' } }
      ] : undefined,
      type: type as CompanyType || undefined,
      status: status as ClientStatus || undefined,
      industry: industry || undefined
    };

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder
        },
        include: {
          _count: {
            select: {
              cases: {
                where: {
                  deletedAt: null
                }
              }
            }
          }
        }
      }),
      prisma.client.count({ where })
    ]);

    return NextResponse.json({
      clients,
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