/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/organizations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Prisma } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const session = await auth(request);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { name, domain, settings, contactInfo } = await request.json();

    const existingOrg = await prisma.organization.findFirst({
      where: {
        OR: [
          { name },
          { domain }
        ]
      }
    });

    if (existingOrg) {
      return NextResponse.json(
        { error: 'Organization with this name or domain already exists' },
        { status: 400 }
      );
    }

    const organization = await prisma.organization.create({
      data: {
        name,
        domain,
        settings,
        createdById: session.user.id,
        contactInfo
      }
    });

    return NextResponse.json(
      { organization },
      { status: 201 }
    );
    
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // const where = {
    //   OR: search ? [
    //     { name: { contains: search, mode: 'insensitive' } },
    //     { domain: { contains: search, mode: 'insensitive' } }
    //   ] : undefined,
    //   deletedAt: null
    // };

    // Constructing the where clause
    const where: Prisma.OrganizationWhereInput = {
        OR: search ? [
          { name: { contains: search, mode: 'insensitive' } },
          { domain: { contains: search, mode: 'insensitive' } }
        ] : undefined,
        deletedAt: null
      };

    const [organizations, total] = await Promise.all([
      prisma.organization.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { users: true }
          }
        }
      }),
      prisma.organization.count({ where })
    ]);

    return NextResponse.json({
      organizations,
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