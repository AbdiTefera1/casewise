/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/cases/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {generateCaseNumber} from '@/lib/utils';
import { auth } from '@/lib/auth';
import { CaseStatus, Prisma } from '@prisma/client';
import { validateCaseData } from '@/lib/validators';

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
        throw new Error("organizationId cannot be null");
    }

    const data = await request.json();

    const { success, error } = validateCaseData(data);
        
    if (!success) {
      return NextResponse.json(
        { error: error },
        { status: 400 }
      );
    }

    const {
      clientId,
      title,
      description,
      caseType,
      caseSubType,
      stageOfCase,
      filingNumber,
      filingDate,
      act,
      firstHearingDate,
      policeStation,
      firNumber,
      firDate,
      status,
      priority,
      startDate,
      endDate,
      courts,
      assignedToId
    } = data;

    const case_ = await prisma.case.create({
      data: {
        title,
        description,
        caseType,
        caseSubType,
        stageOfCase,
        filingNumber,
        filingDate: new Date(filingDate),
        act,
        firstHearingDate: new Date(firstHearingDate),
        policeStation,
        firNumber,
        firDate: new Date(firDate),
        status,
        priority,
        endDate: endDate ? new Date(endDate) : null,
        organizationId: session.user.organizationId,
        lawyerId: assignedToId,
        caseNumber: await generateCaseNumber(session.user.organizationId),
        clientId: clientId,                 
        startDate: new Date(startDate) || new Date(),
        courts: {
          create: courts
        }
      },
      include: {
        lawyer: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        courts: true
        
      }
    });

    return NextResponse.json({ case: case_ }, { status: 201 });
    
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

    if(session.user.organizationId === null){
        throw new Error("organizationId cannot be null");
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const assignedToId = searchParams.get('assignedToId');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');

    const skip = (page - 1) * limit;


    const where: Prisma.CaseWhereInput = {
        organizationId: session.user.organizationId,
        deletedAt: null,
        OR: search ? [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
          { caseNumber: { contains: search, mode: 'insensitive' as const } }
        ] : undefined,
        status: status as CaseStatus || undefined,
        lawyerId: assignedToId || undefined,
        createdAt: {
          gte: fromDate ? new Date(fromDate) : undefined,
          lte: toDate ? new Date(toDate) : undefined
        }
      };
      

    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          lawyer: {
            select: {
              id: true,
              email: true,
              name: true
            }
          },
        }
      }),
      prisma.case.count({ where })
    ]);

    if(total === 0){
      console.log("no cases")
    }else{
      console.log("something went wrong")
    }

    return NextResponse.json({
      cases,
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