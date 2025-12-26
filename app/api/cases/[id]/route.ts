/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/cases/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; 
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

    const case_ = await prisma.case.findUnique({
      where: {
        id,
        organizationId: session.user.organizationId,
        deletedAt: null
      },
      include: {
        lawyer: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        courts: true,
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!case_) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ case: case_ });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper to safely parse YYYY-MM-DD into Date (assumes midnight UTC)
function parseDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;

  // Validate basic YYYY-MM-DD format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`);
  }

  const date = new Date(dateStr + 'T00:00:00.000Z'); // Treat as UTC midnight
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${dateStr}`);
  }
  return date;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth(request);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user.organizationId) {
      return NextResponse.json(
        { error: 'User does not belong to an organization' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      status,
      assignedToId,
      title,
      description,
      judge,
      caseType,
      caseSubType,
      stageOfCase,
      filingNumber,
      filingDate: rawFilingDate,
      act,
      firstHearingDate: rawFirstHearingDate,
      nextHearingDate: rawNextHearingDate,
      policeStation,
      firNumber,
      firDate: rawFirDate,
      transferDate: rawTransferDate,
      fromCourt,
      toCourt,
      priority,
      caseNumber,
      startDate: rawStartDate,
      endDate: rawEndDate,
    } = body;

    // Parse all dates safely
    const filingDate = parseDate(rawFilingDate);
    const firstHearingDate = parseDate(rawFirstHearingDate);
    const nextHearingDate = parseDate(rawNextHearingDate);
    const firDate = parseDate(rawFirDate);
    const transferDate = parseDate(rawTransferDate);
    const startDate = parseDate(rawStartDate);
    const endDate = parseDate(rawEndDate);

    // Build update data with only allowed fields
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (judge !== undefined) updateData.judge = judge || null;
    if (caseType !== undefined) updateData.caseType = caseType;
    if (caseSubType !== undefined) updateData.caseSubType = caseSubType;
    if (stageOfCase !== undefined) updateData.stageOfCase = stageOfCase;
    if (filingNumber !== undefined) updateData.filingNumber = filingNumber;
    if (act !== undefined) updateData.act = act;
    if (policeStation !== undefined) updateData.policeStation = policeStation;
    if (firNumber !== undefined) updateData.firNumber = firNumber;
    if (fromCourt !== undefined) updateData.fromCourt = fromCourt || null;
    if (toCourt !== undefined) updateData.toCourt = toCourt || null;
    if (priority !== undefined) updateData.priority = priority;
    if (caseNumber !== undefined) updateData.caseNumber = caseNumber;

    // Dates - only set if valid
    if (filingDate !== null) updateData.filingDate = filingDate;
    if (firstHearingDate !== null) updateData.firstHearingDate = firstHearingDate;
    if (nextHearingDate !== null) updateData.nextHearingDate = nextHearingDate;
    if (firDate !== null) updateData.firDate = firDate;
    if (transferDate !== null) updateData.transferDate = transferDate;
    if (startDate !== null) updateData.startDate = startDate;
    if (endDate !== null) updateData.endDate = endDate;

    // Special fields
    if (status !== undefined) updateData.status = status;
    if (assignedToId !== undefined) updateData.lawyerId = assignedToId || null;

    // Optional: if no changes, return early
    if (Object.keys(updateData).length === 1) {
      return NextResponse.json({ message: 'No changes to update' }, { status: 200 });
    }

    const updatedCase = await prisma.case.update({
      where: {
        id,
        organizationId: session.user.organizationId,
      },
      data: updateData,
      include: {
        lawyer: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        client: true,
        courts: true,
      },
    });

    return NextResponse.json({ case: updatedCase });
  } catch (error: any) {
    console.error('Case PATCH error:', error);

    // Better error response in development
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        {
          error: 'Failed to update case',
          details: error.message,
          stack: error.stack,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
  
// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params;
//     const session = await auth(request);

//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     if (!session.user.organizationId) {
//       throw new Error("organizationId cannot be null");
//     }

//     const body = await request.json();

//     const {
//       status,
//       assignedToId,
//       courts,
//       lawyer,
//       client,
//       createdAt,
//       updatedAt,
//       organizationId,
//       deletedAt,
//       lawyerId,
//       ...safeUpdateData
//     } = body;

//     /**
//      * Activity log
//      */
//     const activityChanges: Record<string, { from: any; to: any }> = {};

//     if (status) {
//       activityChanges.status = { from: undefined, to: status };
//     }

//     if (assignedToId) {
//       activityChanges.assignedTo = { from: undefined, to: assignedToId };
//     }

//     /**
//      * Build Prisma update payload safely
//      */
//     const updatePayload: any = {
//       ...safeUpdateData,
//       updatedAt: new Date(),
//     };

//     if (status) {
//       updatePayload.status = status;
//     }

//     if (assignedToId) {
//       updatePayload.lawyerId = assignedToId;
//     }

//     /**
//      * Handle courts relation (replace strategy)
//      */
//     if (Array.isArray(courts)) {
//       updatePayload.courts = {
//         deleteMany: {}, // remove old courts
//         create: courts.map((court: any) => ({
//           courtNo: court.courtNo,
//           courtType: court.courtType,
//           court: court.court,
//           judgeType: court.judgeType,
//           judgeName: court.judgeName,
//           remarks: court.remarks,
//         })),
//       };
//     }

//     console.log("SAFE UPDATE PAYLOAD:", Object.keys(updatePayload));

//     /**
//      * Transaction
//      */
//     const [updatedCase] = await prisma.$transaction([
//       prisma.case.update({
//         where: {
//           id,
//           organizationId: session.user.organizationId,
//         },
//         data: updatePayload,
//         include: {
//           lawyer: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//             },
//           },
//           client: {
//             select: {
//               id: true,
//               firstName: true,
//               lastName: true,
//             },
//           },
//           courts: true,
//         },
//       }),
//     ]);

//     return NextResponse.json({ case: updatedCase });
//   } catch (error) {
//     console.error("CASE UPDATE ERROR:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; 
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

    await prisma.$transaction([
      prisma.case.update({
        where: {
          id,
          organizationId: session.user.organizationId
        },
        data: { 
          deletedAt: new Date(),
        }
      }),
    ]);

    return NextResponse.json(
      { message: 'Case deleted successfully' },
      { status: 200 }
    );
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}