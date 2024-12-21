/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/lawyers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { validateLawyerRegistrationData } from '@/lib/validators';
import { hashPassword } from '@/lib/auth';
import { Prisma } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const session = await auth(request);
    
    if (session?.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    // console.log("Before Validation!")
    const validationResult = validateLawyerRegistrationData(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }
    // console.log("After validation!")

    
    const {
      email,
      password,
      name,
      specializations,
      barNumber,
      licenseStatus,
      jurisdictions,
      hourlyRate,
      contactInfo,
      availability
    } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }
    
    const hashedPassword = await hashPassword(password);

    const lawyer = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'LAWYER',
        organizationId: session.user.organizationId,
        lawyer: {
          create: {
            specializations,
            barNumber,
            licenseStatus,
            jurisdictions,
            hourlyRate,
            contactInfo,
            availability,
            status: 'ACTIVE'
          }
        }
      },
      include: {
        lawyer: true
      }
    });

    const { password: _, ...lawyerWithoutPassword } = lawyer;
    return NextResponse.json(
      { lawyer: lawyerWithoutPassword },
      { status: 201 }
    );
    
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
    const search = searchParams.get('search') || '';
    const specialization = searchParams.get('specialization');
    const status = searchParams.get('status');
    const jurisdiction = searchParams.get('jurisdiction');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      organizationId: session.user.organizationId,
      role: 'LAWYER',
      deletedAt: null,
      OR: search ? [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { lawyer: { barNumber: { contains: search, mode: 'insensitive' } } }
      ] : undefined,
      lawyer: {
        specializations: specialization ? { array_contains: [specialization] } : undefined,
        status: status || undefined,
        jurisdictions: jurisdiction ? { array_contains: [jurisdiction] } : undefined
        // jurisdictions: jurisdiction ? { has: jurisdiction } : undefined
      }
    };

    const [lawyers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder
        },
        include: {
          lawyer: true,
          _count: {
            select: {
              cases: {
                where: {
                  status: 'ACTIVE'
                }
              }
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    const lawyersWithoutPasswords = lawyers.map(lawyer => {
      const { password: _, ...lawyerWithoutPassword } = lawyer;
      return lawyerWithoutPassword;
    });

    return NextResponse.json({
      lawyers: lawyersWithoutPasswords,
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